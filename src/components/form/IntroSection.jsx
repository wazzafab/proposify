import { memo } from 'react'
import SectionHeader from './SectionHeader'

const IntroSection = memo(function IntroSection({ data, onChange }) {
  return (
    <div>
      <SectionHeader
        title="Introduction Letter"
        description="This letter opens the proposal. It's addressed personally to the client."
      />
      {data.client_name && (
        <p className="text-sm text-gray-400 mb-3 italic">Dear {data.client_name},</p>
      )}
      <textarea
        value={data.intro_letter || ''}
        onChange={e => onChange('intro_letter', e.target.value)}
        rows={10}
        placeholder="Write your introduction letter here..."
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent resize-y"
      />
      <p className="text-xs text-gray-400 mt-2">
        Signed off as: <strong>{data.sender_name}</strong>, {data.sender_title}
      </p>
    </div>
  )
})

export default IntroSection
