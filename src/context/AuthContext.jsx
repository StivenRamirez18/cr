import { createContext, useContext, useState, useEffect } from 'react'
import { API_URL } from '../config'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem('forkreview_user')
        if (stored) {
            try { setUser(JSON.parse(stored)) } catch { }
        }
        setLoading(false)
    }, [])

    const register = async (name, email, password) => {
        try {
            const response = await fetch(`${API_URL}/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al registrar usuario.');
            }
            
            // Auto login después del registro
            return await login(email, password);
        } catch (error) {
            throw error;
        }
    }

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensaje || 'Credenciales incorrectas. Verifica tu correo y contraseña.');
            }

            setUser(data.usuario);
            localStorage.setItem('forkreview_user', JSON.stringify(data.usuario));
            return data.usuario;
        } catch (error) {
            throw error;
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('forkreview_user')
    }

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
