import { useEffect, useRef, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import './DishDetailPage.css';

const ALLERGEN_NAMES = {
  1: 'Gluten', 2: 'Crustaceans', 3: 'Eggs', 4: 'Fish', 5: 'Peanuts',
  6: 'Soy', 7: 'Dairy', 8: 'Nuts', 9: 'Celery', 10: 'Mustard',
  11: 'Sesame', 12: 'Sulphites', 13: 'Lupin', 14: 'Molluscs',
};

const CubeIcon = ({ size = 18, stroke = '#fff', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <path d="M12 2v15M3 7l9 5 9-5"         stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round"/>
  </svg>
);

const BackIcon = ({ stroke = '#fff' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3L2 20h20L12 3z" stroke="#C8860A" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M12 10v4M12 17h.01" stroke="#C8860A" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const FULL_OFFSET = 0;
const TAP_THRESHOLD = 6;

// Auto-rotating showcase of the real 3D model, doubling as the AR launch
// point — carries ar/ar-modes so the CTA button below can call
// activateAR() on it directly instead of navigating to a second page that
// just shows the same model again. camera-controls is intentionally omitted
// so manual rotation doesn't fight the sheet's own drag gesture; the
// standalone interactive viewer still lives at /view/:dishKey for anyone who
// wants to inspect the model before deciding to go into AR.
function HeroModel({ dish, onError, onReady }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement('script');
      script.type  = 'module';
      script.src   = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      document.head.appendChild(script);
    }

    const mv = document.createElement('model-viewer');
    mv.setAttribute('src',                 dish.model);
    mv.setAttribute('alt',                 `3D preview of ${dish.name}`);
    mv.setAttribute('auto-rotate',         '');
    mv.setAttribute('auto-rotate-delay',   '0');
    mv.setAttribute('rotation-per-second', '30deg');
    mv.setAttribute('disable-zoom',        '');
    mv.setAttribute('ar',                  '');
    mv.setAttribute('ar-modes',            'quick-look scene-viewer webxr');
    mv.setAttribute('shadow-intensity',    '1');
    mv.setAttribute('exposure',            '1');
    if (dish.scale) mv.setAttribute('scale', dish.scale);
    mv.className = 'dish-detail-hero-model';
    mv.addEventListener('error', onError);
    mv.addEventListener('load', () => onReady?.(mv));

    containerRef.current.appendChild(mv);
    return () => {
      if (containerRef.current?.contains(mv)) containerRef.current.removeChild(mv);
    };
  }, [dish]);

  return <div ref={containerRef} className="dish-detail-hero-model-container" />;
}

// Shared content blocks — identical whether the dish has AR/a photo or not.
function DishInfoSections({ dish, hasAllergens }) {
  return (
    <>
      <div className="dish-detail-section">
        <p className="dish-detail-desc">{dish.description}</p>
        {dish.portion && (
          <div className="dish-detail-box">
            <span className="dish-detail-box-label">Portion Size</span>
            <p>{dish.portion}</p>
          </div>
        )}
        {dish.chefNote && (
          <div className="dish-detail-chef-note">
            <p>{dish.chefNote}</p>
          </div>
        )}
      </div>

      <div className="dish-detail-section">
        <p className="dish-detail-section-heading">Ingredients</p>
        <p className="dish-detail-ingredients-text">
          {dish.ingredients || 'Ingredient information is not available for this dish yet.'}
        </p>
      </div>

      <div className="dish-detail-section">
        <p className="dish-detail-section-heading">Allergens</p>
        {hasAllergens ? (
          <>
            <div className="dish-detail-allergen-warning">
              <WarningIcon />
              <span>Contains the following allergens</span>
            </div>
            <div className="dish-detail-allergen-chips">
              {dish.allergens.map((num, i) => (
                <div
                  key={num}
                  className="dish-detail-allergen-chip fade-rise-in"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <span className="dish-detail-allergen-num">{num}</span>
                  {ALLERGEN_NAMES[num] ?? 'Unknown'}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="dish-detail-no-allergens">No allergen information available for this dish yet.</p>
        )}
      </div>
    </>
  );
}

function DishTitleBlock({ dish }) {
  return (
    <>
      {dish.category && <p className="dish-detail-category">{dish.category}</p>}
      <div className="dish-detail-title-row">
        <h1 className="dish-detail-name">{dish.name}</h1>
        <span className="dish-detail-price">{dish.price}</span>
      </div>
      {dish.tags?.length > 0 && (
        <div className="dish-detail-tags" aria-label="Dish attributes">
          {dish.tags.map(tag => (
            <span key={tag} className="dish-detail-tag">{tag}</span>
          ))}
        </div>
      )}
    </>
  );
}

// No photo and no 3D model — a plain scrolling page instead of forcing the
// dish into a "peek behind a fixed hero" layout built for visual content.
function SimpleDetailPage({ dish, hasAllergens }) {
  return (
    <div className="dish-detail-simple">
      <div className="dish-detail-simple-banner" style={{ background: dish.placeholder.gradient }}>
        <Link to="/menu" className="dish-detail-back" aria-label="Back to menu">
          <BackIcon />
        </Link>
        {dish.badge && <span className="dish-detail-badge dish-detail-badge--inline">{dish.badge}</span>}
      </div>

      <div className="dish-detail-simple-body">
        <DishTitleBlock dish={dish} />
        <div className="dish-detail-simple-scroll">
          <DishInfoSections dish={dish} hasAllergens={hasAllergens} />
        </div>
      </div>
    </div>
  );
}

export default function DishDetailPage({ restaurant }) {
  const { dishKey } = useParams();
  const dish = restaurant.dishes.find(d => d.key === dishKey);
  const [modelFailed, setModelFailed] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [arUnsupported, setArUnsupported] = useState(false);
  const heroModelRef = useRef(null);

  // model-viewer/the fallback photo auto-centers within the full-height hero
  // container, not around wherever the sheet happens to end — so the peek
  // needs to reveal enough of that container for the dish's center to clear
  // the sheet's edge, or most of it sits hidden behind the sheet at rest.
  const peekOffsetRef = useRef(typeof window !== 'undefined' ? window.innerHeight * 0.56 : 380);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Sheet starts off-screen and slides up to its resting "peek" position on mount —
  // matches the native bottom-sheet feel the drag gesture already implies.
  const [offset, setOffset] = useState(() => (
    prefersReducedMotion || typeof window === 'undefined'
      ? peekOffsetRef.current
      : window.innerHeight
  ));
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ y: 0, offset: 0 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    // A single rAF can still fire before the browser paints the initial
    // off-screen position, so the transition has nothing to animate from —
    // nest a second rAF to guarantee that paint happens first.
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setOffset(peekOffsetRef.current));
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = e => {
      const dy = e.clientY - dragStart.current.y;
      const next = Math.max(FULL_OFFSET, Math.min(dragStart.current.offset + dy, peekOffsetRef.current));
      setOffset(next);
    };

    const handleUp = e => {
      const traveled = Math.abs(e.clientY - dragStart.current.y);
      setOffset(prev => {
        if (traveled < TAP_THRESHOLD) {
          // Treated as a tap on the handle — toggle instead of snapping back.
          return dragStart.current.offset > peekOffsetRef.current / 2 ? FULL_OFFSET : peekOffsetRef.current;
        }
        return prev > peekOffsetRef.current / 2 ? peekOffsetRef.current : FULL_OFFSET;
      });
      setDragging(false);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [dragging]);

  useEffect(() => {
    setModelFailed(false);
    setModelReady(false);
    setArUnsupported(false);
    heroModelRef.current = null;
  }, [dishKey]);

  if (!dish) return <Navigate to="/menu" replace />;

  const hasAllergens  = Array.isArray(dish.allergens) && dish.allergens.length > 0;
  const showHeroModel = Boolean(dish.model) && !modelFailed;
  const hasVisual      = Boolean(dish.model) || Boolean(dish.image);

  const handleHeroModelReady = mv => {
    heroModelRef.current = mv;
    setModelReady(true);
  };

  const handleVisualise = () => {
    if (heroModelRef.current?.canActivateAR) {
      heroModelRef.current.activateAR();
    } else {
      setArUnsupported(true);
    }
  };

  // Dish has neither a 3D model nor a photo — skip the immersive fixed-hero
  // treatment entirely rather than filling the empty space with a giant emoji.
  if (!hasVisual) {
    return <SimpleDetailPage dish={dish} hasAllergens={hasAllergens} />;
  }

  const handlePointerDown = e => {
    dragStart.current = { y: e.clientY, offset };
    setDragging(true);
  };

  return (
    <div className="dish-detail-page">
      <div className="dish-detail-hero">
        {showHeroModel ? (
          <HeroModel dish={dish} onError={() => setModelFailed(true)} onReady={handleHeroModelReady} />
        ) : (
          <div className="dish-detail-hero-visual" style={{ background: dish.placeholder.gradient }}>
            <img
              src={dish.image}
              alt={dish.name}
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}

        <Link to="/menu" className="dish-detail-back" aria-label="Back to menu">
          <BackIcon />
        </Link>

        {dish.badge && <span className="dish-detail-badge">{dish.badge}</span>}

        {dish.model && (
          <Link to={`/view/${dish.key}`} className="dish-detail-ar-ready glow-pulse" aria-label="Open AR view">
            <CubeIcon size={12} />
            AR Ready
          </Link>
        )}
      </div>

      <div
        className={`dish-detail-panel ${dragging ? 'dragging' : ''}`}
        style={{ transform: `translate(-50%, ${offset}px)` }}
      >
        <div
          className="dish-detail-panel-header"
          onPointerDown={handlePointerDown}
        >
          <div className="dish-detail-handle" aria-hidden="true" />
          <DishTitleBlock dish={dish} />
        </div>

        <div className="dish-detail-panel-scroll">
          <DishInfoSections dish={dish} hasAllergens={hasAllergens} />
          <div className="dish-detail-scroll-spacer" aria-hidden="true" />
        </div>
      </div>

      {dish.model && (
        <div className="dish-detail-cta-bar">
          <button
            type="button"
            className="dish-detail-ar-btn"
            onClick={handleVisualise}
            disabled={!modelReady}
          >
            <CubeIcon />
            {modelReady ? 'Visualise on your table' : 'Preparing 3D model…'}
          </button>
          {arUnsupported ? (
            <p className="dish-detail-ar-unsupported">AR requires Safari on iPhone or Chrome on Android.</p>
          ) : (
            <p className="dish-detail-ar-hint">Point your camera at the table and tap Place</p>
          )}
        </div>
      )}
    </div>
  );
}
