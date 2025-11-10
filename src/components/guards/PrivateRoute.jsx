import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

/**
 * Private Route Guard
 * Redirects to login if user is not authenticated
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  if (loading) {
    return null // Or a loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
