import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProposalCard from '../components/ProposalCard'
import ConfirmModal from '../components/ConfirmModal'
import Toast from '../components/Toast'

export default function Dashboard() {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => setToast({ message, type })

  const fetchProposals = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('proposals')
      .select('id, slug, proposal_title, client_name, client_company, proposal_date, status, created_at')
      .order('created_at', { ascending: false })
    if (error) showToast('Failed to load proposals', 'error')
    else setProposals(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchProposals() }, [fetchProposals])

  const handleDelete = async () => {
    const { error } = await supabase.from('proposals').delete().eq('id', deleteId)
    if (error) showToast('Failed to delete proposal', 'error')
    else {
      setProposals(prev => prev.filter(p => p.id !== deleteId))
      showToast('Proposal deleted')
    }
    setDeleteId(null)
  }

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase.from('proposals').update({ status: newStatus }).eq('id', id)
    if (error) showToast('Failed to update status', 'error')
    else {
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
      showToast(`Marked as ${newStatus}`)
    }
  }

  const handleCopyLink = (slug) => {
    const url = `${window.location.origin}/p/${slug}`
    navigator.clipboard.writeText(url)
    showToast('Share link copied to clipboard')
  }

  const grouped = {
    draft: proposals.filter(p => p.status === 'draft'),
    sent: proposals.filter(p => p.status === 'sent'),
    approved: proposals.filter(p => p.status === 'approved'),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Proposify</h1>
          <p className="text-xs text-gray-500 mt-0.5">Mind The Hat</p>
        </div>
        <Link
          to="/proposals/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium rounded-lg hover:bg-[#162436] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Proposal
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading proposals...</div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No proposals yet.</p>
            <Link
              to="/proposals/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d1b2a] text-white text-sm font-medium rounded-lg hover:bg-[#162436] transition-colors"
            >
              Create your first proposal
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([status, items]) =>
              items.length > 0 && (
                <section key={status}>
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 capitalize">
                    {status} <span className="text-gray-300">({items.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(proposal => (
                      <ProposalCard
                        key={proposal.id}
                        proposal={proposal}
                        onDelete={setDeleteId}
                        onStatusChange={handleStatusChange}
                        onCopyLink={handleCopyLink}
                      />
                    ))}
                  </div>
                </section>
              )
            )}
          </div>
        )}
      </main>

      {deleteId && (
        <ConfirmModal
          message="Delete this proposal? This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
