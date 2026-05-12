import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login, register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isLogin) {
                await login(formData.email, formData.password)
            } else {
                if (formData.name.length < 3) throw new Error('El nombre debe tener al menos 3 caracteres.')
                await register(formData.name, formData.email, formData.password)
            }
            navigate('/')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="auth-page anim-fade-in">
            <div className="auth-left">
                <div className="auth-box">
                    <div className="auth-logo">
                        <span className="fork-icon">🍴</span>
                        Fork<span>Review</span>
                    </div>

                    <h2 className="auth-title">
                        {isLogin ? '¡Bienvenido de nuevo!' : 'Crea tu cuenta'}
                    </h2>
                    <p className="auth-sub">
                        {isLogin
                            ? 'Ingresa tus credenciales para acceder a las mejores reseñas.'
                            : 'Únete a la comunidad gastronómica más grande del mundo.'}
                    </p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {error && <div className="alert-msg alert-error">{error}</div>}

                        {!isLogin && (
                            <div className="form-group">
                                <label className="form-label">Nombre completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    placeholder="Tu nombre"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="correo@ejemplo.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="••••••••"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 10 }}>
                            {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                        </button>

                        <div className="auth-divider">o continúa con</div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button type="button" className="social-btn" style={{ flex: 1 }}>
                                <span>Google</span>
                            </button>
                            <button type="button" className="social-btn" style={{ flex: 1 }}>
                                <span>Apple</span>
                            </button>
                        </div>
                    </form>

                    <p className="auth-switch">
                        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'} {' '}
                        <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }}>
                            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                        </a>
                    </p>

                    {!isLogin && (
                        <p className="auth-terms">
                            Al registrarte, aceptas nuestros <a href="#">Términos de Servicio</a> y <a href="#">Política de Privacidad</a>.
                        </p>
                    )}
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-right-bg" />
                <img
                    src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80"
                    alt="Restaurant mood"
                />
                <div className="auth-right-overlay anim-fade-up">
                    <p className="auth-quote">
                        "La gastronomía es el arte de usar la comida para crear felicidad."
                    </p>
                    <p className="auth-quote-author">— Theodore Zeldin</p>
                </div>
            </div>
        </div>
    )
}
