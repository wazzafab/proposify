import { Link, useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'

export default function ProposalCard({ proposal, onDelete, onStatusChange, onCopyLink }) {
  const navigate = useNavigate()
  const date = proposal.proposal_date
    ? new Date(proposal.proposal_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
    : new Date(proposal.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {proposal.client_company || proposal.client_name || 'Untitled Proposal'}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {proposal.proposal_title || 'Digital Growth Proposal'}
          </p>
        </div>
        <StatusBadge status={proposal.status} />
      </div>

      <div className="text-xs text-gray-400 flex gap-4">
        <span>{proposal.client_name || '—'}</span>
        <span>{date}</span>
      </div>

      <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
        <Link
          to={`/proposals/${proposal.id}`}
          className="px-3 py-1.5 text-xs font-medium text-[#0d1b2a] bg-[#c8e63c] hover:bg-[#a8c420] rounded-lg transition-colors"
        >
          Preview Proposal
        </Link>
        <button
          onClick={() => navigate(`/proposals/${proposal.id}/edit`)}
          className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onCopyLink(proposal.slug)}
          className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          Share Link
        </button>
        {proposal.status === 'draft' && (
          <button
            onClick={() => onStatusChange(proposal.id, 'sent')}
            className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Mark Sent
          </button>
        )}
        {proposal.status === 'sent' && (
          <button
            onClick={() => onStatusChange(proposal.id, 'approved')}
            className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            Mark Approved
          </button>
        )}
        <button
          onClick={() => onDelete(proposal.id)}
          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
