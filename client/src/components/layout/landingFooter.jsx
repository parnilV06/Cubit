

import logoIcon from '../../assets/cubit-logo-icon-svg.svg'

export default function LandingFooter() {
  return (
    <footer className="landing-footer" id="landing-footer-section">
      <div className="footer-container">
        
        {/* Top Row: Brand on left, links grid on right */}
        <div className="footer-top-row">
          
          {/* Footer Brand Info Column */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <img src={logoIcon} alt="Cubit Logo" className="footer-logo-icon" />
              <span className="footer-logo-text">
                <span style={{ color: 'var(--brand-primary)' }}>C</span> U B I T
              </span>
            </div>
            <p className="footer-tagline">
              A fast, modern and open source <br />
              cubing platform for everyone. <br />
              Cube-it the modern way.
            </p>
          </div>

          {/* Footer Navigation & Social Columns */}
          <div className="footer-links-grid">
            
            {/* Column 1: LinkedIn */}
            <div className="footer-links-col">
              <div className="footer-social-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </div>
              <ul className="footer-links-list">
                <li>
                  <a href="#contact" className="footer-link">Contact Us</a>
                </li>
                <li>
                  <a href="#privacy" className="footer-link">Privacy Policy</a>
                </li>
              </ul>
            </div>

            {/* Column 2: GitHub */}
            <div className="footer-links-col">
              <div className="footer-social-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
              </div>
              <ul className="footer-links-list">
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                    Contribute on Github
                  </a>
                </li>
                <li>
                  <a href="#terms" className="footer-link">Terms of Use</a>
                </li>
              </ul>
            </div>

            {/* Column 3: Discord */}
            <div className="footer-links-col">
              <div className="footer-social-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.27 4.73a16.14 16.14 0 00-3.97-1.23.08.08 0 00-.08.04c-.17.3-.37.71-.5 1.02a14.9 14.9 0 00-5.44 0c-.13-.31-.34-.72-.51-1.02a.08.08 0 00-.08-.04 16.14 16.14 0 00-3.97 1.23.06.06 0 00-.03.03C1.65 9.17.9 13.48 1.4 17.74a.07.07 0 00.03.05 16.22 16.22 0 004.88 2.47.07.07 0 00.08-.02c.39-.53.73-1.11 1.02-1.72a.07.07 0 00-.04-.1 10.65 10.65 0 01-1.53-.73.08.08 0 01-.01-.13c.1-.07.2-.15.3-.23a.07.07 0 01.07-.01c3.2 1.47 6.67 1.47 9.8 0a.07.07 0 01.08.01c.1.08.2.16.3.23a.08.08 0 01-.01.13 10.65 10.65 0 01-1.53.73.07.07 0 00-.04.1c.29.61.63 1.19 1.02 1.72a.07.07 0 00.08.02 16.22 16.22 0 004.88-2.47.07.07 0 00.03-.05c.57-4.94-.96-9.21-3.66-12.98a.06.06 0 00-.03-.03zM8.2 14.28c-.96 0-1.75-.88-1.75-1.96s.76-1.96 1.75-1.96c.99 0 1.77.89 1.75 1.96 0 1.08-.76 1.96-1.75 1.96zm7.6 0c-.96 0-1.75-.88-1.75-1.96s.76-1.96 1.75-1.96c.99 0 1.77.89 1.75 1.96 0 1.08-.76 1.96-1.75 1.96z"/>
                </svg>
              </div>
              <ul className="footer-links-list">
                <li>
                  <a href="#support" className="footer-link">Support Us</a>
                </li>
                <li>
                  <a href="#license" className="footer-link">License</a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        <div className="footer-mid-divider"></div>

        {/* Bottom Row: Copyright left, Credits right */}
        <div className="footer-bottom-row">
          <p className="footer-copyright">© 2026 Cubit . All rights reserved</p>
          <p className="footer-credits">Made with 💜 by Parnil Vyawahare</p>
        </div>

      </div>
    </footer>
  )
}
