import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MenuHeader } from '../components/Header';
import DishListItem from '../components/DishListItem';
import HeroShowcase from '../components/HeroShowcase';
import Footer from '../components/Footer';
import './MenuPage.css';

const ChevronDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 9l6 6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CubeIcon = ({ size = 14, stroke = 'currentColor', strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <path d="M12 2v15M3 7l9 5 9-5"         stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round"/>
  </svg>
);

export default function MenuPage({ restaurant }) {
  const dishes     = restaurant.dishes;
  const categories = restaurant.categories ?? [];

  const [activeCategory, setActiveCategory] = useState('All');

  const heroRef        = useRef(null);
  const headerWrapRef   = useRef(null);
  const topRef            = useRef(null);
  const arSectionRef        = useRef(null);
  const sectionRefs           = useRef({});
  const pillRefs                = useRef({});

  const pillCounts = useMemo(() => {
    const counts = { All: dishes.length };
    categories.forEach(cat => {
      counts[cat] = dishes.filter(d => d.category === cat).length;
    });
    return counts;
  }, [dishes, categories]);

  // Every dish, grouped by category — pills jump to a section, they never hide dishes.
  const groupedDishes = useMemo(() => {
    const groups = [];
    const seen   = new Set();
    categories.forEach(cat => {
      const inCat = dishes.filter(d => d.category === cat);
      if (inCat.length) { groups.push([cat, inCat]); seen.add(cat); }
    });
    const rest = dishes.filter(d => !seen.has(d.category));
    if (rest.length) groups.push([null, rest]);
    return groups;
  }, [dishes, categories]);

  // Dishes with a real 3D model get a dedicated cross-category showcase (in
  // addition to appearing in their normal category below) — empty and hidden
  // until at least one dish actually has AR, so it never shows a broken/empty state.
  const arDishes = useMemo(() => dishes.filter(d => d.model), [dishes]);

  // Pill clicks pin activeCategory until the user actually scrolls by hand — with a
  // short menu, a clicked category's section may never be able to sit flush against
  // the header (there isn't enough page left to scroll), so geometric scroll-spy
  // alone can't reliably confirm the click. See the scroll-spy effect below.
  const pinnedRef = useRef(false);

  const goToCategory = cat => {
    pinnedRef.current = true;
    setActiveCategory(cat);
    const target = cat === 'All' ? topRef.current : cat === 'AR' ? arSectionRef.current : sectionRefs.current[cat];
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Reveal the compact header only once the hero has scrolled past — keeps the
  // hero full-bleed on landing instead of competing with a bar above it.
  const [headerVisible, setHeaderVisible] = useState(false);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeaderVisible(!entry.isIntersecting)
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const [headerHeight, setHeaderHeight] = useState(0);
  useLayoutEffect(() => {
    const measure = () => setHeaderHeight(headerWrapRef.current?.offsetHeight || 0);
    measure();
    const ro = new ResizeObserver(measure);
    if (headerWrapRef.current) ro.observe(headerWrapRef.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  // Scroll-spy: keep the pill highlight honest when the user scrolls by hand
  // instead of tapping a pill. Offset against the fixed header's height since
  // it overlaps the top of the viewport once revealed.
  useEffect(() => {
    if (categories.length === 0) return;

    const release = () => { pinnedRef.current = false; };
    window.addEventListener('wheel', release, { passive: true });
    window.addEventListener('touchmove', release, { passive: true });

    let frame = null;
    const onScroll = () => {
      if (pinnedRef.current) return;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        // Sections carry `scrollMarginTop: headerHeight + 8`, so a section that's
        // just been scrolled to sits ~8px below the header line, not flush — allow
        // a generous buffer rather than requiring an exact pixel match.
        let current = 'All';
        if (arSectionRef.current && arSectionRef.current.getBoundingClientRect().top - headerHeight <= 16) {
          current = 'AR';
        }
        for (const cat of categories) {
          const el = sectionRefs.current[cat];
          if (!el) continue;
          if (el.getBoundingClientRect().top - headerHeight <= 16) current = cat;
        }
        setActiveCategory(prev => (prev === current ? prev : current));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', release);
      window.removeEventListener('touchmove', release);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [categories, headerHeight]);

  // Center the active pill within its own horizontal-scroll row only — never touch
  // vertical scroll here, since that's already being driven by goToCategory below
  // and scrollIntoView's block:'nearest' would otherwise fight it mid-animation.
  useEffect(() => {
    const pill = pillRefs.current[activeCategory];
    const container = pill?.parentElement;
    if (!pill || !container) return;
    const pillLeft  = pill.offsetLeft;
    const pillRight = pillLeft + pill.offsetWidth;
    const viewLeft  = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;
    if (pillLeft < viewLeft) {
      container.scrollTo({ left: pillLeft - 20, behavior: 'smooth' });
    } else if (pillRight > viewRight) {
      container.scrollTo({ left: pillRight - container.clientWidth + 20, behavior: 'smooth' });
    }
  }, [activeCategory]);

  const scrollPastHero = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="menu-page">
      <div ref={headerWrapRef} className={`sticky-header ${headerVisible ? 'visible' : ''}`}>
        <MenuHeader restaurant={restaurant} />
      </div>

      <section ref={heroRef} className="hero">
        <div className="hero-media">
          <HeroShowcase dishes={arDishes} fallbackImage="/assets/images/jollof-rice-plantain.jpg" />
        </div>
        <div className="hero-overlay" />

        <div className="hero-top">
          <div className="hero-brand">
            <span className="hero-brand-name">{restaurant.name}</span>
          </div>
          <button type="button" className="hero-menu-btn" aria-label="Open menu" onClick={scrollPastHero}>
            <MenuIcon />
          </button>
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow fade-rise-in" style={{ animationDelay: '0.05s' }}>{restaurant.eyebrow}</div>
          <h1 className="fade-rise-in" style={{ animationDelay: '0.15s' }}>Welcome to<br /><em>{restaurant.name}</em></h1>
          <p className="fade-rise-in" style={{ animationDelay: '0.25s' }}>{restaurant.tagline}, made fresh every day.</p>
        </div>

        <button type="button" className="hero-scroll-cue" onClick={scrollPastHero}>
          <ChevronDownIcon />
          Scroll to explore
        </button>

        <svg className="hero-wave" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40V16C60 32 140 0 200 8C260 16 340 36 400 14V40Z" fill="var(--bg)" />
        </svg>
      </section>

      {(categories.length > 0 || arDishes.length > 0) && (
        <div className="category-pills" role="tablist" aria-label="Jump to category">
          <button
            ref={el => { pillRefs.current.All = el; }}
            type="button"
            role="tab"
            aria-selected={activeCategory === 'All'}
            className={`category-pill ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => goToCategory('All')}
          >
            All ({pillCounts.All})
          </button>
          {arDishes.length > 0 && (
            <button
              ref={el => { pillRefs.current.AR = el; }}
              type="button"
              role="tab"
              aria-selected={activeCategory === 'AR'}
              className={`category-pill category-pill--ar ${activeCategory === 'AR' ? 'active' : ''}`}
              onClick={() => goToCategory('AR')}
            >
              <CubeIcon stroke={activeCategory === 'AR' ? '#fff' : 'var(--ar-btn)'} />
              AR Dishes ({arDishes.length})
            </button>
          )}
          {categories.map(cat => (
            <button
              key={cat}
              ref={el => { pillRefs.current[cat] = el; }}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => goToCategory(cat)}
            >
              {cat} ({pillCounts[cat] ?? 0})
            </button>
          ))}
        </div>
      )}

      <section ref={topRef} style={{ scrollMarginTop: headerHeight + 8 }}>
        <div className="menu-section">
          <h2>Today's Menu</h2>
          <p>Tap any dish to see full details</p>
        </div>

        {arDishes.length > 0 && (
          <div
            ref={arSectionRef}
            className="menu-category-group ar-section"
            style={{ scrollMarginTop: headerHeight + 8 }}
          >
            <p className="menu-category-header ar-section-header">
              <CubeIcon stroke="var(--ar-btn)" />
              AR Dishes
            </p>
            <div className="dish-list-rows">
              {arDishes.map(dish => (
                <DishListItem key={dish.key} dish={dish} />
              ))}
            </div>
          </div>
        )}

        {groupedDishes.map(([cat, group]) => (
          <div
            key={cat ?? 'uncategorised'}
            className="menu-category-group"
            ref={el => { if (cat) sectionRefs.current[cat] = el; }}
            style={cat ? { scrollMarginTop: headerHeight + 8 } : undefined}
          >
            {cat && <p className="menu-category-header">{cat}</p>}
            <div className="dish-list-rows">
              {group.map(dish => (
                <DishListItem key={dish.key} dish={dish} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
