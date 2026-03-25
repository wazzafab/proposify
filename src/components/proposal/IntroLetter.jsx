export default function IntroLetter({ proposal }) {
  return (
    <div className="min-h-screen bg-[#0d1b2a] px-16 py-20 flex items-center">
      <div className="bg-[#1a2d42] rounded-2xl p-12 max-w-2xl w-full mx-auto">
        <p className="text-white text-base mb-6">Dear {proposal.client_name},</p>
        <div className="text-[#b0c0d4] text-sm leading-relaxed space-y-4 whitespace-pre-wrap mb-8">
          {(proposal.intro_letter || '').split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <div className="border-t border-[#2a3f57] pt-6">
          <p className="text-white font-semibold text-sm">{proposal.sender_name}</p>
          <p className="text-[#8a9bb0] text-xs mt-0.5">{proposal.sender_title}</p>
        </div>
      </div>
    </div>
  )
}
