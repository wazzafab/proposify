import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import CoverPage from '../components/proposal/CoverPage'
import IntroLetter from '../components/proposal/IntroLetter'
import AboutSection from '../components/proposal/AboutSection'
import ScopeOfServices from '../components/proposal/ScopeOfServices'
import FeesAndPricing from '../components/proposal/FeesAndPricing'
import NextSteps from '../components/proposal/NextSteps'
import Toast from '../components/Toast'

function PageDivider({ label }) {
  return (
    <div className="no-print flex items-center gap-4 py-5 px-2">
      <div className="flex-1 border-t border-dashed border-gray-300" />
      <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">{label}</span>
      <div className="flex-1 border-t border-dashed border-gray-300" />
    </div>
  )
}


export default function ProposalView({ isPublic = false }) {
  const { id, slug } = useParams()
  const navigate = useNavigate()
  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from('proposals').select('*')
      if (isPublic) query = query.eq('slug', slug)
      else query = query.eq('id', id)

      const { data, error } = await query.single()
      if (error || !data) {
        setLoading(false)
        return
      }
      setProposal(data)
      setLoading(false)
    }
    fetch()
  }, [id, slug, isPublic])

  const handleCopyLink = () => {
    const url = `${window.location.origin}/p/${proposal.slug}`
    navigator.clipboard.writeText(url)
    setToast({ message: 'Share link copied!', type: 'success' })
  }

  const handleClientSave = async (sigData) => {
    const { error } = await supabase
      .from('proposals')
      .update({ client_signature_data: sigData })
      .eq('id', proposal.id)
    if (error) { setToast({ message: 'Failed to save signature', type: 'error' }); return }
    setProposal(prev => ({ ...prev, client_signature_data: sigData }))

    // Trigger approval flow via edge function
    const functionsUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
    try {
      await fetch(`${functionsUrl}/sign-proposal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          proposalId: proposal.id,
          signerName: sigData.type === 'typed' ? sigData.text : (proposal.client_name || 'Client'),
        }),
      })
    } catch (_) { /* emails optional */ }

    setProposal(prev => ({ ...prev, status: 'approved', signed_at: new Date().toISOString() }))
    setToast({ message: 'Proposal signed!', type: 'success' })
  }

  const handleAgencySave = async (sigData) => {
    const { error } = await supabase
      .from('proposals')
      .update({ sender_signature_data: sigData })
      .eq('id', proposal.id)
    if (error) { setToast({ message: 'Failed to save signature', type: 'error' }); return }
    setProposal(prev => ({ ...prev, sender_signature_data: sigData }))
    setToast({ message: 'Signature saved', type: 'success' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center text-[#8a9bb0]">
        Loading...
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-[#0d1b2a] flex flex-col items-center justify-center text-center px-6">
        <p className="text-[#8a9bb0] text-lg mb-4">Proposal not found.</p>
        {!isPublic && (
          <Link to="/" className="text-[#c8e63c] text-sm hover:underline">Back to dashboard</Link>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Internal toolbar — not shown in public view */}
      {!isPublic && (
        <div className="no-print bg-[#0d1b2a] border-b border-[#1a2d42] px-6 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-[#8a9bb0] hover:text-white text-sm transition-colors"
            >
              ← Dashboard
            </button>
            <span className="text-[#8a9bb0] text-xs">
              {proposal.client_company || proposal.client_name}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 text-xs text-[#0d1b2a] bg-[#c8e63c] hover:bg-[#a8c420] rounded-lg font-medium transition-colors"
            >
              Share Link
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs text-[#b0c0d4] bg-[#1a2d42] hover:bg-[#1f3350] rounded-lg transition-colors"
            >
              Print / PDF
            </button>
            <button
              onClick={() => navigate(`/proposals/${proposal.id}/edit`)}
              className="px-3 py-1.5 text-xs text-[#b0c0d4] bg-[#1a2d42] hover:bg-[#1f3350] rounded-lg transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {/* Proposal document */}
      <div className={`print-wrapper ${!isPublic ? 'bg-gray-100 min-h-screen py-8' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <div className="print-page shadow-xl overflow-hidden rounded-lg">
            <CoverPage proposal={proposal} />
          </div>
          <PageDivider label="Page 2" />
          <div className="print-page shadow-xl overflow-hidden rounded-lg">
            <IntroLetter proposal={proposal} />
          </div>
          <PageDivider label="Page 3" />
          <div className="print-page shadow-xl overflow-hidden rounded-lg">
            <AboutSection proposal={proposal} />
          </div>
          <PageDivider label="Page 4" />
          <div className="print-page shadow-xl overflow-hidden rounded-lg">
            <ScopeOfServices proposal={proposal} />
          </div>
          <PageDivider label="Page 5" />
          <div className="print-page shadow-xl overflow-hidden rounded-lg">
            <FeesAndPricing proposal={proposal} />
          </div>
          <PageDivider label="Page 6" />
          <div className="print-page shadow-xl overflow-hidden rounded-lg">
            <NextSteps
              proposal={proposal}
              clientEditable={isPublic}
              agencyEditable={!isPublic}
              onClientSave={handleClientSave}
              onAgencySave={handleAgencySave}
            />
          </div>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
