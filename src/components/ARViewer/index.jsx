import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ViewerHeader } from '../Header';
import './ARViewer.css';

const POSTER_SVG = `
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#0EA5E9" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M12 2v15M3 7l9 5 9-5"         stroke="#0EA5E9" stroke-width="1.5" stroke-linejoin="round"/>
  </svg>
`;

export default function ARViewer({ dish }) {
  const containerRef  = useRef(null);
  const viewerRef     = useRef(null);
  const [hasError,      setHasError]      = useState(false);
  const [arUnsupported, setArUnsupported] = useState(false);

  useEffect(() => {
    if (!dish) { setHasError(true); return; }

    // Load model-viewer script once
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script    = document.createElement('script');
      script.type     = 'module';
      script.src      = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      document.head.appendChild(script);
    }

    // Build the model-viewer element via DOM to avoid React/JSX custom-element conflicts
    const mv = document.createElement('model-viewer');
    mv.setAttribute('src',                dish.model);
    mv.setAttribute('alt',                `3D model of ${dish.name}`);
    mv.setAttribute('ar',                 '');
    mv.setAttribute('ar-modes',           'quick-look scene-viewer webxr');
    mv.setAttribute('camera-controls',    '');
    mv.setAttribute('auto-rotate',        '');
    mv.setAttribute('auto-rotate-delay',  '1000');
    mv.setAttribute('rotation-per-second','20deg');
    mv.setAttribute('shadow-intensity',   '1');
    mv.setAttribute('exposure',           '1');
    mv.className = 'model-viewer-el';

    const poster = document.createElement('div');
    poster.slot      = 'poster';
    poster.className = 'poster-slot';
    poster.innerHTML = POSTER_SVG;
    mv.appendChild(poster);

    mv.addEventListener('error', () => setHasError(true));

    containerRef.current.appendChild(mv);
    viewerRef.current = mv;

    return () => {
      if (containerRef.current?.contains(mv)) containerRef.current.removeChild(mv);
    };
  }, [dish]);

  const handleAR = () => {
    if (viewerRef.current?.canActivateAR) {
      viewerRef.current.activateAR();
    } else {
      setArUnsupported(true);
    }
  };

  if (hasError) {
    return (
      <div className="viewer-page viewer-page--dark">
        <ViewerHeader dishName="" />
        <div className="error-screen">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#C8860A" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M12 2v15M3 7l9 5 9-5"         stroke="#C8860A" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          <h2>Model not ready yet</h2>
          <p>The 3D model for this dish is still being prepared. Check back soon!</p>
          <Link to="/menu">← Back to menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="viewer-page viewer-page--dark">
      <ViewerHeader dishName={dish?.name ?? ''} />
      <div ref={containerRef} className="viewer-container" />
      <div className="controls">
        <p className="controls-dish-name">{dish?.name}</p>
        <p className="controls-hint">Rotate · Pinch to zoom</p>
        {arUnsupported && (
          <p className="ar-unsupported">AR requires Safari on iPhone or Chrome on Android.</p>
        )}
        <button className="btn-ar" onClick={handleAR} aria-label="View dish in augmented reality">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2"  y="3"  width="8" height="8" rx="1" stroke="#fff" strokeWidth="1.8"/>
            <rect x="14" y="3"  width="8" height="8" rx="1" stroke="#fff" strokeWidth="1.8"/>
            <rect x="2"  y="13" width="8" height="8" rx="1" stroke="#fff" strokeWidth="1.8"/>
            <rect x="14" y="13" width="8" height="8" rx="1" stroke="#fff" strokeWidth="1.8"/>
          </svg>
          View on Your Table
        </button>
      </div>
    </div>
  );
}
