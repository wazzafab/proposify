import bgImage from '../../assets/mindthehat-maninhat.png'

export default function CoverPage({ proposal }) {
  return (
    <div className="min-h-screen bg-[#0d1b2a] flex flex-col px-16 py-12 relative overflow-hidden">
      {/* Faint background image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-right bg-contain pointer-events-none"
        style={{ backgroundImage: `url(${bgImage})`, opacity: 0.07 }}
      />
      {/* Top: Agency */}
      <div>
        <p className="text-white font-bold text-lg">{proposal.agency_name}</p>
        <p className="text-[#8a9bb0] text-sm">{proposal.agency_website}</p>
      </div>

      {/* Center: Client Company */}
      <div className="flex-1 flex flex-col justify-end pb-16">
        <p className="text-[#8a9bb0] text-xs tracking-[0.2em] uppercase mb-4">
          {proposal.proposal_title || 'Digital Growth Proposal'}
        </p>
        <h1 className="text-white font-bold text-6xl leading-tight mb-10">
          {proposal.client_company || proposal.client_name}
        </h1>

        <div>
          <p className="text-[#8a9bb0] text-xs tracking-[0.2em] uppercase mb-3">Prepared For</p>
          <p className="text-[#c8e63c] font-semibold text-base">{proposal.client_name}</p>
          <p className="text-[#8a9bb0] text-sm">{proposal.client_role}</p>
          <p className="text-[#8a9bb0] text-sm">{proposal.client_email}</p>
          <p className="text-[#8a9bb0] text-sm">{proposal.client_phone}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-[#8a9bb0] text-xs pt-4 border-t border-[#162436]">
        <span>{proposal.sender_name}</span>
        <span>{proposal.agency_email}</span>
        <span>{proposal.proposal_date}</span>
      </div>

      {/* Lime accent bar on left */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c8e63c]" />
    </div>
  )
}
