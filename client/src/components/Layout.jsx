import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()
  const hideNav = ['/login', '/register'].includes(pathname)

  return (
    <div>
      {!hideNav && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!hideNav&&<Footer/>}
    </div>
  )
}