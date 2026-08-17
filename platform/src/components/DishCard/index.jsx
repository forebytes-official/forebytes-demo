import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './DishCard.css';

const CubeIcon = ({ size = 8, stroke = '#fff', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <path d="M12 2v15M3 7l9 5 9-5"         stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round"/>
  </svg>
);

export default function DishCard({ dish }) {
  const cardRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Link ref={cardRef} to={`/dish/${dish.key}`} className={`dish-card ${inView ? 'in-view' : ''}`}>
      <div className="dish-image">
        <div
          className="dish-image-bg"
          style={{ background: dish.placeholder.gradient }}
          aria-hidden="true"
        >
          {dish.placeholder.emoji}
        </div>
        {dish.image && (
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            className={imgLoaded ? 'loaded' : ''}
            onLoad={() => setImgLoaded(true)}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {dish.model && (
          <span className="ar-badge glow-pulse" aria-label="AR available">
            <CubeIcon />
            AR
          </span>
        )}
        {dish.badge && <span className="dish-card-badge">{dish.badge}</span>}
      </div>

      <div className="dish-body">
        <p className="dish-name">{dish.name}</p>
        <span className="dish-price">{dish.price}</span>
      </div>
    </Link>
  );
}
