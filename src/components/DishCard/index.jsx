import { Link } from 'react-router-dom';
import './DishCard.css';

const CubeIcon = ({ size = 10, stroke = '#fff', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <path d="M12 2v15M3 7l9 5 9-5"         stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round"/>
  </svg>
);

export default function DishCard({ dish }) {
  return (
    <article className="dish-card">
      <div className="dish-image">
        <div
          className="dish-image-bg"
          style={{ background: dish.placeholder.gradient }}
          aria-hidden="true"
        >
          {dish.placeholder.emoji}
        </div>
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="ar-badge" aria-label="AR available">
          <CubeIcon />
          AR
        </div>
      </div>

      <div className="dish-body">
        <div className="dish-meta">
          <h3 className="dish-name">{dish.name}</h3>
          <span className="dish-price">{dish.price}</span>
        </div>
        <p className="dish-desc">{dish.description}</p>
        <div className="dish-tags" aria-label="Dish attributes">
          {dish.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <Link to={`/view/${dish.key}`} className="btn-visualise">
          <CubeIcon size={18} />
          Visualise in AR
        </Link>
      </div>
    </article>
  );
}
