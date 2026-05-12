import { useState } from 'react'
import { Stars } from './ReviewCard'
import { CATEGORIES } from '../data/reviews'

const CATEGORY_LIST = CATEGORIES.filter(c => c !== 'Todas')

export default function AddReviewModal({ onClose, onSubmit }) {
    const [form, setForm] = useState({
        restaurant: '',
        location: '',
        category: CATEGORY_LIST[0],
        rating: 0,
        text: '',
    })
    const [error, setError] = useState('')

    const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.restaurant.trim()) return setError('Ingresa el nombre del restaurante.')
        if (!form.location.trim()) return setError('Ingresa la ubicación.')
        if (form.rating === 0) return setError('Selecciona una calificación.')
        if (form.text.trim().length < 20) return setError('La reseña debe tener al menos 20 caracteres.')
        setError('')
        onSubmit({
            ...form,
            id: Date.now(),
            author: 'Tú',
            authorInitial: '✏',
            date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
            likes: 0,
            image: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80`,
        })
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div className="modal-header">
                    <h2 className="modal-title" id="modal-title">✍️ Nueva Reseña</h2>
                    <p className="modal-sub">Comparte tu experiencia gastronómica con la comunidad.</p>
                </div>

                <form className="modal-form" onSubmit={handleSubmit} id="form-add-review">
                    {error && <div className="alert-msg alert-error">{error}</div>}

                    <div className="form-group">
                        <label className="form-label" htmlFor="inp-restaurant">Restaurante</label>
                        <input
                            id="inp-restaurant"
                            className="form-input"
                            type="text"
                            placeholder="Ej. La Casa del Chef"
                            value={form.restaurant}
                            onChange={e => set('restaurant', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="inp-location">Ubicación</label>
                        <input
                            id="inp-location"
                            className="form-input"
                            type="text"
                            placeholder="Ej. Madrid, España"
                            value={form.location}
                            onChange={e => set('location', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="sel-category">Categoría</label>
                        <select
                            id="sel-category"
                            className="form-input"
                            value={form.category}
                            onChange={e => set('category', e.target.value)}
                            style={{ appearance: 'auto' }}
                        >
                            {CATEGORY_LIST.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Calificación</label>
                        <Stars rating={form.rating} onClick={r => set('rating', r)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="inp-review">Tu reseña</label>
                        <textarea
                            id="inp-review"
                            className="form-input"
                            rows={4}
                            placeholder="Describe tu experiencia..."
                            value={form.text}
                            onChange={e => set('text', e.target.value)}
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <button type="submit" className="btn-primary" id="btn-submit-review" style={{ width: '100%', padding: '14px' }}>
                        🍽️ Publicar reseña
                    </button>
                </form>

                <div className="modal-footer">
                    <a href="#" onClick={e => { e.preventDefault(); onClose() }}>Cancelar</a>
                </div>
            </div>
        </div>
    )
}
