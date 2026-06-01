import { Link } from 'react-router-dom';
import './Header.css';

const CubeIcon = ({ size = 14, stroke = '#0EA5E9', strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <path d="M12 2v15M3 7l9 5 9-5"         stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round"/>
  </svg>
);

export function MenuHeader({ restaurant }) {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-name">{restaurant.name}</span>
        <span className="logo-sub">{restaurant.tagline}</span>
      </div>
      <div className="forebytes-badge" aria-label="Powered by Forebytes AR">
        <CubeIcon />
        <span>AR Menu</span>
      </div>
    </header>
  );
}

export function ViewerHeader({ dishName }) {
  return (
    <header className="header">
      <Link to="/menu" className="back-btn" aria-label="Back to menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Menu
      </Link>
      <span className="header-dish-name">{dishName}</span>
      <span className="header-ar-label">AR</span>
    </header>
  );
}
