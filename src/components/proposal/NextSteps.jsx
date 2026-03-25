import SignatureField from './SignatureField'

export default function NextSteps({ proposal, clientEditable, agencyEditable, onClientSave, onAgencySave }) {
  const steps = proposal.next_steps || []

  return (
    <div className="bg-[#0d1b2a]">
      <div className="px-16 py-20">
        <h2 className="text-white font-bold text-4xl mb-12">Next Steps</h2>

        <div className="grid grid-cols-2 gap-16">
          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#c8e63c] text-[#0d1b2a] font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-[#b0c0d4] text-sm leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>

          {/* Signature block */}
          <div className="bg-[#1a2d42] rounded-2xl p-8 space-y-8">
            {/* Client signature */}
            <div>
              <SignatureField
                label="Client Signature"
                value={proposal.client_signature_data}
                editable={!!clientEditable}
                fallbackName={proposal.client_signature_name || proposal.client_name}
                onSave={onClientSave}
                darkBg
              />
              {!proposal.client_signature_data && (
                <>
                  <p className="text-white text-sm font-medium mt-2">{proposal.client_signature_name || proposal.client_name}</p>
                  <p className="text-[#8a9bb0] text-xs">{proposal.client_signature_role || proposal.client_role}</p>
                  <p className="text-[#8a9bb0] text-xs">{proposal.client_signature_company || proposal.client_company}</p>
                </>
              )}
              {proposal.client_signature_data && (
                <>
                  <p className="text-white text-sm font-medium mt-2">{proposal.client_signature_name || proposal.client_name}</p>
                  <p className="text-[#8a9bb0] text-xs">{proposal.client_signature_role || proposal.client_role}</p>
                  <p className="text-[#8a9bb0] text-xs">{proposal.client_signature_company || proposal.client_company}</p>
                </>
              )}
            </div>

            {/* Agency signature */}
            <div>
              <SignatureField
                label={`Authorised by ${proposal.sender_signature_company || proposal.agency_name}`}
                value={proposal.sender_signature_data}
                editable={!!agencyEditable}
                fallbackName={proposal.sender_signature_name || proposal.sender_name}
                onSave={onAgencySave}
                darkBg
              />
              {!proposal.sender_signature_data && (
                <>
                  <p className="text-white text-sm font-medium mt-2">{proposal.sender_signature_name || proposal.sender_name}</p>
                  <p className="text-[#8a9bb0] text-xs">{proposal.sender_signature_title}</p>
                  <p className="text-[#8a9bb0] text-xs">{proposal.sender_signature_company || proposal.agency_name}</p>
                </>
              )}
              {proposal.sender_signature_data && (
                <>
                  <p className="text-white text-sm font-medium mt-2">{proposal.sender_signature_name || proposal.sender_name}</p>
                  <p className="text-[#8a9bb0] text-xs">{proposal.sender_signature_title}</p>
                  <p className="text-[#8a9bb0] text-xs">{proposal.sender_signature_company || proposal.agency_name}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="bg-[#c8e63c] px-16 py-6">
        <p className="text-[#0d1b2a] font-semibold text-sm">
          {proposal.footer_tagline}
        </p>
        <p className="text-[#0d1b2a]/70 text-xs mt-1">
          {proposal.agency_name} · {proposal.agency_website} · {proposal.agency_email}
        </p>
      </div>
    </div>
  )
}
