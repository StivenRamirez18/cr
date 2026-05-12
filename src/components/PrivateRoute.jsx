import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth()
    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-muted)' }}>Cargando...</div>
    return user ? children : <Navigate to="/auth" replace />
}
