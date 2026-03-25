export default function ScopeOfServices({ proposal }) {
  const groups = proposal.service_groups || []
  if (!groups.length) return null

  return (
    <div className="bg-white px-16 py-20">
      <h2 className="text-[#0d1b2a] font-bold text-4xl mb-2">Scope of Services</h2>
      <p className="text-gray-500 text-sm mb-12">The following services are included in this proposal.</p>

      <div className="space-y-12">
        {groups.map((group, gi) => (
          <div key={gi}>
            {/* Category heading with lime accent */}
            <div className="flex gap-4 items-start mb-2">
              <div className="w-1 bg-[#c8e63c] rounded-full self-stretch flex-shrink-0" style={{ minHeight: '1.5rem' }} />
              <div>
                <h3 className="text-[#0d1b2a] font-bold text-xl">{group.category}</h3>
                {group.category_description && (
                  <p className="text-gray-500 text-sm mt-1">{group.category_description}</p>
                )}
              </div>
            </div>

            {/* Services */}
            <div className="ml-5 mt-6 space-y-6">
              {(group.services || []).map((service, si) => (
                <div key={si} className="bg-gray-50 rounded-xl p-5">
                  <p className="text-[#0d1b2a] font-semibold text-sm mb-2">{service.name}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
