import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ReviewCard from '../components/ReviewCard'
import AddReviewModal from '../components/AddReviewModal'
import { CATEGORIES } from '../data/reviews'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config'

export default function HomePage() {
    const { user } = useAuth()
    const [reviews, setReviews] = useState([])
    const [filter, setFilter] = useState('Todas')
    const [showModal, setShowModal] = useState(false)
    const [toast, setToast] = useState('')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_URL}/resenas`)
            const data = await res.json()
            setReviews(data)
        } catch (error) {
            console.error("Error fetching reviews:", error)
            showToast('Error al cargar las reseñas')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    const showToast = (msg) => {
        setToast(msg)
        setTimeout(() => setToast(''), 3000)
    }

    const handleAddReview = async (review) => {
        try {
            // 1. Crear restaurante primero
            const resRest = await fetch(`${API_URL}/restaurantes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: review.restaurant,
                    location: review.location,
                    category: review.category,
                    image: review.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80'
                })
            })
            const dataRest = await resRest.json()
            if (!resRest.ok) throw new Error(dataRest.mensaje)

            // 2. Crear reseña vinculada al restaurante
            const resRev = await fetch(`${API_URL}/resenas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    restaurant_id: dataRest.id,
                    rating: review.rating,
                    text: review.text,
                    image: review.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
                    author: user.name,
                    author_initial: user.name.charAt(0).toUpperCase(),
                    date: review.date,
                    likes: 0,
                    category: review.category
                })
            })
            const dataRev = await resRev.json()
            if (!resRev.ok) throw new Error(dataRev.mensaje)

            showToast('¡Reseña publicada con éxito! 🎉')
            fetchReviews() // Recargar para ver la nueva reseña
        } catch (error) {
            console.error(error)
            showToast('Error al publicar la reseña')
        }
    }

    const filtered = reviews.filter(r => {
        const matchCat = filter === 'Todas' || r.category === filter
        const matchSearch = search === '' ||
            r.restaurant.toLowerCase().includes(search.toLowerCase()) ||
            r.location.toLowerCase().includes(search.toLowerCase()) ||
            r.category.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)

    return (
        <>
            <Navbar />

            {/* Hero */}
            <section className="hero">
                <div className="hero-bg" />
                <div className="hero-content">
                    <div className="hero-badge anim-fade-up">
                        <span>⭐</span> Plataforma #1 de reseñas gastronómicas
                    </div>

                    <h1 className="hero-title anim-fade-up" style={{ animationDelay: '0.1s' }}>
                        Descubre los{' '}
                        <span className="gradient-text">mejores sabores</span>
                        {' '}del mundo
                    </h1>

                    <p className="hero-subtitle anim-fade-up" style={{ animationDelay: '0.2s' }}>
                        Reseñas auténticas escritas por personas reales. Encuentra tu próximo
                        restaurante favorito o comparte tu experiencia.
                    </p>

                    <div className="hero-cta anim-fade-up" style={{ animationDelay: '0.3s' }}>
                        {/* Search */}
                        <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
                            <input
                                id="inp-search"
                                className="form-input"
                                type="text"
                                placeholder="🔍 Buscar restaurante o cocina..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ width: '100%', paddingLeft: 20, borderRadius: 'var(--radius-lg)' }}
                            />
                        </div>
                        <button
                            id="btn-write-review-hero"
                            className="btn-primary"
                            onClick={() => setShowModal(true)}
                        >
                            ✍️ Escribir reseña
                        </button>
                    </div>

                    <div className="hero-stats anim-fade-in" style={{ animationDelay: '0.5s' }}>
                        <div className="stat-item">
                            <div className="stat-number">{reviews.length}+</div>
                            <div className="stat-label">Reseñas publicadas</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">{avgRating}</div>
                            <div className="stat-label">Calificación promedio</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">12+</div>
                            <div className="stat-label">Países representados</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">3.2K</div>
                            <div className="stat-label">Usuarios activos</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <main className="reviews-section">
                <div className="section-header">
                    <p className="section-tag">🍽️ Reseñas de la comunidad</p>
                    <h2 className="section-title">
                        Experiencias{' '}
                        <span className="gradient-text">auténticas</span>
                    </h2>
                    <p className="section-sub">
                        {filtered.length} reseña{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
                        {filter !== 'Todas' ? ` en "${filter}"` : ''}
                    </p>
                </div>

                {/* Filter chips */}
                <div className="filter-bar" role="group" aria-label="Filtros de categoría">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            id={`filter-${cat.toLowerCase()}`}
                            className={`filter-chip ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--clr-muted)' }}>
                        <p>Cargando reseñas...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="reviews-grid">
                        {filtered.map(r => <ReviewCard key={r.id} review={r} />)}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--clr-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🍽️</div>
                        <p style={{ fontSize: '1.1rem' }}>
                            No se encontraron reseñas para{' '}
                            <strong style={{ color: 'var(--clr-text)' }}>"{search || filter}"</strong>
                        </p>
                        <p style={{ marginTop: 8, fontSize: '0.9rem' }}>¡Sé el primero en agregar una!</p>
                    </div>
                )}
            </main>

            {/* FAB */}
            <button
                id="btn-fab-add-review"
                className="fab"
                onClick={() => setShowModal(true)}
                title="Agregar reseña"
                aria-label="Agregar reseña"
            >
                +
            </button>

            {/* Modal */}
            {showModal && (
                <AddReviewModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAddReview}
                />
            )}

            {/* Toast */}
            {toast && <div className="toast">{toast}</div>}

            {/* Footer */}
            <footer className="footer">
                <p>
                    🍴 <strong>ForkReview</strong> — Hecho con ❤️ para amantes de la gastronomía.
                    Bienvenido, <strong>{user?.name}</strong>.
                </p>
            </footer>
        </>
    )
}
