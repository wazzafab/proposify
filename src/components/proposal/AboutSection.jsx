export default function AboutSection({ proposal }) {
  if (!proposal.about_who && !proposal.about_philosophy && !(proposal.about_why_us?.length)) return null

  return (
    <div className="bg-white px-16 py-20">
      <h2 className="text-[#0d1b2a] font-bold text-4xl mb-12">About {proposal.agency_name}</h2>
      <div className="grid grid-cols-2 gap-12">
        <div>
          {proposal.about_who && (
            <div className="mb-8">
              <h3 className="text-[#0d1b2a] font-semibold text-lg mb-3">Who We Are</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{proposal.about_who}</p>
            </div>
          )}
          {proposal.about_philosophy && (
            <div>
              <h3 className="text-[#0d1b2a] font-semibold text-lg mb-3">Our Philosophy</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{proposal.about_philosophy}</p>
            </div>
          )}
        </div>
        {proposal.about_why_us?.length > 0 && (
          <div>
            <h3 className="text-[#0d1b2a] font-semibold text-lg mb-4">Why Clients Choose Us</h3>
            <ul className="space-y-3">
              {proposal.about_why_us.map((bullet, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-[#c8e63c] flex-shrink-0 mt-1.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
