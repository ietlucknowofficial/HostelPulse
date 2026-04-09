import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const location = useLocation()

  
  const data = localStorage.getItem('token')


  if (data.role!=='student') {
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