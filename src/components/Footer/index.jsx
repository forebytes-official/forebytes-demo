import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-powered">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#0EA5E9" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M12 2v15M3 7l9 5 9-5"         stroke="#0EA5E9" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
        Powered by <strong>Forebytes</strong>
      </div>
      <p className="footer-note">Point your camera at the table and tap Place.</p>
    </footer>
  );
}
