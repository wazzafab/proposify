import { useState, useRef } from 'react'

const FONTS = [
  { label: 'Classic', value: 'Dancing Script' },
  { label: 'Flowing', value: 'Great Vibes' },
  { label: 'Casual', value: 'Pacifico' },
  { label: 'Natural', value: 'Caveat' },
  { label: 'Elegant', value: 'Satisfy' },
]

function SignatureDisplay({ data, fallbackName }) {
  if (!data) {
    return <div className="h-10" />
  }
  if (data.type === 'image') {
    return <img src={data.dataUrl} alt="Signature" className="h-12 object-contain object-left" />
  }
  return (
    <p
      style={{ fontFamily: `'${data.font}', cursive`, fontSize: '1.6rem', lineHeight: 1.2, color: 'white' }}
    >
      {data.text || fallbackName}
    </p>
  )
}

export default function SignatureField({ label, value, editable, fallbackName, onSave, darkBg = true }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('type')
  const [typedText, setTypedText] = useState(fallbackName || '')
  const [selectedFont, setSelectedFont] = useState('Dancing Script')
  const [imageData, setImageData] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const labelColor = darkBg ? 'text-[#8a9bb0]' : 'text-gray-500'
  const borderColor = darkBg ? 'border-[#2a3f57]' : 'border-gray-300'

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImageData(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleApply = async () => {
    if (tab === 'type' && !typedText.trim()) return
    if (tab === 'upload' && !imageData) return
    setSaving(true)
    const sigData = tab === 'type'
      ? { type: 'typed', text: typedText.trim(), font: selectedFont }
      : { type: 'image', dataUrl: imageData }
    await onSave(sigData)
    setSaving(false)
    setOpen(false)
  }

  return (
    <div>
      <p className={`${labelColor} text-xs tracking-[0.15em] uppercase mb-3`}>{label}</p>

      {/* Signature display area */}
      <div className={`border-b ${borderColor} mb-3 min-h-[3rem] flex items-end pb-1`}>
        {value
          ? <SignatureDisplay data={value} fallbackName={fallbackName} />
          : <div className="h-8" />
        }
      </div>

      {/* Editable controls */}
      {editable && !open && (
        <button
          onClick={() => setOpen(true)}
          className="text-xs text-[#c8e63c] hover:underline mt-1"
        >
          {value ? 'Change signature' : '+ Add signature'}
        </button>
      )}

      {/* Signature capture panel */}
      {editable && open && (
        <div className={`mt-3 rounded-xl p-4 ${darkBg ? 'bg-[#0d1b2a] border border-[#2a3f57]' : 'bg-gray-50 border border-gray-200'}`}>
          {/* Tabs */}
          <div className="flex gap-1 mb-4">
            {['type', 'upload'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                  tab === t
                    ? 'bg-[#c8e63c] text-[#0d1b2a]'
                    : darkBg ? 'text-[#8a9bb0] hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {t === 'type' ? 'Type' : 'Upload PNG'}
              </button>
            ))}
          </div>

          {tab === 'type' && (
            <div className="space-y-3">
              <input
                type="text"
                value={typedText}
                onChange={e => setTypedText(e.target.value)}
                placeholder="Type your name"
                className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-1 focus:ring-[#c8e63c] ${
                  darkBg
                    ? 'bg-[#1a2d42] border-[#2a3f57] text-white placeholder-[#8a9bb0]'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />

              {/* Font picker */}
              <div className="grid grid-cols-5 gap-1">
                {FONTS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setSelectedFont(f.value)}
                    className={`px-2 py-1.5 rounded-lg text-xs transition-colors ${
                      selectedFont === f.value
                        ? 'bg-[#c8e63c] text-[#0d1b2a]'
                        : darkBg ? 'bg-[#1a2d42] text-[#8a9bb0] hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Preview */}
              {typedText && (
                <div className={`rounded-lg px-4 py-3 ${darkBg ? 'bg-[#1a2d42]' : 'bg-white border border-gray-200'}`}>
                  <p style={{ fontFamily: `'${selectedFont}', cursive`, fontSize: '1.8rem', color: darkBg ? 'white' : '#0d1b2a', lineHeight: 1.2 }}>
                    {typedText}
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === 'upload' && (
            <div className="space-y-3">
              <button
                onClick={() => fileRef.current.click()}
                className={`w-full border-2 border-dashed rounded-lg py-6 text-xs transition-colors ${
                  darkBg
                    ? 'border-[#2a3f57] text-[#8a9bb0] hover:border-[#c8e63c] hover:text-white'
                    : 'border-gray-300 text-gray-500 hover:border-[#c8e63c]'
                }`}
              >
                {imageData ? 'Click to replace' : 'Click to upload transparent PNG'}
              </button>
              <input ref={fileRef} type="file" accept="image/png,image/svg+xml" className="hidden" onChange={handleFileChange} />
              {imageData && (
                <div className={`rounded-lg p-3 ${darkBg ? 'bg-[#1a2d42]' : 'bg-white border border-gray-200'}`}>
                  <img src={imageData} alt="Signature preview" className="h-12 object-contain" />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleApply}
              disabled={saving || (tab === 'type' && !typedText.trim()) || (tab === 'upload' && !imageData)}
              className="px-4 py-2 bg-[#c8e63c] text-[#0d1b2a] text-xs font-semibold rounded-lg hover:bg-[#a8c420] disabled:opacity-40 transition-colors"
            >
              {saving ? 'Saving…' : 'Apply Signature'}
            </button>
            <button
              onClick={() => setOpen(false)}
              className={`px-4 py-2 text-xs rounded-lg transition-colors ${
                darkBg ? 'text-[#8a9bb0] hover:text-white bg-[#1a2d42]' : 'text-gray-500 hover:text-gray-900 bg-gray-100'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
