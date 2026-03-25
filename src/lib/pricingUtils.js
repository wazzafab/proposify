export const FREQUENCY_ORDER = ['Once-Off', 'Monthly', 'Annual']

export function groupPricingByFrequency(pricingItems = []) {
  const groups = {}
  for (const item of pricingItems) {
    const freq = item.frequency || 'Once-Off'
    if (!groups[freq]) groups[freq] = { items: [], subtotal: 0 }
    groups[freq].items.push(item)
    groups[freq].subtotal += parseFloat(item.amount) || 0
  }
  return groups
}

export function formatCurrency(amount, currency = 'R') {
  const num = parseFloat(amount) || 0
  return `${currency} ${num.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function calcTotal(pricingItems = []) {
  return (pricingItems || []).reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
}
