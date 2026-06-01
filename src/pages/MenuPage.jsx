import { MenuHeader } from '../components/Header';
import DishCard from '../components/DishCard';
import Footer from '../components/Footer';
import './MenuPage.css';

export default function MenuPage({ restaurant }) {
  return (
    <div className="menu-page">
      <MenuHeader restaurant={restaurant} />

      <section className="hero">
        <div className="hero-eyebrow">{restaurant.eyebrow}</div>
        <h1>Taste it before<br />you <em>order it</em></h1>
        <p>Tap <strong>Visualise in AR</strong> on any dish to see it at real scale — right on your table.</p>
      </section>

      <div className="divider" aria-hidden="true">
        <div className="divider-line" />
        <div className="divider-icon">✦</div>
        <div className="divider-line" />
      </div>

      <section>
        <div className="menu-section">
          <h2>Today's Menu</h2>
          <p>Tap any dish to see it in augmented reality</p>
        </div>
        <div className="menu-list" role="list">
          {restaurant.dishes.map(dish => (
            <DishCard key={dish.key} dish={dish} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
