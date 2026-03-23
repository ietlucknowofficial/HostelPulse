import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home',              to: '/' },
  { label: 'Raise a complaint', to: '/create-complaint' },
  { label: 'My complaints',     to: '/my-complaints' },
  { label: 'View all',          to: '/complaints' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-[68px] transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-black/[0.08] shadow-sm'
            : 'bg-white border-b border-black/[0.06]'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="w-8 h-8 bg-[#534AB7] rounded-[8px] flex items-center justify-center shadow-md shadow-purple-200"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.95"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.65"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.65"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.35"/>
            </svg>
          </motion.div>
          <span className="text-[17px] font-semibold text-[#1a1a22] tracking-tight">HostelPulse</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, to }) => {
            const active = pathname === to
            return (
              <Link key={to} to={to} className="relative px-4 py-2 text-[15px] group">
                <span className={`relative z-10 transition-colors duration-200 ${active ? 'text-[#534AB7] font-medium' : 'text-[#5a5a72] group-hover:text-[#1a1a22]'}`}>
                  {label}
                </span>
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-[#534AB7]/[0.07] rounded-lg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/login"
              className="text-[15px] text-[#5a5a72] px-4 py-2 rounded-lg border border-black/[0.12] hover:bg-black/[0.04] hover:text-[#1a1a22] transition-colors duration-200"
            >
              Log in
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/register"
              className="text-[15px] text-white font-medium px-4 py-2 rounded-lg bg-[#534AB7] hover:bg-[#6259c9] transition-colors duration-200 shadow-md shadow-purple-200"
            >
              Sign up
            </Link>
          </motion.div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <motion.span animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 bg-[#1a1a22] origin-center transition-all" />
          <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-5 h-0.5 bg-[#1a1a22]" />
          <motion.span animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 bg-[#1a1a22] origin-center transition-all" />
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[68px] left-0 right-0 z-40 bg-white border-b border-black/[0.08] px-6 py-4 flex flex-col gap-2 shadow-lg md:hidden"
          >
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="text-[15px] text-[#5a5a72] py-2.5 px-3 rounded-lg hover:bg-black/[0.04] hover:text-[#1a1a22] transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="flex gap-2 mt-2 pt-3 border-t border-black/[0.06]">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-[15px] text-[#5a5a72] py-2.5 rounded-lg border border-black/[0.12]">Log in</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-[15px] text-white font-medium py-2.5 rounded-lg bg-[#534AB7]">Sign up</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
