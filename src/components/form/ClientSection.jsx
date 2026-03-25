import { memo } from 'react'
import SectionHeader from './SectionHeader'

const Field = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent"
    />
  </div>
)

const ClientSection = memo(function ClientSection({ data, onChange }) {
  const f = (key) => (val) => onChange(key, val)

  return (
    <div>
      <SectionHeader title="Proposal Details" description="Basic information about this proposal." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Field label="Proposal Title" value={data.proposal_title} onChange={f('proposal_title')} placeholder="Digital Growth Proposal" />
        <Field label="Proposal Date" value={data.proposal_date} onChange={f('proposal_date')} type="date" />
      </div>

      <SectionHeader title="Client Details" description="Who this proposal is prepared for." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Client Name *" value={data.client_name} onChange={f('client_name')} placeholder="Marga van der Westhuizen" />
        <Field label="Company Name *" value={data.client_company} onChange={f('client_company')} placeholder="Marga Interiors" />
        <Field label="Role / Title" value={data.client_role} onChange={f('client_role')} placeholder="Owner" />
        <Field label="Contact Email" value={data.client_email} onChange={f('client_email')} type="email" placeholder="email@example.com" />
        <Field label="Phone" value={data.client_phone} onChange={f('client_phone')} placeholder="+27 84 372 4605" />
      </div>
    </div>
  )
})

export default ClientSection
