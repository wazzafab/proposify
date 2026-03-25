import { groupPricingByFrequency, formatCurrency, FREQUENCY_ORDER } from '../../lib/pricingUtils'

export default function FeesAndPricing({ proposal }) {
  const items = proposal.pricing_items || []
  const terms = proposal.terms || []
  const currency = proposal.currency || 'R'

  if (!items.length && !terms.length) return null

  const groups = groupPricingByFrequency(items)

  return (
    <div className="bg-white px-16 py-20">
      <h2 className="text-[#0d1b2a] font-bold text-4xl mb-10">Fees & Pricing</h2>

      {items.length > 0 && (
        <div className="mb-10">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
            <span className="col-span-3">Service</span>
            <span className="col-span-5">Description</span>
            <span className="col-span-2 text-right">Amount</span>
            <span className="col-span-2 text-right">Frequency</span>
          </div>

          {/* Rows */}
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-100 hover:bg-gray-50">
              <span className="col-span-3 text-sm font-medium text-[#0d1b2a]">{item.service_name}</span>
              <span className="col-span-5 text-sm text-gray-500">{item.description}</span>
              <span className="col-span-2 text-sm font-medium text-[#0d1b2a] text-right">
                {formatCurrency(item.amount, currency)}
              </span>
              <span className="col-span-2 text-sm text-gray-500 text-right">{item.frequency}</span>
            </div>
          ))}

          {/* Subtotals */}
          <div className="mt-2">
            {FREQUENCY_ORDER.filter(f => groups[f]).map(freq => (
              <div key={freq} className="flex justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-[#0d1b2a]">{freq} Total</span>
                <span className="text-sm font-bold text-[#0d1b2a]">
                  {formatCurrency(groups[freq].subtotal, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Terms */}
      {terms.length > 0 && (
        <div>
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm font-semibold text-[#0d1b2a] mb-4">Terms & Conditions</p>
            <ol className="space-y-2">
              {terms.map((term, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-gray-400 flex-shrink-0">{i + 1}.</span>
                  <span>
                    <strong className="text-[#0d1b2a]">{term.title}:</strong>{' '}
                    {term.body}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
