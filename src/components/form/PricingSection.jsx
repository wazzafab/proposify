import { memo, useCallback } from 'react'
import SectionHeader from './SectionHeader'
import { groupPricingByFrequency, formatCurrency, FREQUENCY_ORDER } from '../../lib/pricingUtils'

const FREQUENCIES = ['Once-Off', 'Monthly', 'Annual']

const PricingSection = memo(function PricingSection({ data, onChange }) {
  const items = data.pricing_items || []
  const terms = data.terms || []

  const autoItems = items.filter(item => !item.manual)
  const manualItems = items.filter(item => item.manual)

  const updateItem = useCallback((i, key, value) => {
    onChange('pricing_items', items.map((item, idx) => idx === i ? { ...item, [key]: value } : item))
  }, [items, onChange])

  const addManualItem = useCallback(() => {
    onChange('pricing_items', [...items, { service_name: '', description: '', amount: '', frequency: 'Once-Off', manual: true }])
  }, [items, onChange])

  const removeManualItem = useCallback((i) => {
    onChange('pricing_items', items.filter((_, idx) => idx !== i))
  }, [items, onChange])

  const updateTerm = useCallback((i, key, value) => {
    onChange('terms', terms.map((t, idx) => idx === i ? { ...t, [key]: value } : t))
  }, [terms, onChange])

  const addTerm = useCallback(() => {
    onChange('terms', [...terms, { title: '', body: '' }])
  }, [terms, onChange])

  const removeTerm = useCallback((i) => {
    onChange('terms', terms.filter((_, idx) => idx !== i))
  }, [terms, onChange])

  const groups = groupPricingByFrequency(items)
  const hasAmounts = items.some(item => item.amount)

  return (
    <div>
      <SectionHeader
        title="Fees & Pricing"
        description="Services are pulled from the Services tab. Add a price to each one."
      />

      {/* Auto-populated services */}
      {autoItems.length === 0 ? (
        <div className="text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl p-6 text-center mb-6">
          No services added yet. Go to the Services tab to add services — they'll appear here automatically.
        </div>
      ) : (
        <div className="mb-6 space-y-2">
          {/* Column headers */}
          <div className="grid grid-cols-12 gap-3 px-2 pb-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
            <span className="col-span-5">Service</span>
            <span className="col-span-3">Amount</span>
            <span className="col-span-4">Frequency</span>
          </div>

          {autoItems.map((item, i) => {
            const globalIdx = items.indexOf(item)
            return (
              <div key={i} className="grid grid-cols-12 gap-3 items-center bg-gray-50 rounded-lg px-3 py-3">
                <div className="col-span-5">
                  <p className="text-sm font-medium text-gray-800">{item.service_name}</p>
                  {item.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                  )}
                </div>
                <div className="col-span-3 flex items-center gap-1">
                  <span className="text-sm text-gray-500">{data.currency || 'R'}</span>
                  <input
                    type="number"
                    value={item.amount || ''}
                    onChange={e => updateItem(globalIdx, 'amount', e.target.value)}
                    placeholder="0"
                    min="0"
                    className="flex-1 min-w-0 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent bg-white"
                  />
                </div>
                <select
                  value={item.frequency || 'Once-Off'}
                  onChange={e => updateItem(globalIdx, 'frequency', e.target.value)}
                  className="col-span-4 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent bg-white"
                >
                  {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            )
          })}
        </div>
      )}

      {/* Manual extra line items */}
      {manualItems.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide px-2 mb-2">Additional Items</p>
          {manualItems.map((item) => {
            const globalIdx = items.indexOf(item)
            return (
              <div key={globalIdx} className="grid grid-cols-12 gap-3 items-center">
                <input
                  type="text"
                  value={item.service_name || ''}
                  onChange={e => updateItem(globalIdx, 'service_name', e.target.value)}
                  placeholder="Item name"
                  className="col-span-4 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent"
                />
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={e => updateItem(globalIdx, 'description', e.target.value)}
                  placeholder="Description"
                  className="col-span-3 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent"
                />
                <div className="col-span-2 flex items-center gap-1">
                  <span className="text-sm text-gray-500">{data.currency || 'R'}</span>
                  <input
                    type="number"
                    value={item.amount || ''}
                    onChange={e => updateItem(globalIdx, 'amount', e.target.value)}
                    placeholder="0"
                    min="0"
                    className="flex-1 min-w-0 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent"
                  />
                </div>
                <select
                  value={item.frequency || 'Once-Off'}
                  onChange={e => updateItem(globalIdx, 'frequency', e.target.value)}
                  className="col-span-2 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent bg-white"
                >
                  {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => removeManualItem(globalIdx)}
                  className="col-span-1 text-gray-400 hover:text-red-500 text-center transition-colors"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={addManualItem}
          className="text-xs text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg transition-colors"
        >
          + Add extra line item
        </button>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Currency</label>
          <input
            type="text"
            value={data.currency || 'R'}
            onChange={e => onChange('currency', e.target.value)}
            className="w-16 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent text-center"
          />
        </div>
      </div>

      {/* Subtotals */}
      {hasAmounts && (
        <div className="bg-gray-50 rounded-xl p-4 mb-8">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Summary</p>
          {FREQUENCY_ORDER.filter(f => groups[f]).map(freq => (
            <div key={freq} className="flex justify-between text-sm py-1.5 border-b border-gray-200 last:border-0">
              <span className="text-gray-600">{freq} Total</span>
              <span className="font-semibold text-gray-900">{formatCurrency(groups[freq].subtotal, data.currency || 'R')}</span>
            </div>
          ))}
        </div>
      )}

      {/* Terms */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Terms & Conditions</h3>
        <div className="space-y-4">
          {terms.map((term, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex gap-2 items-center">
                <span className="text-xs font-medium text-gray-500 w-4">{i + 1}.</span>
                <input
                  type="text"
                  value={term.title || ''}
                  onChange={e => updateTerm(i, 'title', e.target.value)}
                  placeholder="Term title (e.g. Payment)"
                  className="flex-1 px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent bg-white"
                />
                <button type="button" onClick={() => removeTerm(i)} className="text-gray-400 hover:text-red-500 px-1 transition-colors">×</button>
              </div>
              <textarea
                value={term.body || ''}
                onChange={e => updateTerm(i, 'body', e.target.value)}
                placeholder="Term details..."
                rows={2}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent resize-none bg-white"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addTerm}
          className="mt-3 text-xs text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors"
        >
          + Add term
        </button>
      </div>
    </div>
  )
})

export default PricingSection
