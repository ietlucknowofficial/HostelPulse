import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
}

const features = [
  {
    color:   '#534AB7',
    bgColor: 'rgba(83,74,183,0.07)',
    title:   'Raise complaints instantly',
    desc:    'Submit any hostel issue in seconds — maintenance, mess, or academics. No paperwork, no queues.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L3 6.5v7L10 18l7-4.5v-7L10 2z" stroke="#534AB7" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M10 8v4M10 14h.01" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    color:   '#1D9E75',
    bgColor: 'rgba(29,158,117,0.07)',
    title:   'Real-time status tracking',
    desc:    'Know exactly where your complaint stands — pending, in-progress, or resolved. Always in the loop.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="#1D9E75" strokeWidth="1.5"/>
        <path d="M7 10l2 2 4-4" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    color:   '#D85A30',
    bgColor: 'rgba(216,90,48,0.07)',
    title:   'Admin remarks & notes',
    desc:    'Admins leave clear remarks on every resolution. No more guessing why your complaint was closed.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 5h12M4 10h8M4 15h6" stroke="#D85A30" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    color:   '#534AB7',
    bgColor: 'rgba(83,74,183,0.07)',
    title:   'Reopen if unresolved',
    desc:    "Not satisfied with the resolution? Reopen any resolved complaint with a reason and escalate it.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 10a6 6 0 016-6 6 6 0 014.24 1.76L16 8" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 4v4h-4" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    color:   '#1D9E75',
    bgColor: 'rgba(29,158,117,0.07)',
    title:   'Category-based filtering',
    desc:    'Filter complaints by mess, maintenance, academic, or hostel category to find what you need fast.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="#1D9E75" strokeWidth="1.5"/>
        <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="#1D9E75" strokeWidth="1.5"/>
        <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="#1D9E75" strokeWidth="1.5"/>
        <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="#1D9E75" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    color:   '#D85A30',
    bgColor: 'rgba(216,90,48,0.07)',
    title:   'Full complaint history',
    desc:    'Every complaint ever raised, with timestamps and full status trail — nothing gets lost or forgotten.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="#D85A30" strokeWidth="1.5"/>
        <path d="M10 6v4l2.5 2.5" stroke="#D85A30" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const stats = [
  { value: '1,200+', label: 'Complaints resolved' },
  { value: '98%',    label: 'Resolution rate' },
  { value: '24hr',   label: 'Avg response time' },
]

function SectionWrapper({ children }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const readUser = () => {
      const stored = localStorage.getItem('user')
      try { setUser(stored ? JSON.parse(stored) : null) } catch { setUser(null) }
    }
    readUser()
    window.addEventListener('storage', readUser)
     window.addEventListener('userChanged', readUser)
    return () => {
      window.removeEventListener('storage', readUser),
    window.removeEventListener('userChanged', readUser)}
  }, [])

  return (
    <div className="bg-white pt-[68px]">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="min-h-[calc(100vh-68px)] flex items-center justify-center text-center px-6 py-24 relative overflow-hidden bg-white">

        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -50, 30, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-80px] left-[-60px] w-[480px] h-[480px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(83,74,183,0.13) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, -50, 30, 0], y: [0, 40, -30, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[-100px] right-[-80px] w-[520px] h-[520px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(29,158,117,0.1) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, 60, -30, 0], y: [0, -30, 50, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-[30%] right-[5%] w-[320px] h-[320px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(216,90,48,0.08) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, -30, 40, 0], y: [0, 60, -20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          className="absolute bottom-[10%] left-[10%] w-[280px] h-[280px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(83,74,183,0.09) 0%, transparent 70%)' }}
        />

        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: 'radial-gradient(circle, #534AB7 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          }}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-[720px] w-full"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-[#534AB7]/[0.07] border border-[#534AB7]/20 rounded-full px-5 py-2 mb-9">
            <span className="w-2.5 h-2.5 rounded-full bg-[#534AB7] animate-pulse" />
            <span className="text-[15px] text-[#534AB7] font-medium">Now live at IET Lucknow</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-[64px] sm:text-[78px] font-bold text-[#1a1a22] leading-[1.04] tracking-[-2.5px] mb-7"
          >
            Hostel complaints,<br />
            finally{' '}
            <span className="relative inline-block text-[#534AB7]">
              under control.
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
                className="absolute -bottom-1 left-0 right-0 h-[4px] bg-[#534AB7]/25 rounded-full origin-left"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-[20px] text-[#6a6a82] leading-relaxed mb-11 max-w-[560px] mx-auto"
          >
            Raise, track, and resolve hostel issues in one place. Built for students, managed by admins — no more lost complaints.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
            <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}>
           <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}>
  <Link
    to={
      user
        ? user.role === 'admin'
          ? '/view-complaints'
          : '/create-complaint'
        : '/register'
    }
    className="inline-flex items-center gap-2 text-[17px] text-white font-medium px-8 py-4 rounded-xl bg-[#534AB7] hover:bg-[#6259c9] transition-colors shadow-lg shadow-purple-200"
  >
    {user
      ? user.role === 'admin'
        ? 'Resolve complaints'
        : 'Raise a complaint'
      : 'Get started'}
      
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </Link>
</motion.div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={
      user
        ? '/view-complaints'
        : '/register'
    }
                className="inline-flex items-center gap-2 text-[17px] text-[#5a5a72] font-medium px-8 py-4 rounded-xl border border-black/[0.12] hover:bg-black/[0.03] hover:text-[#1a1a22] transition-colors"
              >
                View complaints
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-12 mt-16 pt-12 border-t border-black/[0.06]"
          >
            {stats.map(({ value, label }, i) => (
              <div key={label} className="flex items-center gap-12">
                <div className="text-center">
                  <div className="text-[34px] font-bold text-[#1a1a22] tracking-tight">{value}</div>
                  <div className="text-[15px] text-[#9a9ab0] mt-1.5">{label}</div>
                </div>
                {i < stats.length - 1 && <div className="w-px h-10 bg-black/[0.08]" />}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="px-6 py-24 bg-[#f9f9fb] border-t border-black/[0.06]">
        <SectionWrapper>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-[13px] font-semibold text-[#534AB7] tracking-widest uppercase mb-4">Features</p>
            <h2 className="text-[40px] sm:text-[48px] font-bold text-[#1a1a22] tracking-tight leading-tight mb-5">
              Everything you need,<br />nothing you don't.
            </h2>
            <p className="text-[18px] text-[#6a6a82] max-w-[460px] mx-auto leading-relaxed">
              A simple, fast system that keeps students informed and admins accountable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1100px] mx-auto">
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.09)' }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-black/[0.07] rounded-2xl p-8 cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: f.bgColor }}
                >
                  {f.icon}
                </div>
                <div className="text-[17px] font-semibold text-[#1a1a22] mb-3">{f.title}</div>
                <div className="text-[15px] text-[#7a7a92] leading-relaxed">{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* ── CTA ── */}
      <section
        className="px-6 py-28 text-center relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/footer-bg.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-[#1a1a22]/80" />
        <SectionWrapper>
          <motion.div variants={fadeUp} className="relative max-w-[560px] mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-7">
              <span className="text-[15px] text-white/80 font-medium">
                {user?.role === 'admin' ? 'Admin panel' : 'Join your hostelmates'}
              </span>
            </div>
            <h2 className="text-[42px] sm:text-[52px] font-bold text-white tracking-tight leading-tight mb-6">
              {user?.role === 'admin'
                ? <>Ready to resolve<br />pending complaints?</>
                : <>Ready to get<br />your issues resolved?</>}
            </h2>
            <p className="text-[18px] text-white/65 mb-11 leading-relaxed">
              {user?.role === 'admin'
                ? 'Review and resolve complaints raised by students. Keep the hostel running smoothly.'
                : 'Join hundreds of students already using HostelPulse to get their problems heard and fixed — faster than ever.'}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {user ? (
                <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={user.role === 'admin' ? '/resolve-complaints' : '/create-complaint'}
                    className="inline-flex items-center gap-2 text-[17px] text-white font-medium px-9 py-4 rounded-xl bg-[#534AB7] hover:bg-[#6259c9] transition-colors shadow-purple-200"
                  >
                    {user.role === 'admin' ? 'Resolve complaints' : 'Raise a complaint'}
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 text-[17px] text-white font-medium px-9 py-4 rounded-xl bg-[#534AB7] hover:bg-[#6259c9] transition-colors shadow-purple-200"
                    >
                      Create your account
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/view-complaints"
                      className="text-[17px] text-white/80 font-medium px-9 py-4 rounded-xl border border-white/20 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      Browse complaints
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </SectionWrapper>
      </section>

    </div>
  )
}