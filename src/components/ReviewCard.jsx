import { useState } from 'react'

function Stars({ rating, onClick }) {
    const [hover, setHover] = useState(0)

    if (onClick) {
        return (
            <div className="star-picker">
                {[1, 2, 3, 4, 5].map(n => (
                    <span
                        key={n}
                        className={`star ${n <= (hover || rating) ? 'filled' : ''}`}
                        onClick={() => onClick(n)}
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                    >★</span>
                ))}
            </div>
        )
    }

    return (
        <div className="stars">
            {[1, 2, 3, 4, 5].map(n => (
                <span key={n} className={`star ${n <= rating ? 'filled' : ''}`}>★</span>
            ))}
        </div>
    )
}

export default function ReviewCard({ review }) {
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(review.likes)

    const handleLike = (e) => {
        e.stopPropagation()
        if (!liked) {
            setLikes(l => l + 1)
            setLiked(true)
        } else {
            setLikes(l => l - 1)
            setLiked(false)
        }
    }

    return (
        <article className="review-card anim-fade-up">
            <div className="card-image">
                <img src={review.image} alt={review.restaurant} loading="lazy" />
                <span className="card-badge">{review.category}</span>
                <div className="card-rating-badge">{review.rating}.0</div>
            </div>

            <div className="card-body">
                <h3 className="card-restaurant">{review.restaurant}</h3>
                <p className="card-location">
                    <span>📍</span> {review.location}
                </p>

                <Stars rating={review.rating} />

                <p className="card-review-text" style={{ marginTop: '12px' }}>
                    "{review.text}"
                </p>

                <div className="card-footer">
                    <div className="card-author">
                        <div className="avatar" style={{ width: 30, height: 30, fontSize: '0.75rem' }}>
                            {review.authorInitial}
                        </div>
                        <div>
                            <div className="card-author-name">{review.author}</div>
                            <div className="card-author-date">{review.date}</div>
                        </div>
                    </div>

                    <button
                        className="card-likes"
                        onClick={handleLike}
                        style={{
                            background: 'none',
                            color: liked ? 'var(--clr-primary)' : undefined,
                            fontFamily: 'var(--font-body)',
                        }}
                        title="Me gusta"
                    >
                        {liked ? '❤️' : '🤍'} {likes}
                    </button>
                </div>
            </div>
        </article>
    )
}

export { Stars }
