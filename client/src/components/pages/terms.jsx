import { useEffect } from 'react';
import LandingNav from '../layout/landingNav.jsx';
import LandingFooter from '../layout/landingFooter.jsx';
import './landing.css';

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sectionStyle = {
    backgroundColor: 'var(--bg-secondary)',
    padding: '32px',
    borderRadius: '12px',
    border: '1px solid var(--border-primary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  };

  const headingStyle = {
    color: 'var(--brand-primary)',
    fontSize: '22px',
    fontWeight: '600',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '-0.01em',
  };

  const subheadingStyle = {
    color: 'var(--text-primary)',
    fontSize: '17px',
    fontWeight: '600',
    marginTop: '12px',
    marginBottom: '6px',
    fontFamily: 'var(--font-heading)',
  };

  const linkStyle = {
    color: 'var(--brand-primary)',
    textDecoration: 'none',
  };

  return (
    <div className="landing-page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="grid-bg-overlay"></div>
      <LandingNav />

      <main style={{ flex: 1, maxWidth: '960px', margin: '0 auto', padding: '60px 24px', position: 'relative', zIndex: 1, width: '100%' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '42px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
            Terms of Use
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Effective & Last Updated: August 4, 2026
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px' }}>
          
          {/* Section 1 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>1. Agreement & Acceptance</h2>
            <p>
              Welcome to Cubit. These Terms of Use (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;you&quot;) and Parnil Vyawahare (&quot;Operator&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), governing your access to and use of the Cubit web application, hosted services, community feeds, and leaderboards (collectively, the &quot;Service&quot;).
            </p>
            <p>
              By accessing, registering for, or using Cubit, you agree to be bound by these Terms and our{' '}
              <a href="/privacy" style={linkStyle}>Privacy Policy</a>. If you do not agree with these Terms, please do not access or use the Service.
            </p>
          </section>

          {/* Section 2 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>2. Description of Service & 100% Free Model</h2>
            <p>
              Cubit provides speedcubers worldwide with personal timing tools, WCA-style scramble generation, solve history logging, session statistics (Personal Bests, Means, Average of 5, Average of 12), Trainer learning modules, Focus Mode ambient audio, community interaction feeds, and global or friends leaderboards.
            </p>
            <p style={{ padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.08)', borderRadius: '8px', borderLeft: '4px solid var(--brand-primary)' }}>
              <strong>100% Free Platform:</strong> Cubit is completely free to use. There are no paid subscriptions, premium feature tiers, in-app purchases, billing cycles, or financial transactions processed through the Service.
            </p>
          </section>

          {/* Section 3 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>3. Eligibility & Age Consent</h2>
            <p>
              Cubit is a speedcubing platform intended for general audiences and is not directed at young children.
            </p>
            <p>
              Users below the age at which they can independently consent to personal data processing or enter binding agreements under applicable laws in their jurisdiction (such as under 13 in the United States under COPPA, 13–16 in EEA/UK jurisdictions under GDPR, or under 18 in India under the Digital Personal Data Protection Act) should use Cubit only with the involvement, supervision, or consent of a parent or legal guardian.
            </p>
          </section>

          {/* Section 4 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>4. Account Registration, Security & Deletion</h2>
            <h3 style={subheadingStyle}>Account Registration & Credentials</h3>
            <p>
              You may register for an account using an email address and password or via Google OAuth 2.0. You agree to provide accurate registration information and keep your account details up to date. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately at{' '}
              <a href="mailto:06v.parnil@gmail.com" style={linkStyle}>06v.parnil@gmail.com</a> if you suspect any unauthorized access to your account.
            </p>

            <h3 style={subheadingStyle}>Account & Data Deletion</h3>
            <p>
              You may delete individual solves, speedcubing sessions, session notes, community posts, comments, and friend connections directly within the application at any time. To request full deletion of your account and associated data, please submit an email request from your registered email address to{' '}
              <a href="mailto:06v.parnil@gmail.com" style={linkStyle}>06v.parnil@gmail.com</a>. Live application data will be erased upon processing. Data in infrastructure rolling backups is overwritten according to standard provider backup cycles.
            </p>
          </section>

          {/* Section 5 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>5. Acceptable Use Rules</h2>
            <p>You agree to use Cubit only for lawful and community-respectful purposes. You agree NOT to:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Unlawful & Abusive Conduct:</strong> Use the Service to violate any applicable local, national, or international law, or post content that is illegal, defamatory, harassing, abusive, threatening, or hateful.</li>
              <li><strong>Impersonation & Spam:</strong> Impersonate any person or entity, misrepresent your affiliation, or transmit unsolicited spam, chain letters, or promotional advertisements.</li>
              <li><strong>Malicious Code & Security Exploits:</strong> Upload files containing viruses, malware, trojans, or corrupted data, or attempt to probe, scan, or exploit security vulnerabilities in Cubit&apos;s infrastructure.</li>
              <li><strong>Automated Abuse & Scraping:</strong> Bypass authentication, manipulate rate limits, or perform harmful or excessive automated scraping that degrades Service performance for other users.</li>
              <li><strong>Intellectual Property Infringement:</strong> Upload or share content that infringes any third party&apos;s copyright, trademark, privacy, or proprietary rights.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>6. Competitive Integrity & Anti-Cheat Rules</h2>
            <p>
              Cubit features global leaderboards, friends rankings, activity streaks, and the Cubit Rating system. These competitive and gamified features rely on authentic solve data recorded by speedcubers.
            </p>
            <p>To preserve competitive integrity, you agree NOT to:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Submit knowingly false, fabricated, or impossible solve times.</li>
              <li>Falsify penalty statuses (+2 or DNF) to manipulate solve metrics.</li>
              <li>Artificially farm Cubit Rating points or streak counters using automated scripts or fake solve logs.</li>
              <li>Exploit software bugs to manipulate leaderboard rankings or rating ledger history.</li>
              <li>Create coordinated duplicate or fake accounts to gain unfair leaderboard advantage.</li>
            </ul>
            <p>
              <strong>Data Reconciliation & Removal:</strong> We reserve the right to audit, recalculate, adjust, or remove obviously false, cheated, or corrupted solve entries, rating records, or leaderboard entries to protect community fairness.
            </p>
          </section>

          {/* Section 7 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>7. World Cube Association (WCA) Independent Disclaimer</h2>
            <p>
              Cubit is an independent, non-official speedcubing utility platform built for personal training, progress tracking, learning, and community engagement.
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Cubit is <strong>NOT</strong> affiliated with, endorsed by, sponsored by, or certified by the World Cube Association (WCA).</li>
              <li>Cubit provides WCA-style scramble generation and timing features, but Cubit is <strong>NOT</strong> an official WCA competition platform.</li>
              <li>All solve times, scrambles, personal bests (PBs), Cubit Ratings, and leaderboard positions recorded on Cubit are <strong>informational only</strong> and do <strong>NOT</strong> constitute official WCA competition records or official world rankings.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>8. Cubit Rating & Gamification Terms</h2>
            <p>
              The Cubit Rating system is an internal gamification and progression metric calculated from eligible speedcubing solves, improvement trends, trainer activity, and daily streaks.
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Cubit Rating has <strong>zero monetary value</strong> and cannot be sold, transferred, or redeemed for cash, currency, cryptocurrency, or financial assets.</li>
              <li>Cubit Rating does not represent financial credit, legal equity, or a monetary balance.</li>
              <li>Leaderboard positions and rating calculations may evolve as rating formulas, anti-cheat reconciliations, or platform activity rules are updated.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>9. Trainer & Focus Mode Disclaimers</h2>
            <h3 style={subheadingStyle}>Trainer Content</h3>
            <p>
              The Trainer module provides educational speedcubing guides, notation tutorials, and lesson algorithms. Trainer content is provided for informational and self-study purposes. We do not guarantee specific speed improvements, competition outcomes, or formal coaching certification.
            </p>

            <h3 style={subheadingStyle}>Focus Mode Audio</h3>
            <p>
              Focus Mode provides ambient audio tracks to assist concentration during speedcubing sessions. The original Focus Mode tracks made available through the Service were created specifically for Cubit, and the Operator holds the necessary rights to stream those tracks. Cloudinary is utilized solely as cloud storage and CDN delivery infrastructure for audio files. Focus Mode audio is provided for personal in-app ambient listening.
            </p>
          </section>

          {/* Section 10 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>10. Intellectual Property & Open-Source Licensing</h2>

            <h3 style={subheadingStyle}>GNU General Public License v3.0 (GPL-3.0) — Cubit Application Code</h3>
            <p>
              The main Cubit web application source code is free software released under the{' '}
              <strong>GNU General Public License v3.0 (GPL-3.0)</strong>. You can inspect, modify, and redistribute the application source code in accordance with the terms of the GPL-3.0 license. Nothing in these website Terms of Use replaces, overrides, restricts, or narrows the rights granted to you under the GNU General Public License v3.0 for the GPL-covered application source code.
            </p>

            <h3 style={subheadingStyle}>Cubit Branding & Visual Assets</h3>
            <p>
              While the application source code is licensed under GPL-3.0, the Cubit name, logos, visual identity, website layout, original graphic artwork, and brand trademarks remain the proprietary property of Parnil Vyawahare and are not licensed under GPL-3.0 unless explicitly stated in the repository.
            </p>

            <h3 style={subheadingStyle}>Cubit.js Package</h3>
            <p>
              <code>Cubit.js</code> is a separate open-source npm package associated with the Cubit ecosystem. Use of the <code>Cubit.js</code> package is governed by its own independent open-source repository license terms.
            </p>
          </section>

          {/* Section 11 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>11. User-Generated Content & Rights</h2>
            <p>
              You retain 100% ownership of any text posts, comments, profile bio descriptions, images, or solve shares that you submit to Cubit (&quot;User Content&quot;). We do not claim ownership over your User Content.
            </p>
            <p>
              By submitting User Content to Cubit, you grant us a non-exclusive, worldwide, royalty-free, limited license to host, store, reproduce, format, transmit, and display that content solely for the purpose of operating, delivering, and displaying the Service to you and other users.
            </p>
            <p>
              You represent and warrant that you own or have obtained all necessary rights to submit your User Content, and that your content does not violate third-party intellectual property, privacy, or legal rights.
            </p>
          </section>

          {/* Section 12 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>12. Moderation & Enforcement Limitations</h2>
            <p>
              We reserve the right to review, edit, or remove User Content or reconciled leaderboard records that violate these Terms or threaten platform integrity.
            </p>
            <p>
              <strong>Truthful Capability Disclosure:</strong> Cubit is a community project. We do not operate a 24/7 dedicated moderation team, automated AI moderation filters, or an automated account suspension engine. Content moderation and database corrections are performed manually by the Operator as necessary.
            </p>
          </section>

          {/* Section 13 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>13. Third-Party Services</h2>
            <p>
              Cubit integrates with or relies upon third-party service providers, including Google Identity Services (OAuth 2.0), Neon Database, Cloudinary, Vercel, GitHub, and Discord. Your interaction with third-party services is subject to their respective terms of service and privacy policies. We are not responsible for third-party service availability or operations.
            </p>
          </section>

          {/* Section 14 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>14. Service Availability & No SLA</h2>
            <p>
              Cubit is provided free of charge on a best-effort basis. We strive to maintain reliable platform operations, but we do not guarantee uninterrupted uptime, 100% availability, error-free operation, or permanent feature preservation. We reserve the right to modify, update, or discontinue features of the Service at any time.
            </p>
          </section>

          {/* Section 15 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>15. Disclaimer of Warranties</h2>
            <p style={{ textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.02em', lineHeight: '1.6' }}>
              THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT TIMER SOLVE DATA, SCRAMBLE GENERATION, OR RATING STATISTICS WILL BE PERMANENTLY PRESERVED WITHOUT SYSTEM DISRUPTIONS.
            </p>
          </section>

          {/* Section 16 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>16. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, in no event shall Parnil Vyawahare or open-source project contributors be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, loss of solves, or service interruption, arising out of or related to your use of or inability to use Cubit.
            </p>
            <p style={{ fontSize: '14px', fontStyle: 'italic' }}>
              <strong>Jurisdictional Statutory Rights:</strong> Applicable laws in certain jurisdictions do not allow the exclusion or limitation of implied warranties or statutory consumer liability. In such jurisdictions, our liability is limited to the maximum extent permitted by applicable law, and non-waivable statutory consumer rights remain unaffected.
            </p>
          </section>

          {/* Section 17 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>17. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Parnil Vyawahare and project contributors from and against any third-party claims, liabilities, damages, and expenses (including reasonable legal fees) arising out of or resulting from your unlawful use of the Service, your material violation of these Terms, or your infringement of any third-party intellectual property or legal right.
            </p>
          </section>

          {/* Section 18 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>18. Governing Law & Jurisdiction</h2>
            <p>
              These Terms and your use of Cubit shall be governed by and construed in accordance with the <strong>laws of India</strong>, without giving effect to conflict of law principles.
            </p>
            <p>
              Any legal disputes or claims arising under these Terms shall be subject to the jurisdiction of the competent courts located in <strong>Pune, Maharashtra, India</strong>, subject to applicable non-waivable statutory consumer protection laws in your jurisdiction.
            </p>
          </section>

          {/* Section 19 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>19. Copyright & Intellectual Property Takedowns</h2>
            <p>
              If you believe that any content hosted on Cubit infringes your copyright or intellectual property rights, please notify us by emailing details of the alleged infringement to{' '}
              <a href="mailto:06v.parnil@gmail.com" style={linkStyle}>06v.parnil@gmail.com</a>. Please include a description of the copyrighted work, the URL or location of the infringing material, and your contact information.
            </p>
          </section>

          {/* Section 20 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>20. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time to reflect service updates or legal requirements. Updated Terms will be posted on this page with a revised &quot;Effective & Last Updated&quot; date. Your continued use of Cubit after updated Terms are published constitutes your acceptance of the revised Terms.
            </p>
          </section>

          {/* Section 21 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>21. Contact Information</h2>
            <p>
              For any questions, legal notices, or inquiries regarding these Terms of Use, please contact us directly:
            </p>
            <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              Primary Contact Email: <a href="mailto:06v.parnil@gmail.com" style={linkStyle}>06v.parnil@gmail.com</a>
            </p>
            <h3 style={subheadingStyle}>Community Channels</h3>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>GitHub Repository:</strong> <a href="https://github.com/parnilV06/Cubit" target="_blank" rel="noopener noreferrer" style={linkStyle}>github.com/parnilV06/Cubit</a></li>
              <li><strong>Community Discord:</strong> <a href="https://discord.gg/8mt7Ee9zv" target="_blank" rel="noopener noreferrer" style={linkStyle}>discord.gg/8mt7Ee9zv</a></li>
            </ul>
            <p style={{ fontSize: '13px', fontStyle: 'italic', marginTop: '6px' }}>
              Note: Please submit formal legal or privacy notices to 06v.parnil@gmail.com rather than public GitHub issues or Discord chat channels.
            </p>
          </section>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

