import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../api/axios'

// ─── Icons ────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.84"/>
  </svg>
)
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)
const XIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

// ─── Config ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:       { label: 'Pending',     bg: 'bg-amber-50',   text: 'text-amber-600',   dot: 'bg-amber-400',   border: 'border-amber-200'   },
  'in-progress': { label: 'In Progress', bg: 'bg-blue-50',    text: 'text-blue-600',    dot: 'bg-blue-400',    border: 'border-blue-200'    },
  resolved:      { label: 'Resolved',    bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400', border: 'border-emerald-200' },
  rejected:      { label: 'Rejected',    bg: 'bg-red-50',     text: 'text-red-500',     dot: 'bg-red-400',     border: 'border-red-200'     },
}

const CATEGORY_EMOJI = {
  hostel: '🏠', mess: '🍽️', academic: '📚', maintenance: '🔧', other: '📋',
}

const STATUS_FILTERS = [
  { value: 'all',         label: 'All'         },
  { value: 'pending',     label: 'Pending'     },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved',    label: 'Resolved'    },
  { value: 'rejected',    label: 'Rejected'    },
]

const CATEGORY_FILTERS = [
  { value: 'all',         label: 'All Categories' },
  { value: 'hostel',      label: '🏠 Hostel'      },
  { value: 'mess',        label: '🍽️ Mess'         },
  { value: 'academic',    label: '📚 Academic'    },
  { value: 'maintenance', label: '🔧 Maintenance' },
  { value: 'other',       label: '📋 Other'       },
]

const ADMIN_STATUS_OPTIONS = [
  { value: 'pending',     label: 'Pending'     },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved',    label: 'Resolved'    },
  { value: 'rejected',    label: 'Rejected'    },
]

const fadeUp  = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.2 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.055 } } }

// ─── JWT Decoder ──────────────────────────────────────────────────────────────
const decodeToken = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return {}
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return {}
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)  return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// ─── Confirm / Action Modal ───────────────────────────────────────────────────
function ConfirmModal({ open, title, message, confirmLabel, confirmClass, onConfirm, onCancel, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onCancel}
      />
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
      >
        <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-5">{message}</p>
        {children}
        <div className="flex gap-3 mt-5">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className={`flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-colors ${confirmClass}`}>
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Admin Resolve Modal ──────────────────────────────────────────────────────
function AdminResolveModal({ open, complaint, onClose, onUpdate }) {
  const [selectedStatus, setSelectedStatus] = useState('')
  const [remarks, setRemarks]               = useState('')
  const [loading, setLoading]               = useState(false)

  useEffect(() => {
    if (complaint) {
      setSelectedStatus(complaint.status)
      setRemarks(complaint.adminRemarks || '')
    }
  }, [complaint])

  if (!open || !complaint) return null

  const handleUpdate = async () => {
    setLoading(true)
    try {
      if (selectedStatus === 'resolved') {
        await API.put(`/admin/${complaint._id}/resolve`, { adminRemarks: remarks })
      } else {
        await API.put(`/admin/${complaint._id}/status`, { status: selectedStatus })
      }
      onUpdate()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = selectedStatus && selectedStatus !== complaint.status

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onClose}
      />
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldIcon />
              <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest">Admin Action</span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{complaint.complaintName}</h3>
            <p className="text-sm text-gray-400 mt-0.5">
              {complaint.userId?.name} · {complaint.location} · {timeAgo(complaint.createdAt)}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors p-1">
            <XIcon />
          </button>
        </div>

        {/* Description */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-5">
          <p className="text-sm text-gray-600 leading-relaxed">{complaint.description}</p>
        </div>

        {/* Status selector */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
            Update Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ADMIN_STATUS_OPTIONS.map(opt => {
              const st = STATUS_CONFIG[opt.value]
              const active = selectedStatus === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all
                    ${active ? `${st.bg} ${st.text} ${st.border} shadow-sm` : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${st.dot}`}/>
                  {opt.label}
                  {active && <CheckIcon />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Remarks (always shown, required only for resolved) */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
            Admin Remarks {selectedStatus === 'resolved' && <span className="text-red-400">*</span>}
          </label>
          <textarea
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            placeholder={selectedStatus === 'resolved'
              ? "Describe the resolution…"
              : "Optional note for the student…"}
            rows={3}
            className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-50 transition"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={!canSubmit || (selectedStatus === 'resolved' && !remarks.trim()) || loading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-colors bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating…' : 'Update Status'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
function StatsRow({ data }) {
  const counts = { pending: 0, 'in-progress': 0, resolved: 0, rejected: 0 }
  data.forEach(c => { if (counts[c.status] !== undefined) counts[c.status]++ })

  const items = [
    { key: 'pending',     label: 'Pending',     color: 'text-amber-500',   bg: 'bg-amber-50',   border: 'border-amber-100'   },
    { key: 'in-progress', label: 'In Progress', color: 'text-blue-500',    bg: 'bg-blue-50',    border: 'border-blue-100'    },
    { key: 'resolved',    label: 'Resolved',    color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { key: 'rejected',    label: 'Rejected',    color: 'text-red-400',     bg: 'bg-red-50',     border: 'border-red-100'     },
  ]

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {items.map(({ key, label, color, bg, border }) => (
        <div key={key} className={`${bg} border ${border} rounded-2xl p-4 text-center`}>
          <p className={`text-2xl font-bold ${color}`}>{counts[key]}</p>
          <p className="text-xs text-gray-500 mt-1 font-medium leading-tight">{label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Status Filter Chips ──────────────────────────────────────────────────────
function StatusFilterRow({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {STATUS_FILTERS.map(f => {
        const active = value === f.value
        const st = STATUS_CONFIG[f.value]
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150
              ${active
                ? (st ? `${st.bg} ${st.text} ${st.border}` : 'bg-gray-900 text-white border-gray-900')
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
              }`}
          >
            {active && st && <span className={`w-2 h-2 rounded-full ${st.dot}`}/>}
            {f.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ isAdmin, tab, statusFilter }) {
  const msg = isAdmin
    ? 'No complaints match the current filters.'
    : tab === 'all'
      ? 'No active complaints in your hostel.'
      : statusFilter !== 'all'
        ? `No ${STATUS_CONFIG[statusFilter]?.label || ''} complaints found.`
        : "You haven't submitted any complaints yet."
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">📭</div>
      <p className="text-gray-400 text-base">{msg}</p>
    </div>
  )
}

// ─── STUDENT Complaint Card ───────────────────────────────────────────────────
function StudentComplaintCard({ complaint, currentUserId, onDelete, onReopen }) {
  const [expanded,      setExpanded     ] = useState(false)
  const [showDelete,    setShowDelete   ] = useState(false)
  const [showReopen,    setShowReopen   ] = useState(false)
  const [reopenReason,  setReopenReason ] = useState('')
  const [loadingAction, setLoadingAction] = useState(false)

  const st    = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.pending
  const emoji = CATEGORY_EMOJI[complaint.category] || '📋'

  const complaintOwnerId = complaint.userId?._id?.toString?.() || complaint.userId?.toString?.()
  const isOwner = complaintOwnerId && currentUserId && complaintOwnerId === currentUserId.toString()
  const canDelete = isOwner && complaint.status === 'pending'
  const canReopen = isOwner && complaint.status === 'resolved'

  const handleDelete = async () => {
    setLoadingAction(true)
    try { await onDelete(complaint._id) } catch {}
    finally { setLoadingAction(false); setShowDelete(false) }
  }

  const handleReopen = async () => {
    if (!reopenReason.trim()) return
    setLoadingAction(true)
    try { await onReopen(complaint._id, reopenReason.trim()) } catch {}
    finally { setLoadingAction(false); setShowReopen(false); setReopenReason('') }
  }

  return (
    <>
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex">
          <div className={`w-1 rounded-l-2xl shrink-0 ${st.dot}`} />
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between gap-4 cursor-pointer select-none" onClick={() => setExpanded(e => !e)}>
              <div className="flex gap-3 min-w-0 flex-1">
                <span className="text-2xl shrink-0 mt-0.5">{emoji}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base leading-snug">{complaint.complaintName}</h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                    <span className="text-sm text-gray-400">{complaint.location}</span>
                    <span className="text-gray-200">·</span>
                    <span className="text-sm text-gray-400">{timeAgo(complaint.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 mt-0.5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}/>{st.label}
                </span>
                <motion.span className="text-gray-300 shrink-0" animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDownIcon />
                </motion.span>
              </div>
            </div>

            {expanded && (
              <div className="pt-4 mt-4 border-t border-gray-100">
                <motion.div key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="space-y-3">
                  <p className="text-sm text-gray-600 leading-relaxed">{complaint.description}</p>
                  {complaint.adminRemarks && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Admin Remarks</p>
                      <p className="text-sm text-gray-700">{complaint.adminRemarks}</p>
                    </div>
                  )}
                </motion.div>
                {isOwner && (canDelete || canReopen) && (
                  <div className="flex gap-3 mt-4">
                    {canReopen && (
                      <button onClick={e => { e.stopPropagation(); setShowReopen(true) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 active:scale-95 transition-all">
                        <RefreshIcon /> Reopen
                      </button>
                    )}
                    {canDelete && (
                      <button onClick={e => { e.stopPropagation(); setShowDelete(true) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 active:scale-95 transition-all">
                        <TrashIcon /> Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <ConfirmModal open={showDelete} title="Delete this complaint?" message="This action cannot be undone." confirmLabel={loadingAction ? 'Deleting…' : 'Yes, Delete'} confirmClass="bg-red-500 hover:bg-red-600" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
      <ConfirmModal open={showReopen} title="Reopen this complaint?" message="Tell us why you're reopening — the admin will see this." confirmLabel={loadingAction ? 'Reopening…' : 'Reopen'} confirmClass={reopenReason.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'} onConfirm={handleReopen} onCancel={() => { setShowReopen(false); setReopenReason('') }}>
        <textarea value={reopenReason} onChange={e => setReopenReason(e.target.value)} placeholder="e.g. The issue still persists after the fix…" rows={3} className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition" />
      </ConfirmModal>
    </>
  )
}

// ─── ADMIN Complaint Card ─────────────────────────────────────────────────────
function AdminComplaintCard({ complaint, onAction }) {
  const [expanded, setExpanded] = useState(false)
  const st    = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.pending
  const emoji = CATEGORY_EMOJI[complaint.category] || '📋'

  return (
    <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex">
        <div className={`w-1 rounded-l-2xl shrink-0 ${st.dot}`} />
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4 cursor-pointer select-none" onClick={() => setExpanded(e => !e)}>
            <div className="flex gap-3 min-w-0 flex-1">
              <span className="text-2xl shrink-0 mt-0.5">{emoji}</span>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-base leading-snug">{complaint.complaintName}</h3>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                  <span className="text-sm text-gray-400">{complaint.location}</span>
                  <span className="text-gray-200">·</span>
                  <span className="text-sm text-gray-400">{timeAgo(complaint.createdAt)}</span>
                  {complaint.userId?.name && (
                    <>
                      <span className="text-gray-200">·</span>
                      <span className="text-sm font-medium text-gray-500">{complaint.userId.name}</span>
                    </>
                  )}
                  {complaint.hostelId?.name && (
                    <>
                      <span className="text-gray-200">·</span>
                      <span className="text-sm text-gray-400">{complaint.hostelId.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 mt-0.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}/>{st.label}
              </span>
              <motion.span className="text-gray-300 shrink-0" animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDownIcon />
              </motion.span>
            </div>
          </div>

          {expanded && (
            <div className="pt-4 mt-4 border-t border-gray-100">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="space-y-3">
                <p className="text-sm text-gray-600 leading-relaxed">{complaint.description}</p>
                {complaint.adminRemarks && (
                  <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                    <p className="text-xs font-semibold text-violet-400 uppercase tracking-wide mb-1.5">Your Remarks</p>
                    <p className="text-sm text-gray-700">{complaint.adminRemarks}</p>
                  </div>
                )}
              </motion.div>
              <div className="mt-4">
                <button
                  onClick={e => { e.stopPropagation(); onAction(complaint) }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-violet-50 text-violet-600 border border-violet-100 hover:bg-violet-100 active:scale-95 transition-all"
                >
                  <ShieldIcon /> Manage Status
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-4 pt-2">
      <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 disabled:opacity-30 hover:border-gray-300 transition-colors shadow-sm">
        <ChevronLeft />
      </button>
      <span className="text-sm font-semibold text-gray-600 min-w-[60px] text-center">
        {page} <span className="text-gray-300 font-normal">/</span> {totalPages}
      </span>
      <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 disabled:opacity-30 hover:border-gray-300 transition-colors shadow-sm">
        <ChevronRight />
      </button>
    </div>
  )
}

// ─── ADMIN VIEW ───────────────────────────────────────────────────────────────
function AdminView() {
  const [statusFilter,   setStatusFilter  ] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [hostelName,     setHostelName    ] = useState('')
  const [page,           setPage          ] = useState(1)
  const LIMIT = 10

  const [data,          setData         ] = useState([])
  const [allData,       setAllData      ] = useState([])
  const [totalPages,    setTotalPages   ] = useState(1)
  const [loading,       setLoading      ] = useState(true)
  const [error,         setError        ] = useState(null)
  const [activeModal,   setActiveModal  ] = useState(null) // complaint obj

  const fetchComplaints = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page, limit: LIMIT })
      if (statusFilter   !== 'all') params.set('status',   statusFilter)
      if (categoryFilter !== 'all') params.set('category', categoryFilter)
      if (hostelName.trim())        params.set('hostelName', hostelName.trim())

      const res = await API.get(`/admin/all-complaints?${params}`)
      setData(res.data.complaints)
      setTotalPages(res.data.totalPages)
    } catch {
      setError('Failed to load complaints. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllForStats = async () => {
    try {
      const res = await API.get('/admin/all-complaints?limit=500')
      setAllData(res.data.complaints)
    } catch {}
  }

  useEffect(() => { setPage(1) }, [statusFilter, categoryFilter, hostelName])
  useEffect(() => { fetchComplaints() }, [statusFilter, categoryFilter, hostelName, page])
  useEffect(() => { fetchAllForStats() }, [])

  const activeFilters = [statusFilter, categoryFilter].filter(f => f !== 'all').length + (hostelName.trim() ? 1 : 0)

  return (
    <div className="min-h-screen bg-[#f3f3f7]">
      <div className="max-w-2xl mx-auto px-5 pt-20 pb-12 space-y-5">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Complaints</h1>
              <span className="flex items-center gap-1 bg-violet-100 text-violet-600 text-xs font-bold px-2.5 py-1 rounded-full border border-violet-200">
                <ShieldIcon /> Admin
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-0.5">Hostel management portal</p>
          </div>
        </div>

        {/* Stats */}
        <StatsRow data={allData} />

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FilterIcon />
            <span className="text-sm font-semibold text-gray-700">Filters</span>
            {activeFilters > 0 && (
              <span className="bg-violet-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{activeFilters}</span>
            )}
            {activeFilters > 0 && (
              <button
                onClick={() => { setStatusFilter('all'); setCategoryFilter('all'); setHostelName('') }}
                className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon /> Clear all
              </button>
            )}
          </div>

          {/* Status chips */}
          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">Status</p>
            <StatusFilterRow value={statusFilter} onChange={setStatusFilter} />
          </div>

          {/* Category chips */}
          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">Category</p>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {CATEGORY_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setCategoryFilter(f.value)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150
                    ${categoryFilter === f.value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hostel name search */}
          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">Hostel</p>
            <div className="relative">
              <input
                type="text"
                value={hostelName}
                onChange={e => setHostelName(e.target.value)}
                placeholder="Filter by hostel name…"
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-50 transition pr-8"
              />
              {hostelName && (
                <button onClick={() => setHostelName('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <XIcon />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List */}
        {error ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-sm text-red-400 mb-3">{error}</p>
            <button onClick={fetchComplaints} className="text-sm text-violet-600 font-medium underline">Retry</button>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse" />)}
          </div>
        ) : data.length === 0 ? (
          <EmptyState isAdmin />
        ) : (
          <motion.div
            className="space-y-3"
            variants={stagger}
            initial="hidden"
            animate="show"
            key={`admin-${statusFilter}-${categoryFilter}-${hostelName}-${page}`}
          >
            {data.map(c => (
              <AdminComplaintCard key={c._id} complaint={c} onAction={setActiveModal} />
            ))}
          </motion.div>
        )}

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>

      <AdminResolveModal
        open={!!activeModal}
        complaint={activeModal}
        onClose={() => setActiveModal(null)}
        onUpdate={() => { fetchComplaints(); fetchAllForStats() }}
      />
    </div>
  )
}

// ─── STUDENT VIEW ─────────────────────────────────────────────────────────────
function StudentView({ currentUserId }) {
  const navigate = useNavigate()

  const [tab,          setTab         ] = useState('mine')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page,         setPage        ] = useState(1)
  const LIMIT = 10

  const [data,       setData      ] = useState([])
  const [allData,    setAllData   ] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading,    setLoading   ] = useState(true)
  const [error,      setError     ] = useState(null)

  const fetchComplaints = async () => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams({ filter: tab, page, limit: LIMIT })
      if (tab === 'all') {
        params.set('status', 'active')
      } else if (statusFilter !== 'all') {
        params.set('status', statusFilter)
      }
      const res = await API.get(`/student/complaints?${params}`)
      setData(res.data.complaints)
      setTotalPages(res.data.totalPages)
    } catch {
      setError('Failed to load complaints. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllForStats = async () => {
    try {
      const res = await API.get('/student/complaints?filter=mine&limit=200')
      setAllData(res.data.complaints)
    } catch {}
  }

  useEffect(() => { setPage(1) }, [tab, statusFilter])
  useEffect(() => { fetchComplaints() }, [tab, statusFilter, page])
  useEffect(() => { if (tab === 'mine') fetchAllForStats() }, [tab])

  const handleDelete = async (id) => {
    await API.delete(`/student/${id}/delete`)
    fetchComplaints(); fetchAllForStats()
  }

  const handleReopen = async (id, reason) => {
    await API.put(`/student/${id}/reopen`, { reason })
    fetchComplaints(); fetchAllForStats()
  }

  const switchTab = (t) => { setTab(t); setStatusFilter('all') }

  return (
    <div className="min-h-screen bg-[#f3f3f7]">
      <div className="max-w-2xl mx-auto px-5 pt-20 pb-12 space-y-5">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Complaints</h1>
            <p className="text-sm text-gray-400 mt-0.5">Hostel management portal</p>
          </div>
          <button
            onClick={() => navigate('/create-complaint')}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <PlusIcon /> New
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm">
          {[{ value: 'all', label: 'All Hostel' }, { value: 'mine', label: 'My Complaints' }].map(t => (
            <button
              key={t.value}
              onClick={() => switchTab(t.value)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${tab === t.value ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <AnimatePresence>
          {tab === 'mine' && (
            <motion.div key="stats" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }}>
              <StatsRow data={allData} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter chips */}
        <AnimatePresence>
          {tab === 'mine' && (
            <motion.div key="filters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-600">Filter by status</span>
                {statusFilter !== 'all' && (
                  <button onClick={() => setStatusFilter('all')} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    <XIcon /> Clear filter
                  </button>
                )}
              </div>
              <StatusFilterRow value={statusFilter} onChange={setStatusFilter} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* List */}
        {error ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-sm text-red-400 mb-3">{error}</p>
            <button onClick={fetchComplaints} className="text-sm text-violet-600 font-medium underline">Retry</button>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse" />)}
          </div>
        ) : data.length === 0 ? (
          <EmptyState tab={tab} statusFilter={statusFilter} />
        ) : (
          <motion.div
            className="space-y-3"
            variants={stagger}
            initial="hidden"
            animate="show"
            key={`${tab}-${statusFilter}-${page}`}
          >
            {data.map(c => (
              <StudentComplaintCard
                key={c._id}
                complaint={c}
                currentUserId={currentUserId}
                onDelete={handleDelete}
                onReopen={handleReopen}
              />
            ))}
          </motion.div>
        )}

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  )
}


export default function ViewComplaints() {
  const decoded = decodeToken()
  const role    = decoded.role  
  const userId  = decoded.id    

  if (role === 'admin') return <AdminView />
  return <StudentView currentUserId={userId} />
}