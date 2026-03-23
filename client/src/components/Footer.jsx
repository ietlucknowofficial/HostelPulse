import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#f9f9fb] border-t border-black/[0.07]">
      <div className="max-w-[1100px] mx-auto px-8 py-14">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">

         
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-[#534AB7] rounded-[8px] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.95"/>
                  <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.65"/>
                  <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.65"/>
                  <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.35"/>
                </svg>
              </div>
              <span className="text-[17px] font-semibold text-[#1a1a22]">HostelPulse</span>
            </div>
            <p className="text-[14px] text-[#7a7a92] leading-relaxed max-w-[220px]">
              Hostel complaint management built for students at IET Lucknow.
            </p>
          </div>

         
          <div>
            <p className="text-[13px] font-semibold text-[#1a1a22] uppercase tracking-wider mb-4">Quick links</p>
            <div className="flex flex-col gap-3">
              <Link to="/"                 className="text-[15px] text-[#6a6a82] hover:text-[#534AB7] transition-colors">Home</Link>
              <Link to="/create-complaint" className="text-[15px] text-[#6a6a82] hover:text-[#534AB7] transition-colors">Raise a complaint</Link>
              <Link to="/complaints"       className="text-[15px] text-[#6a6a82] hover:text-[#534AB7] transition-colors">View all complaints</Link>
              <Link to="/my-complaints"    className="text-[15px] text-[#6a6a82] hover:text-[#534AB7] transition-colors">My complaints</Link>
            </div>
          </div>

         
          <div>
            <p className="text-[13px] font-semibold text-[#1a1a22] uppercase tracking-wider mb-4">Account</p>
            <div className="flex flex-col gap-3">
              <Link to="/login"    className="text-[15px] text-[#6a6a82] hover:text-[#534AB7] transition-colors">Log in</Link>
              <Link to="/register" className="text-[15px] text-[#6a6a82] hover:text-[#534AB7] transition-colors">Sign up</Link>
              <Link to="/profile"  className="text-[15px] text-[#6a6a82] hover:text-[#534AB7] transition-colors">My profile</Link>
            </div>
          </div>

        </div>

        
        <div className="pt-6 border-t border-black/[0.07] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[14px] text-[#9a9ab0]">© 2026 HostelPulse · IET Lucknow</span>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-[14px] text-[#9a9ab0] hover:text-[#1a1a22] transition-colors">Privacy</Link>
            <Link to="/terms"   className="text-[14px] text-[#9a9ab0] hover:text-[#1a1a22] transition-colors">Terms</Link>
            <Link to="/contact" className="text-[14px] text-[#9a9ab0] hover:text-[#1a1a22] transition-colors">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}