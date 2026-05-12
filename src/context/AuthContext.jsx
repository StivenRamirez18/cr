import { createContext, useContext, useState, useEffect } from 'react'

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

    const register = (name, email, password) => {
        const users = JSON.parse(localStorage.getItem('forkreview_users') || '[]')
        const exists = users.find(u => u.email === email)
        if (exists) throw new Error('Este correo ya está registrado.')
        const newUser = { id: Date.now(), name, email, password, joined: new Date().toISOString() }
        users.push(newUser)
        localStorage.setItem('forkreview_users', JSON.stringify(users))
        const { password: _, ...safe } = newUser
        setUser(safe)
        localStorage.setItem('forkreview_user', JSON.stringify(safe))
        return safe
    }

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('forkreview_users') || '[]')
        const found = users.find(u => u.email === email && u.password === password)
        if (!found) throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña.')
        const { password: _, ...safe } = found
        setUser(safe)
        localStorage.setItem('forkreview_user', JSON.stringify(safe))
        return safe
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
