import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../api/axios'

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

const CATEGORY_EMOJI = {
  hostel: '🏠', mess: '🍽️', academic: '📚', maintenance: '🔧', other: '📋',
}

const STATUS_CONFIG = {
  pending:       { label: 'Pending',     bg: 'bg-amber-50',   text: 'text-amber-600',   dot: 'bg-amber-400',   border: 'border-amber-200'   },
  'in-progress': { label: 'In Progress', bg: 'bg-blue-50',    text: 'text-blue-600',    dot: 'bg-blue-400',    border: 'border-blue-200'    },
  resolved:      { label: 'Resolved',    bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400', border: 'border-emerald-200' },
  rejected:      { label: 'Rejected',    bg: 'bg-red-50',     text: 'text-red-500',     dot: 'bg-red-400',     border: 'border-red-200'     },
}

const fadeUp  = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.2 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

// ─── Icons ────────────────────────────────────────────────────────────────────
const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const BuildingIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h6M9 17h6M9 5v2M15 5v2"/>
  </svg>
)
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const ClipboardIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1"/>
  </svg>
)

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ count, label, colorClass, bgClass, borderClass }) {
  return (
    <div className={`${bgClass} border ${borderClass} rounded-2xl p-4 text-center`}>
      <p className={`text-2xl font-bold ${colorClass}`}>{count}</p>
      <p className="text-xs text-gray-500 mt-1 font-medium leading-tight">{label}</p>
    </div>
  )
}

// ─── Status Pill ──────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const st = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${st.bg} ${st.text} ${st.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
      {st.label}
    </span>
  )
}

// ─── Mini Complaint Row ───────────────────────────────────────────────────────
function ComplaintRow({ complaint, onClick }) {
  const emoji = CATEGORY_EMOJI[complaint.category] || '📋'
  return (
    <motion.div
      variants={fadeUp}
      onClick={onClick}
      className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm cursor-pointer hover:border-violet-200 transition-colors group"
    >
      <span className="text-xl shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{complaint.complaintName}</p>
        <p className="text-xs text-gray-400 mt-0.5">{complaint.location} · {timeAgo(complaint.createdAt)}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StatusPill status={complaint.status} />
        <span className="text-gray-300 group-hover:text-violet-400 transition-colors"><ChevronRightIcon /></span>
      </div>
    </motion.div>
  )
}

// ─── Hostel Stats Card (Admin) ────────────────────────────────────────────────
function HostelStatCard({ hostel }) {
  const total    = hostel.total    || 0
  const active   = hostel.active   || 0
  const resolved = hostel.resolved || 0
  const pct      = total > 0 ? Math.round((resolved / total) * 100) : 0

  return (
    <motion.div variants={fadeUp} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600">
            <BuildingIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{hostel.name}</p>
            <p className="text-xs text-gray-400">{total} total complaints</p>
          </div>
        </div>
        <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
          {pct}% resolved
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-amber-600">{active}</p>
          <p className="text-xs text-gray-400 mt-0.5">Active</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-emerald-600">{resolved}</p>
          <p className="text-xs text-gray-400 mt-0.5">Resolved</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-gray-600">{total - active - resolved}</p>
          <p className="text-xs text-gray-400 mt-0.5">Other</p>
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-violet-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </motion.div>
  )
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard() {
  const navigate = useNavigate()
  const [stats,   setStats  ] = useState({ pending: 0, 'in-progress': 0, resolved: 0, rejected: 0 })
  const [hostels, setHostels] = useState([])
  const [recent,  setRecent ] = useState([])
  const [loading, setLoading] = useState(true)
  const decoded = decodeToken()

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const res = await API.get('/admin/all-complaints?limit=500')
        const all = res.data.complaints || []

        const counts    = { pending: 0, 'in-progress': 0, resolved: 0, rejected: 0 }
        const hostelMap = {}

        all.forEach(c => {
          if (counts[c.status] !== undefined) counts[c.status]++

          const hName = c.hostelId?.name || 'Unknown'
          if (!hostelMap[hName]) hostelMap[hName] = { name: hName, total: 0, active: 0, resolved: 0 }
          hostelMap[hName].total++
          if (c.status === 'pending' || c.status === 'in-progress') hostelMap[hName].active++
          if (c.status === 'resolved') hostelMap[hName].resolved++
        })

        setStats(counts)
        setHostels(Object.values(hostelMap))
        setRecent(all.filter(c => c.status !== 'resolved' && c.status !== 'rejected').slice(0, 5))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const adminName = decoded.name || 'Admin'
  const initials  = adminName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const total     = stats.pending + stats['in-progress'] + stats.resolved + stats.rejected

  return (
    <div className="min-h-screen bg-[#f3f3f7]">
      <div className="max-w-2xl mx-auto px-5 pt-20 pb-16 space-y-6">

        {/* Greeting */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-700 text-base font-bold">
              {initials}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Welcome back,</p>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">{adminName}</h1>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-full">
            <ShieldIcon /> Admin
          </span>
        </motion.div>

        {/* Summary banner */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show"
          className="bg-violet-600 rounded-2xl p-5 text-white"
        >
          <p className="text-violet-200 text-xs font-medium mb-1">Total complaints logged</p>
          <p className="text-4xl font-bold mb-3">{total}</p>
          <div className="flex gap-3 text-xs flex-wrap">
            <span className="bg-white/20 rounded-lg px-2.5 py-1.5 font-medium">{stats.pending} pending</span>
            <span className="bg-white/20 rounded-lg px-2.5 py-1.5 font-medium">{stats['in-progress']} in progress</span>
            <span className="bg-white/20 rounded-lg px-2.5 py-1.5 font-medium">{stats.resolved} resolved</span>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2.5">
          <StatCard count={stats.pending}        label="Pending"     colorClass="text-amber-500"   bgClass="bg-amber-50"   borderClass="border-amber-100"   />
          <StatCard count={stats['in-progress']} label="In Progress" colorClass="text-blue-500"    bgClass="bg-blue-50"    borderClass="border-blue-100"    />
          <StatCard count={stats.resolved}       label="Resolved"    colorClass="text-emerald-500" bgClass="bg-emerald-50" borderClass="border-emerald-100" />
          <StatCard count={stats.rejected}       label="Rejected"    colorClass="text-red-400"     bgClass="bg-red-50"     borderClass="border-red-100"     />
        </div>

        {/* Hostel breakdown */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
              <BuildingIcon /> Hostel breakdown
            </h2>
            <button
              onClick={() => navigate('/view-complaints')}
              className="text-xs text-violet-600 font-semibold hover:underline"
            >
              View all complaints →
            </button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 h-32 animate-pulse" />)}
            </div>
          ) : (
            <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="show">
              {hostels.map(h => <HostelStatCard key={h.name} hostel={h} />)}
              {hostels.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">No hostel data available.</div>
              )}
            </motion.div>
          )}
        </div>

        {/* Recent active complaints */}
        {recent.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                <ClipboardIcon /> Recent active complaints
              </h2>
            </div>
            <motion.div className="space-y-2" variants={stagger} initial="hidden" animate="show">
              {recent.map(c => (
                <ComplaintRow key={c._id} complaint={c} onClick={() => navigate('/view-complaints')} />
              ))}
            </motion.div>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────
function StudentDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [stats,   setStats  ] = useState({ pending: 0, 'in-progress': 0, resolved: 0, rejected: 0 })
  const [active,  setActive ] = useState([])
  const [loading, setLoading] = useState(true)
  const decoded = decodeToken()

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const res = await API.get('/student/complaints?filter=mine&limit=200')
        const all = res.data.complaints || []

        const counts = { pending: 0, 'in-progress': 0, resolved: 0, rejected: 0 }
        all.forEach(c => { if (counts[c.status] !== undefined) counts[c.status]++ })
        setStats(counts)
        setActive(all.filter(c => c.status === 'pending' || c.status === 'in-progress').slice(0, 4))

        try {
          const pRes = await API.get('/student/profile')
          setProfile(pRes.data.profile)
        } catch {}
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const studentName = decoded.name || 'Student'
  const initials    = studentName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const total       = stats.pending + stats['in-progress'] + stats.resolved + stats.rejected
  const resolvedPct = total > 0 ? Math.round((stats.resolved / total) * 100) : 0

  return (
    <div className="min-h-screen bg-[#f3f3f7]">
      <div className="max-w-2xl mx-auto px-5 pt-20 pb-16 space-y-6">

        {/* Greeting */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-700 text-base font-bold">
              {initials}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Welcome back,</p>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">{studentName}</h1>
            </div>
          </div>
          <button
            onClick={() => navigate('/create-complaint')}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <PlusIcon /> New
          </button>
        </motion.div>

        {/* Profile card */}
        <AnimatePresence>
          {profile && (
            <motion.div
              key="profile"
              variants={fadeUp} initial="hidden" animate="show"
              className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <UserIcon />
                  <span className="text-sm font-bold text-gray-700">Your profile</span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {[
                    { label: 'Roll No.', value: profile.rollNo },
                    { label: 'Branch',   value: profile.branch },
                    { label: 'Room',     value: profile.roomNo },
                    { label: 'Hostel',   value: profile.hostelId?.name || '—' },
                    { label: 'Year',     value: profile.admissionYear },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary banner */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show"
          className="bg-violet-600 rounded-2xl p-5 text-white"
        >
          <p className="text-violet-200 text-xs font-medium mb-1">Your complaints</p>
          <p className="text-4xl font-bold mb-1">{total}</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 bg-white/20 rounded-full h-1.5">
              <div className="bg-white h-1.5 rounded-full transition-all duration-700" style={{ width: `${resolvedPct}%` }} />
            </div>
            <span className="text-white/80 text-xs font-medium">{resolvedPct}% resolved</span>
          </div>
          <div className="flex gap-2 text-xs flex-wrap">
            <span className="bg-white/20 rounded-lg px-2.5 py-1.5 font-medium">{stats.pending} pending</span>
            <span className="bg-white/20 rounded-lg px-2.5 py-1.5 font-medium">{stats['in-progress']} in progress</span>
            <span className="bg-white/20 rounded-lg px-2.5 py-1.5 font-medium">{stats.resolved} resolved</span>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2.5">
          <StatCard count={stats.pending}        label="Pending"     colorClass="text-amber-500"   bgClass="bg-amber-50"   borderClass="border-amber-100"   />
          <StatCard count={stats['in-progress']} label="In Progress" colorClass="text-blue-500"    bgClass="bg-blue-50"    borderClass="border-blue-100"    />
          <StatCard count={stats.resolved}       label="Resolved"    colorClass="text-emerald-500" bgClass="bg-emerald-50" borderClass="border-emerald-100" />
          <StatCard count={stats.rejected}       label="Rejected"    colorClass="text-red-400"     bgClass="bg-red-50"     borderClass="border-red-100"     />
        </div>

        {/* Active complaints */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
              <ClipboardIcon /> Active complaints
            </h2>
            <button
              onClick={() => navigate('/view-complaints')}
              className="text-xs text-violet-600 font-semibold hover:underline"
            >
              View all →
            </button>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl border border-gray-100 h-16 animate-pulse" />)}
            </div>
          ) : active.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-4xl mb-2">🎉</p>
              <p className="text-sm text-gray-400">No active complaints. All clear!</p>
            </div>
          ) : (
            <motion.div className="space-y-2" variants={stagger} initial="hidden" animate="show">
              {active.map(c => (
                <ComplaintRow key={c._id} complaint={c} onClick={() => navigate('/view-complaints')} />
              ))}
            </motion.div>
          )}
        </div>

        {/* Quick action */}
        <motion.button
          variants={fadeUp} initial="hidden" animate="show"
          onClick={() => navigate('/create-complaint')}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-violet-200 text-violet-500 hover:border-violet-400 hover:text-violet-700 font-semibold text-sm py-4 rounded-2xl transition-all"
        >
          <PlusIcon /> File a new complaint
        </motion.button>

      </div>
    </div>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const decoded = decodeToken()
  if (decoded.role === 'admin') return <AdminDashboard />
  return <StudentDashboard />
}