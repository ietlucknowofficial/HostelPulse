import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const location = useLocation()

  const stored = localStorage.getItem('user')

  let user = null
  try {
    user = stored ? JSON.parse(stored) : null
  } catch {
    user = null
  }

  if (!user || user.role !== 'student') {
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    )
  }

  return children
}