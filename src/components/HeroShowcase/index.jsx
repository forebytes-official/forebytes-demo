import { useEffect, useRef, useState } from 'react';
import './HeroShowcase.css';

const ROTATION_DEG_PER_SEC = 32;
const SPINS_BEFORE_SWITCH  = 2;
const FADE_MS               = 450;
const SPIN_MS = (360 / ROTATION_DEG_PER_SEC) * SPINS_BEFORE_SWITCH * 1000;

// Cycles the hero background through every AR-enabled dish's real 3D model —
// each one spins twice, fades out, and the next takes over. Only one model is
// ever mounted at a time (these files run several MB each), and the whole
// thing steps aside for a static photo when there's nothing to show or the
// user has asked for reduced motion.
export default function HeroShowcase({ dishes, fallbackImage }) {
  const containerRef = useRef(null);
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const showFallback = dishes.length === 0 || prefersReducedMotion;

  useEffect(() => {
    if (showFallback) return;
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement('script');
      script.type  = 'module';
      script.src   = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      document.head.appendChild(script);
    }
  }, [showFallback]);

  useEffect(() => {
    if (showFallback) return;
    const dish = dishes[index % dishes.length];
    const container = containerRef.current;
    if (!container || !dish) return;

    const mv = document.createElement('model-viewer');
    mv.setAttribute('src', dish.model);
    mv.setAttribute('alt', `3D preview of ${dish.name}`);
    mv.setAttribute('auto-rotate', '');
    mv.setAttribute('auto-rotate-delay', '0');
    mv.setAttribute('rotation-per-second', `${ROTATION_DEG_PER_SEC}deg`);
    mv.setAttribute('disable-zoom', '');
    mv.setAttribute('interaction-prompt', 'none');
    mv.setAttribute('shadow-intensity', '0.7');
    mv.setAttribute('exposure', '1');
    if (dish.scale) mv.setAttribute('scale', dish.scale);
    mv.className = 'hero-showcase-model';
    mv.style.pointerEvents = 'none'; // decorative — never intercepts taps on the hero controls above it

    container.appendChild(mv);
    requestAnimationFrame(() => mv.classList.add('visible'));

    const switchTimer = setTimeout(() => {
      mv.classList.remove('visible');
      setTimeout(() => setIndex(prev => (prev + 1) % dishes.length), FADE_MS);
    }, SPIN_MS);

    return () => {
      clearTimeout(switchTimer);
      if (container.contains(mv)) container.removeChild(mv);
    };
  }, [index, dishes, showFallback]);

  if (showFallback) {
    return (
      <img
        src={fallbackImage}
        alt=""
        className="hero-image"
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
    );
  }

  return <div ref={containerRef} className="hero-showcase" />;
}
