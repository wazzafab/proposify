import { memo, useCallback } from 'react'
import SectionHeader from './SectionHeader'

const Field = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent"
    />
  </div>
)

const NextStepsSection = memo(function NextStepsSection({ data, onChange }) {
  const steps = data.next_steps || []

  const updateStep = useCallback((i, value) => {
    const updated = [...steps]
    updated[i] = value
    onChange('next_steps', updated)
  }, [steps, onChange])

  const addStep = useCallback(() => {
    onChange('next_steps', [...steps, ''])
  }, [steps, onChange])

  const removeStep = useCallback((i) => {
    onChange('next_steps', steps.filter((_, idx) => idx !== i))
  }, [steps, onChange])

  const f = (key) => (val) => onChange(key, val)

  return (
    <div>
      <SectionHeader
        title="Next Steps"
        description="Instructions for the client on what to do after reviewing the proposal."
      />

      <div className="space-y-2 mb-6">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="w-6 h-6 rounded-full bg-[#c8e63c] text-[#0d1b2a] text-xs font-bold flex items-center justify-center flex-shrink-0">
              {i + 1}
            </span>
            <input
              type="text"
              value={step}
              onChange={e => updateStep(i, e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => removeStep(i)}
              className="text-gray-400 hover:text-red-500 px-1 transition-colors"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addStep}
          className="text-xs text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors"
        >
          + Add step
        </button>
      </div>

      {/* Signature blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3 bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Client Signature</p>
          <Field label="Name" value={data.client_signature_name} onChange={f('client_signature_name')} placeholder="Marga van der Westhuizen" />
          <Field label="Role" value={data.client_signature_role} onChange={f('client_signature_role')} placeholder="Owner" />
          <Field label="Company" value={data.client_signature_company} onChange={f('client_signature_company')} placeholder="Marga Interiors" />
        </div>
        <div className="space-y-3 bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Authorised By</p>
          <Field label="Name" value={data.sender_signature_name} onChange={f('sender_signature_name')} placeholder="Warren Fabricius" />
          <Field label="Title" value={data.sender_signature_title} onChange={f('sender_signature_title')} placeholder="Founder" />
          <Field label="Company" value={data.sender_signature_company} onChange={f('sender_signature_company')} placeholder="Mind The Hat" />
        </div>
      </div>

      {/* Footer tagline */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Footer Tagline</label>
        <input
          type="text"
          value={data.footer_tagline || ''}
          onChange={e => onChange('footer_tagline', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent"
          placeholder="We appreciate the opportunity..."
        />
      </div>
    </div>
  )
})

export default NextStepsSection
