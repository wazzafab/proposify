import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { proposalId, signerName } = await req.json()

    if (!proposalId || !signerName?.trim()) {
      return new Response(JSON.stringify({ error: 'proposalId and signerName are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch proposal
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('id, slug, proposal_title, client_name, client_email, agency_name, agency_email, status')
      .eq('id', proposalId)
      .single()

    if (fetchError || !proposal) {
      return new Response(JSON.stringify({ error: 'Proposal not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (proposal.status === 'approved') {
      return new Response(JSON.stringify({ error: 'Proposal already signed' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get signer IP
    const signerIp = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || null

    // Update proposal status
    const { error: updateError } = await supabase
      .from('proposals')
      .update({
        status: 'approved',
        signed_at: new Date().toISOString(),
        signed_by_name: signerName.trim(),
        signed_by_ip: signerIp,
        client_signature_name: signerName.trim(),
      })
      .eq('id', proposalId)

    if (updateError) throw updateError

    // Send emails via Resend
    const resendKey = Deno.env.get('RESEND_API_KEY')
    const proposalUrl = `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/p/${proposal.slug}`
    const title = proposal.proposal_title || 'Proposal'
    const clientName = proposal.client_name || 'Your client'
    const agencyName = proposal.agency_name || 'Mind The Hat'

    if (resendKey) {
      // Email to agency
      if (proposal.agency_email) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${agencyName} Proposals <onboarding@resend.dev>`,
            to: [proposal.agency_email],
            subject: `✓ Proposal accepted — ${clientName}`,
            html: `
              <p>Good news — <strong>${signerName}</strong> has signed and accepted the <em>${title}</em> proposal.</p>
              <p><a href="${proposalUrl}">View the signed proposal →</a></p>
              <p style="color:#888;font-size:12px;">Signed on ${new Date().toLocaleDateString('en-ZA', { dateStyle: 'long' })}</p>
            `,
          }),
        })
      }

      // Email to client
      if (proposal.client_email) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${agencyName} <onboarding@resend.dev>`,
            to: [proposal.client_email],
            subject: `Your signed proposal — ${title}`,
            html: `
              <p>Hi ${clientName},</p>
              <p>Thank you for accepting our proposal. You can view your signed copy at any time using the link below.</p>
              <p><a href="${proposalUrl}">View your signed proposal →</a></p>
              <p>We'll be in touch shortly with next steps.</p>
              <p>— The ${agencyName} Team</p>
            `,
          }),
        })
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
