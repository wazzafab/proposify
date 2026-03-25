import { memo, useCallback, useState } from 'react'
import SectionHeader from './SectionHeader'
import { SERVICE_PRESETS } from '../../constants/servicePresets'

const ServicesSection = memo(function ServicesSection({ data, onChange }) {
  const [presetOpen, setPresetOpen] = useState(null)

  const groups = data.service_groups || []

  const updateCategory = useCallback((ci, key, value) => {
    const updated = groups.map((g, i) => i === ci ? { ...g, [key]: value } : g)
    onChange('service_groups', updated)
  }, [groups, onChange])

  const addService = useCallback((ci) => {
    const updated = groups.map((g, i) =>
      i === ci ? { ...g, services: [...(g.services || []), { name: '', description: '' }] } : g
    )
    onChange('service_groups', updated)
  }, [groups, onChange])

  const addPreset = useCallback((ci, preset) => {
    const updated = groups.map((g, i) =>
      i === ci ? { ...g, services: [...(g.services || []), { name: preset.name, description: preset.description }] } : g
    )
    onChange('service_groups', updated)
    setPresetOpen(null)
  }, [groups, onChange])

  const updateService = useCallback((ci, si, key, value) => {
    const updated = groups.map((g, gi) =>
      gi !== ci ? g : {
        ...g,
        services: g.services.map((s, si2) => si2 === si ? { ...s, [key]: value } : s)
      }
    )
    onChange('service_groups', updated)
  }, [groups, onChange])

  const removeService = useCallback((ci, si) => {
    const updated = groups.map((g, gi) =>
      gi !== ci ? g : { ...g, services: g.services.filter((_, i) => i !== si) }
    )
    onChange('service_groups', updated)
  }, [groups, onChange])

  const removeCategory = useCallback((ci) => {
    onChange('service_groups', groups.filter((_, i) => i !== ci))
  }, [groups, onChange])

  return (
    <div>
      <SectionHeader
        title="Scope of Services"
        description="Add services under each category. They will automatically appear in the Pricing tab."
      />

      <div className="space-y-8">
        {groups.map((group, ci) => (
          <div key={ci} className="border border-gray-200 rounded-xl">
            {/* Category heading */}
            <div className="flex gap-3 items-center bg-gray-50 px-5 py-4 border-b border-gray-200 rounded-t-xl">
              <div className="w-1 h-5 rounded-full bg-[#c8e63c] flex-shrink-0" />
              <h3 className="font-semibold text-gray-900 flex-1">{group.category}</h3>
              <button
                type="button"
                onClick={() => removeCategory(ci)}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-300 hover:border-red-300 rounded text-xs font-bold transition-colors flex-shrink-0"
                title="Delete category and all services"
              >
                ×
              </button>
            </div>

            {/* Category description */}
            <div className="px-5 pt-4 pb-2">
              <textarea
                value={group.category_description || ''}
                onChange={e => updateCategory(ci, 'category_description', e.target.value)}
                placeholder="Short description of this category..."
                rows={2}
                className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent resize-none"
              />
            </div>

            {/* Services list */}
            <div className="px-5 pb-4 space-y-3">
              {(group.services || []).map((service, si) => (
                <div key={si} className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={service.name || ''}
                      onChange={e => updateService(ci, si, 'name', e.target.value)}
                      placeholder="Service name"
                      className="flex-1 px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeService(ci, si)}
                      className="text-gray-400 hover:text-red-500 px-1 transition-colors text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                  <textarea
                    value={service.description || ''}
                    onChange={e => updateService(ci, si, 'description', e.target.value)}
                    placeholder="Service description..."
                    rows={2}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8e63c] focus:border-transparent resize-none bg-white"
                  />
                </div>
              ))}

              {/* Add service buttons */}
              <div className="flex gap-2 flex-wrap pt-1">
                <button
                  type="button"
                  onClick={() => addService(ci)}
                  className="text-xs text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors"
                >
                  + Add service
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setPresetOpen(presetOpen === ci ? null : ci)}
                    className="text-xs text-[#0d1b2a] border border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors bg-gray-50 hover:bg-gray-100"
                  >
                    + From presets
                  </button>
                  {presetOpen === ci && (
                    <div className={`absolute left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-72 max-h-64 overflow-y-auto ${ci === groups.length - 1 ? 'bottom-8' : 'top-8'}`}>
                      {SERVICE_PRESETS.map((preset, pi) => (
                        <button
                          key={pi}
                          type="button"
                          onClick={() => addPreset(ci, preset)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        >
                          <span className="font-medium text-gray-800">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default ServicesSection
