import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { supabase } from '../lib/supabase'
import {
  AGENCY_DEFAULTS,
  DEFAULT_INTRO,
  DEFAULT_ABOUT_WHO,
  DEFAULT_ABOUT_PHILOSOPHY,
  DEFAULT_WHY_US,
  DEFAULT_NEXT_STEPS,
  DEFAULT_TERMS,
  DEFAULT_SERVICE_GROUPS,
} from '../constants/defaults'
import ClientSection from '../components/form/ClientSection'
import IntroSection from '../components/form/IntroSection'
import AboutSection from '../components/form/AboutSection'
import ServicesSection from '../components/form/ServicesSection'
import PricingSection from '../components/form/PricingSection'
import NextStepsSection from '../components/form/NextStepsSection'
import Toast from '../components/Toast'

const SECTIONS = [
  { id: 'client', label: 'Client & Details' },
  { id: 'intro', label: 'Introduction' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'nextsteps', label: 'Next Steps' },
]

function emptyForm() {
  return {
    ...AGENCY_DEFAULTS,
    client_name: '',
    client_company: '',
    client_role: '',
    client_email: '',
    client_phone: '',
    proposal_title: 'Digital Growth Proposal',
    proposal_date: new Date().toISOString().split('T')[0],
    intro_letter: DEFAULT_INTRO,
    about_who: DEFAULT_ABOUT_WHO,
    about_philosophy: DEFAULT_ABOUT_PHILOSOPHY,
    about_why_us: DEFAULT_WHY_US,
    service_groups: DEFAULT_SERVICE_GROUPS,
    pricing_items: [],
    terms: DEFAULT_TERMS,
    next_steps: DEFAULT_NEXT_STEPS,
    client_signature_name: '',
    client_signature_role: '',
    client_signature_company: '',
    sender_signature_name: AGENCY_DEFAULTS.sender_name,
    sender_signature_title: 'Founder',
    sender_signature_company: AGENCY_DEFAULTS.agency_name,
    footer_tagline: AGENCY_DEFAULTS.footer_tagline,
    currency: 'R',
  }
}

export default function ProposalForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState(emptyForm)
  const [activeSection, setActiveSection] = useState('client')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState(isEdit ? id : null)
  const [toast, setToast] = useState(null)
  const [errors, setErrors] = useState({})

  const showToast = (message, type = 'success') => setToast({ message, type })

  useEffect(() => {
    if (!isEdit) return
    supabase.from('proposals').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (error || !data) {
          showToast('Proposal not found', 'error')
          navigate('/')
        } else {
          // Merge in any default categories not yet present in saved data
          const savedCategories = (data.service_groups || []).map(g => g.category)
          const missingGroups = DEFAULT_SERVICE_GROUPS.filter(g => !savedCategories.includes(g.category))
          setFormData({ ...data, service_groups: [...(data.service_groups || []), ...missingGroups] })
        }
        setLoading(false)
      })
  }, [id, isEdit, navigate])

  const onChange = useCallback((key, value) => {
    setFormData(prev => {
      const next = { ...prev, [key]: value }
      // Sync pricing items whenever services change
      if (key === 'service_groups') {
        const allServices = value.flatMap(g => g.services || []).filter(s => s.name)
        const existingByName = {}
        prev.pricing_items.forEach(item => {
          if (!item.manual) existingByName[item.service_name] = item
        })
        const autoItems = allServices.map(s => ({
          service_name: s.name,
          description: s.description || '',
          amount: existingByName[s.name]?.amount || '',
          frequency: existingByName[s.name]?.frequency || 'Once-Off',
          manual: false,
        }))
        const manualItems = prev.pricing_items.filter(item => item.manual)
        next.pricing_items = [...autoItems, ...manualItems]
      }
      return next
    })
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }))
  }, [errors])

  const validate = () => {
    const e = {}
    if (!formData.client_name?.trim()) e.client_name = 'Client name is required'
    if (!formData.client_company?.trim()) e.client_company = 'Company name is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) {
      setErrors(e2)
      setActiveSection('client')
      showToast('Please fill in required fields', 'error')
      return
    }

    setSaving(true)
    try {
      if (isEdit) {
        const { error } = await supabase
          .from('proposals')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', id)
        if (error) throw error
        setSavedId(id)
        showToast('Proposal saved')
      } else {
        let slug = nanoid(10)
        let attempts = 0
        let newId = null
        while (!newId && attempts < 3) {
          const { data, error } = await supabase
            .from('proposals')
            .insert({ ...formData, slug, status: 'draft' })
            .select('id')
            .single()
          if (!error && data) { newId = data.id }
          else if (error?.code === '23505') { slug = nanoid(10); attempts++ }
          else throw error
        }
        if (!newId) throw new Error('Failed to generate unique slug')
        setSavedId(newId)
        showToast('Proposal created!')
      }
    } catch (err) {
      showToast(err.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    )
  }

  const currentIdx = SECTIONS.findIndex(s => s.id === activeSection)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Edit Proposal' : 'New Proposal'}
          </h1>
          {formData.client_company && (
            <span className="text-sm text-gray-400">— {formData.client_company}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {savedId && (
            <Link
              to={`/proposals/${savedId}`}
              className="px-4 py-2 text-sm font-medium text-[#0d1b2a] bg-[#c8e63c] hover:bg-[#a8c420] rounded-lg transition-colors"
            >
              Preview Proposal →
            </Link>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 bg-[#0d1b2a] text-white text-sm font-medium rounded-lg hover:bg-[#162436] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Proposal'}
          </button>
        </div>
      </header>

      <div className="flex max-w-6xl mx-auto">
        {/* Sidebar nav */}
        <nav className="w-52 flex-shrink-0 py-8 px-4 no-print">
          <ul className="space-y-1">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-[#0d1b2a] text-white font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main form area */}
        <main className="flex-1 py-8 px-6 max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              {activeSection === 'client' && (
                <ClientSection data={formData} onChange={onChange} />
              )}
              {activeSection === 'intro' && (
                <IntroSection data={formData} onChange={onChange} />
              )}
              {activeSection === 'about' && (
                <AboutSection data={formData} onChange={onChange} />
              )}
              {activeSection === 'services' && (
                <ServicesSection data={formData} onChange={onChange} />
              )}
              {activeSection === 'pricing' && (
                <PricingSection data={formData} onChange={onChange} />
              )}
              {activeSection === 'nextsteps' && (
                <NextStepsSection data={formData} onChange={onChange} />
              )}

              {/* Validation errors */}
              {Object.values(errors).some(Boolean) && activeSection === 'client' && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  {Object.values(errors).filter(Boolean).map((msg, i) => (
                    <p key={i} className="text-xs text-red-600">{msg}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Prev / Next navigation */}
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setActiveSection(SECTIONS[currentIdx - 1]?.id)}
                disabled={currentIdx === 0}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 transition-colors"
              >
                ← Previous
              </button>
              {currentIdx < SECTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveSection(SECTIONS[currentIdx + 1]?.id)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#c8e63c] text-[#0d1b2a] text-sm font-semibold rounded-lg hover:bg-[#a8c420] disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Proposal'}
                </button>
              )}
            </div>
          </form>
        </main>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
