import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../api/axios'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
}

export default function VerifyEmail() {
  const navigate = useNavigate()
  const [otp, setOtp]         = useState(['', '', '', '', '', ''])
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])

  const pendingEmail = sessionStorage.getItem('pendingEmail') || ''

  useEffect(() => {
    const allowed = sessionStorage.getItem('canVerify')
    if (!allowed) navigate('/register')
  }, [])

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0)  inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const newOtp = [...otp]
    pasted.split('').forEach((char, i) => { newOtp[i] = char })
    setOtp(newOtp)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter the complete 6-digit code.'); return }
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/verify-email', {
        email: pendingEmail,
        otp:   code,
      })
      setSuccess(true)
      sessionStorage.removeItem('canVerify')
      sessionStorage.removeItem('pendingEmail')
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      const status = err.response?.status
      if (status === 400) setError(err.response?.data?.message || 'Invalid OTP. Please check and try again.')
      else if (status === 410) setError('OTP has expired. Please request a new one.')
      else setError(err.response?.data?.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    setResending(true)
    setError('')
    try {
      await API.post('/auth/resend-otp', { email: pendingEmail })
      setCountdown(30)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend. Please try again.')
    } finally {
      setResending(false)
    }
  }

  const filledCount = otp.filter(Boolean).length

  return (
    <div className="min-h-screen flex">

      <div className="hidden lg:flex lg:w-[48%] bg-[#534AB7] relative overflow-hidden flex-col justify-between p-12">
        <motion.div animate={{ x: [0, 30, -15, 0], y: [0, -40, 25, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-[-60px] left-[-60px] w-[380px] h-[380px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)' }} />
        <motion.div animate={{ x: [0, -40, 20, 0], y: [0, 30, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 3 }} className="absolute bottom-[-80px] right-[-40px] w-[420px] h-[420px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }} />
        <motion.div animate={{ x: [0, 25, -10, 0], y: [0, -20, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 6 }} className="absolute top-[40%] right-[10%] w-[200px] h-[200px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-[10px] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.95"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.65"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.65"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.35"/>
            </svg>
          </div>
          <span className="text-[18px] font-semibold text-white tracking-tight">HostelPulse</span>
        </div>

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <h2 className="text-[40px] font-bold text-white leading-tight tracking-tight mb-5">
              One last<br />step.
            </h2>
            <p className="text-[16px] text-white/65 leading-relaxed max-w-[320px]">
              We sent a 6-digit code to your email. Enter it to verify your account and get started.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="mt-10 space-y-4">
            {[
              { icon: '📧', text: 'Check your inbox or spam folder' },
              { icon: '⏱️', text: 'Code expires in 10 minutes' },
              { icon: '🔄', text: 'You can request a new code anytime' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[15px]">{icon}</div>
                <span className="text-[14px] text-white/70">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 bg-white/10 border border-white/15 rounded-2xl p-5">
          <p className="text-[14px] text-white/80 leading-relaxed italic">
            "Finally a system that actually keeps track of our complaints. Got my water issue fixed in less than a day."
          </p>
          <div className="flex items-center gap-2.5 mt-3">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-semibold text-white">AK</div>
            <div>
              <div className="text-[13px] font-medium text-white">Arjun Kumar</div>
              <div className="text-[12px] text-white/50">3rd Year, IET Lucknow</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <motion.div variants={stagger} initial="hidden" animate="show" className="w-full max-w-[440px]">

          <motion.div variants={fadeUp} className="mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-7 h-7 bg-[#534AB7] rounded-[7px] flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.95"/>
                  <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.65"/>
                  <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.65"/>
                  <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.35"/>
                </svg>
              </div>
              <span className="text-[16px] font-semibold text-[#1a1a22]">HostelPulse</span>
            </div>

            <div className="w-14 h-14 bg-[#534AB7]/[0.08] rounded-2xl flex items-center justify-center mb-5 border border-[#534AB7]/15">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#534AB7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6l-10 7L2 6" stroke="#534AB7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h1 className="text-[32px] font-bold text-[#1a1a22] tracking-tight mb-1.5">Verify your email</h1>
            <p className="text-[15px] text-[#7a7a92] leading-relaxed">
              We sent a 6-digit code to{' '}
              <span className="font-medium text-[#1a1a22]">{pendingEmail || 'your email'}</span>
            </p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-[14px] px-4 py-3 rounded-xl mb-6">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="1.5"/>
                  <path d="M8 5v3M8 10h.01" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center bg-green-50 border border-green-200 rounded-2xl px-6 py-8 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#1D9E75]/10 flex items-center justify-center mb-4">
                  <motion.svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <motion.path d="M5 13l4 4L19 7" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
                  </motion.svg>
                </div>
                <h3 className="text-[18px] font-bold text-[#1a1a22] mb-1.5">Email verified!</h3>
                <p className="text-[14px] text-[#6a6a82] leading-relaxed mb-3">
                  Your account is now active. Redirecting you to login...
                </p>
                <div className="w-full bg-green-100 rounded-full h-1 overflow-hidden">
                  <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.5, ease: 'linear' }} className="h-full bg-[#1D9E75] rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className={`space-y-6 ${success ? 'opacity-50 pointer-events-none' : ''}`}>

            <motion.div variants={fadeUp}>
              <label className="block text-[14px] font-medium text-[#1a1a22] mb-4">Enter 6-digit code</label>
              <div className="flex gap-3 justify-between" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    whileFocus={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`w-[52px] h-[60px] text-center text-[22px] font-bold rounded-xl border-2 outline-none transition-all duration-150
                      ${digit
                        ? 'bg-[#534AB7]/[0.06] border-[#534AB7] text-[#534AB7]'
                        : 'bg-[#f9f9fb] border-black/[0.1] text-[#1a1a22]'
                      }
                      focus:border-[#534AB7] focus:bg-[#534AB7]/[0.05] focus:ring-2 focus:ring-[#534AB7]/10
                      placeholder:text-[#d0d0e0]
                    `}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5 mt-4">
                {otp.map((digit, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: digit ? 1.2 : 1, backgroundColor: digit ? '#534AB7' : '#e0e0ea' }}
                    transition={{ duration: 0.15 }}
                    className="w-1.5 h-1.5 rounded-full"
                  />
                ))}
                <span className="text-[12px] text-[#9a9ab0] ml-2">{filledCount}/6 digits entered</span>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <motion.button
                type="submit"
                disabled={loading || filledCount < 6}
                whileHover={{ scale: filledCount === 6 ? 1.02 : 1, y: filledCount === 6 ? -1 : 0 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-[52px] bg-[#534AB7] hover:bg-[#6259c9] text-white text-[16px] font-semibold rounded-xl transition-colors shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                      <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify email
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </motion.button>
            </motion.div>

          </form>

          <motion.div variants={fadeUp} className="text-center mt-6">
            <p className="text-[14px] text-[#7a7a92]">
              Didn't receive the code?{' '}
              {canResend ? (
                <button onClick={handleResend} disabled={resending} className="text-[#534AB7] font-medium hover:underline disabled:opacity-50">
                  {resending ? 'Sending...' : 'Resend code'}
                </button>
              ) : (
                <span className="text-[#9a9ab0]">
                  Resend in <span className="font-medium text-[#534AB7]">{countdown}s</span>
                </span>
              )}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="text-center mt-3">
            <Link to="/login" className="text-[13px] text-[#9a9ab0] hover:text-[#534AB7] transition-colors">
              ← Back to login
            </Link>
          </motion.div>

        </motion.div>
      </div>

    </div>
  )
}