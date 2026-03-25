import { memo, useCallback } from 'react'
import SectionHeader from './SectionHeader'

const AboutSection = memo(function AboutSection({ data, onChange }) {
  const updateBullet = useCallback((index, value) => {
    const updated = [...(data.about_why_us || [])]
    updated[index] = value
    onChange('about_why_us', updated)
  }, [data.about_why_us, onChange])

  const addBullet = useCallback(() => {
    onChange('about_why_us', [...(data.about_why_us || []), ''])
  }, [data.about_why_us, onChange])

  const removeBullet = useCallback((index) => {
    onChange('about_why_us', (data.about_why_us || []).filter((_, i) => i !== index))
  }, [data.about_why_us, onChange])

  return (
    <div>
      <SectionHeader
        title="About Your Agency"
        description="This section appears in the proposal to build credibility. Edit as needed."
      />
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Who We Are</label>
          <textarea
            value={data.about_who || ''}
            onChange={e => onChange('about_who', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Our Philosophy</label>
          <textarea
            value={data.about_philosophy || ''}
            onChange={e => onChange('about_philosophy', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Why Clients Choose Us</label>
          <div className="space-y-2">
            {(data.about_why_us || []).map((bullet, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="w-2 h-2 rounded-full bg-[#c8e63c] flex-shrink-0" />
                <input
                  type="text"
                  value={bullet}
                  onChange={e => updateBullet(i, e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeBullet(i)}
                  className="text-gray-400 hover:text-red-500 transition-colors px-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addBullet}
            className="mt-3 text-xs text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            + Add bullet point
          </button>
        </div>
      </div>
    </div>
  )
})

export default AboutSection
