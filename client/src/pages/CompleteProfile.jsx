import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import API from "../api/axios";

const BRANCHES = ["CSE-R","CSE-SF","CSE-AI","ECE","EE","ME","CHE","CE","MCA","MBA"];
const HOSTELS  = ["H1","H2","H3","H4","G1","G2"];
const currentYear = new Date().getFullYear();
const ADMISSION_YEARS = Array.from({ length: 6 }, (_, i) => currentYear - i);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
};

function ProgressSteps({ current }) {
  const steps = ["Account", "Profile", "Done"];
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((label, i) => {
        const idx   = i + 1;
        const done  = idx < current;
        const active = idx === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold transition-all
                ${done || active
                  ? "bg-[#534AB7] text-white shadow-md shadow-purple-200"
                  : "bg-[#f9f9fb] border border-black/10 text-[#b0b0c0]"}`}>
                {done ? (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5L5 9.5L11 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : idx}
              </div>
              <span className={`text-[11px] font-medium ${active ? "text-[#534AB7]" : "text-[#b0b0c0]"}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-14 h-[1.5px] mx-1 mb-5 transition-all ${done ? "bg-[#534AB7]" : "bg-black/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, error, required, children }) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
      <label className="text-[14px] font-medium text-[#1a1a22]">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-[13px] text-red-500 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#ef4444" strokeWidth="1.5"/>
              <path d="M6 3.5v3M6 8h.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const inputCls = (err) =>
  `w-full h-[48px] px-4 text-[15px] text-[#1a1a22] bg-[#f9f9fb] border rounded-xl outline-none transition-all placeholder:text-[#b0b0c0] focus:bg-white focus:ring-2 ${
    err ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-black/[0.1] focus:border-[#534AB7] focus:ring-[#534AB7]/10"}`;

const selectCls = (err, hasVal) =>
  `w-full h-[48px] px-4 pr-10 text-[15px] bg-[#f9f9fb] border rounded-xl outline-none transition-all appearance-none cursor-pointer focus:bg-white focus:ring-2 ${
    hasVal ? "text-[#1a1a22]" : "text-[#b0b0c0]"} ${
    err ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-black/[0.1] focus:border-[#534AB7] focus:ring-[#534AB7]/10"}`;

const ChevronDown = () => (
  <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 4l4 4 4-4" stroke="#888780" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

function SuccessScreen({ profile, user }) {
  const navigate = useNavigate();
  const initials = (user?.name || "ST").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-[#534AB7]/10 flex items-center justify-center mb-4">
        <motion.svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <motion.path d="M5 13l4 4L19 7" stroke="#534AB7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.15 }} />
        </motion.svg>
      </div>
      <h3 className="text-[20px] font-bold text-[#1a1a22] mb-1">Profile completed!</h3>
      <p className="text-[14px] text-[#7a7a92] mb-6">Your student profile has been saved successfully.</p>

      <div className="w-full bg-[#f9f9fb] border border-black/[0.07] rounded-2xl p-4 text-left mb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-[#534AB7]/15 flex items-center justify-center text-[13px] font-bold text-[#534AB7]">
            {initials}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#1a1a22]">{user?.name || "Student"}</p>
            <p className="text-[12px] text-[#9a9ab0]">{user?.email}</p>
          </div>
        </div>
        <div className="border-t border-black/[0.06] pt-3 space-y-2">
          {[
            ["Roll No",        profile.rollNo],
            ["Branch",         profile.branch],
            ["Hostel",         profile.hostelName],
            ["Room No",        profile.roomNo],
            ["Admission Year", profile.admissionYear],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-[13px] text-[#9a9ab0]">{k}</span>
              <span className="text-[13px] font-semibold text-[#1a1a22]">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <motion.button onClick={() => navigate("/dashboard")}
        whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
        className="w-full h-[52px] bg-[#534AB7] hover:bg-[#6259c9] text-white text-[16px] font-semibold rounded-xl transition-colors shadow-lg shadow-purple-200 flex items-center justify-center gap-2">
        Go to dashboard
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
    </motion.div>
  );
}

export default function CompleteProfile() {
  const navigate = useNavigate();

  const [user,         setUser]         = useState(null);
  const [authLoading,  setAuthLoading]  = useState(true);
  const [form,         setForm]         = useState({ rollNo: "", branch: "", roomNo: "", hostelName: "", admissionYear: "" });
  const [errors,       setErrors]       = useState({});
  const [serverError,  setServerError]  = useState("");
  const [loading,      setLoading]      = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [savedProfile, setSavedProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login", { replace: true }); return; }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) throw new Error("Expired");
      setUser({ name: decoded.name, email: decoded.email });
      setAuthLoading(false);
    } catch {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const validate = () => {
    const e = {};
    if (!form.rollNo.trim())    e.rollNo       = "Roll number is required";
    if (!form.branch)           e.branch       = "Branch is required";
    if (!form.roomNo.trim())    e.roomNo       = "Room number is required";
    if (!form.hostelName)       e.hostelName   = "Hostel name is required";
    if (!form.admissionYear)    e.admissionYear = "Admission year is required";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
    setServerError("");
  };

  const handleSubmit = async () => {
    const ve = validate();
    if (Object.keys(ve).length) { setErrors(ve); return; }
    setLoading(true);
    setServerError("");
    try {
      await API.post("/student/complete-profile", form);
      setSavedProfile({ ...form });
      setSubmitted(true);
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <svg className="animate-spin mx-auto mb-3" width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#534AB7" strokeWidth="2" strokeOpacity="0.2"/>
            <path d="M12 2a10 10 0 0110 10" stroke="#534AB7" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <p className="text-[13px] text-[#9a9ab0]">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[48%] bg-[#534AB7] relative overflow-hidden flex-col justify-between p-12">
        <motion.div animate={{ x:[0,30,-15,0], y:[0,-40,25,0] }} transition={{ duration:16, repeat:Infinity, ease:"easeInOut" }}
          className="absolute top-[-60px] left-[-60px] w-[380px] h-[380px] rounded-full"
          style={{ background:"radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)" }} />
        <motion.div animate={{ x:[0,-40,20,0], y:[0,30,-20,0] }} transition={{ duration:20, repeat:Infinity, ease:"easeInOut", delay:3 }}
          className="absolute bottom-[-80px] right-[-40px] w-[420px] h-[420px] rounded-full"
          style={{ background:"radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)" }} />
        <motion.div animate={{ x:[0,25,-10,0], y:[0,-20,30,0] }} transition={{ duration:14, repeat:Infinity, ease:"easeInOut", delay:6 }}
          className="absolute top-[40%] right-[10%] w-[200px] h-[200px] rounded-full"
          style={{ background:"radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize:"32px 32px" }} />

        {/* Logo */}
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

        {/* Copy */}
        <div className="relative z-10">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.2 }}>
            <h2 className="text-[40px] font-bold text-white leading-tight tracking-tight mb-5">
              One last step<br />to get started.
            </h2>
            <p className="text-[16px] text-white/65 leading-relaxed max-w-[320px]">
              Tell us about your hostel and branch so we can personalise your experience and route issues to the right warden.
            </p>
          </motion.div>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.5 }}
            className="flex gap-8 mt-10">
            {[["60 sec","To complete"],["100%","Stays private"],["Instant","Access granted"]].map(([val, label]) => (
              <div key={label}>
                <div className="text-[24px] font-bold text-white">{val}</div>
                <div className="text-[13px] text-white/55 mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/10 border border-white/15 rounded-2xl p-5">
          <p className="text-[14px] text-white/80 leading-relaxed italic">
            "Setting up my profile took less than a minute. Now I get notified the moment my complaint is assigned."
          </p>
          <div className="flex items-center gap-2.5 mt-3">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-semibold text-white">RK</div>
            <div>
              <div className="text-[13px] font-medium text-white">Rahul Kumar</div>
              <div className="text-[12px] text-white/50">3rd Year, IET Lucknow</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <motion.div variants={stagger} initial="hidden" animate="show" className="w-full max-w-[440px]">

          {/* Mobile logo */}
          <motion.div variants={fadeUp} className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-7 h-7 bg-[#534AB7] rounded-[7px] flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.95"/>
                <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.65"/>
                <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.65"/>
                <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.35"/>
              </svg>
            </div>
            <span className="text-[16px] font-semibold text-[#1a1a22]">HostelPulse</span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeUp} className="mb-7">
            <h1 className="text-[32px] font-bold text-[#1a1a22] tracking-tight mb-1.5">Complete your profile</h1>
            <p className="text-[15px] text-[#7a7a92]">Step 2 of 2 — hostel &amp; academic details</p>
          </motion.div>

          <ProgressSteps current={submitted ? 3 : 2} />

          {/* Server error banner */}
          <AnimatePresence>
            {serverError && (
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-[14px] px-4 py-3 rounded-xl mb-5">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="1.5"/>
                  <path d="M8 5v3M8 10h.01" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          {submitted ? (
            <SuccessScreen profile={savedProfile} user={user} />
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="show"
              className={`space-y-4 ${loading ? "opacity-70 pointer-events-none" : ""}`}>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Roll number" required error={errors.rollNo}>
                  <input value={form.rollNo} onChange={handleChange("rollNo")}
                    placeholder="21CS001" className={inputCls(errors.rollNo)} />
                </Field>
                <Field label="Room number" required error={errors.roomNo}>
                  <input value={form.roomNo} onChange={handleChange("roomNo")}
                    placeholder="A-204" className={inputCls(errors.roomNo)} />
                </Field>
              </div>

              <Field label="Branch" required error={errors.branch}>
                <div className="relative">
                  <select value={form.branch} onChange={handleChange("branch")}
                    className={selectCls(errors.branch, !!form.branch)}>
                    <option value="" disabled>Select your branch</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronDown />
                </div>
              </Field>

              <Field label="Hostel name" required error={errors.hostelName}>
                <div className="relative">
                  <select value={form.hostelName} onChange={handleChange("hostelName")}
                    className={selectCls(errors.hostelName, !!form.hostelName)}>
                    <option value="" disabled>Select your hostel</option>
                    {HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <ChevronDown />
                </div>
              </Field>

              <Field label="Admission year" required error={errors.admissionYear}>
                <div className="relative">
                  <select value={form.admissionYear} onChange={handleChange("admissionYear")}
                    className={selectCls(errors.admissionYear, !!form.admissionYear)}>
                    <option value="" disabled>Select admission year</option>
                    {ADMISSION_YEARS.map(y => <option key={y} value={String(y)}>{y}</option>)}
                  </select>
                  <ChevronDown />
                </div>
              </Field>

              <motion.div variants={fadeUp} className="pt-2">
                <motion.button onClick={handleSubmit} disabled={loading}
                  whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                  className="w-full h-[52px] bg-[#534AB7] hover:bg-[#6259c9] text-white text-[16px] font-semibold rounded-xl transition-colors shadow-lg shadow-purple-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                        <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Saving profile...
                    </>
                  ) : (
                    <>
                      Save profile
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </motion.button>
              </motion.div>

              <motion.p variants={fadeUp} className="text-center text-[13px] text-[#b0b0c0]">
                Your roll number must match the digits in your registered email.
              </motion.p>

            </motion.div>
          )}
        </motion.div>
      </div>

    </div>
  );
}