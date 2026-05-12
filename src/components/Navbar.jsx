import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ onAddReview }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/auth')
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="fork-icon">🍴</span>
                Fork<span>Review</span>
            </div>

            <div className="navbar-actions">
                {user ? (
                    <div className="navbar-user">
                        <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
                        <span className="user-name">{user.name}</span>
                        <button
                            id="btn-logout"
                            className="btn-ghost"
                            onClick={handleLogout}
                            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                        >
                            Salir
                        </button>
                    </div>
                ) : (
                    <button className="btn-primary" onClick={() => navigate('/auth')}>
                        Iniciar sesión
                    </button>
                )}
            </div>
        </nav>
    )
}
