import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './DishListItem.css';

const CubeIcon = ({ size = 8, stroke = '#fff', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <path d="M12 2v15M3 7l9 5 9-5"         stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round"/>
  </svg>
);

export default function DishListItem({ dish }) {
  const itemRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = itemRef.current;
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
    <Link ref={itemRef} to={`/dish/${dish.key}`} className={`dish-list-item ${inView ? 'in-view' : ''}`}>
      <div className="dish-list-body">
        {dish.badge && <p className="dish-list-badge">{dish.badge}</p>}
        <p className="dish-list-name">{dish.name}</p>
        <p className="dish-list-desc">{dish.description}</p>
        {dish.tags?.length > 0 && (
          <div className="dish-list-tags" aria-label="Dish attributes">
            {dish.tags.map(tag => (
              <span key={tag} className="dish-list-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="dish-list-right">
        <span className="dish-list-price">{dish.price}</span>
        {dish.model && (
          <span className="dish-list-ar-badge glow-pulse" aria-label="AR available">
            <CubeIcon />
            AR
          </span>
        )}
      </div>
    </Link>
  );
}
