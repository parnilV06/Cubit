import { useEffect } from 'react';
import LandingNav from '../layout/landingNav.jsx';
import LandingFooter from '../layout/landingFooter.jsx';
import './landing.css';

export default function Privacy() {
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

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '12px',
    marginBottom: '12px',
    fontSize: '14px',
  };

  const thStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    color: 'var(--text-primary)',
    textAlign: 'left',
    padding: '12px 14px',
    borderBottom: '1px solid var(--border-primary)',
    fontFamily: 'var(--font-heading)',
    fontWeight: '600',
  };

  const tdStyle = {
    padding: '12px 14px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    color: 'var(--text-secondary)',
    verticalAlign: 'top',
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
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Effective & Last Updated: August 4, 2026
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px' }}>
          
          {/* Section 1 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>1. Who We Are</h2>
            <p>
              Cubit is an open-source speedcubing platform created and operated by Parnil Vyawahare (&quot;Operator&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). Cubit provides speedcubers worldwide with timer logging, session management, performance analytics, trainer progress tracking, and social community features.
            </p>
            <p>
              While Cubit is an open-source project and welcomes community code contributions on GitHub, open-source code contributors do not act as operators or data controllers for the Cubit platform or its user database.
            </p>
            <p>
              For any privacy inquiries, data protection questions, or account requests, you may contact us directly at{' '}
              <a href="mailto:06v.parnil@gmail.com" style={linkStyle}>06v.parnil@gmail.com</a>.
            </p>
          </section>

          {/* Section 2 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>2. What Cubit Does</h2>
            <p>
              Cubit is a free speedcubing application. It enables cubers to measure solve times, generate WCA-compliant scrambles, organize solves into customizable sessions, compute performance statistics (Personal Bests, Means, Average of 5, Average of 12), track lesson progress in the Trainer, share solves in community feeds, connect with friends, and compare rankings on global and friends leaderboards.
            </p>
            <p>
              Cubit is 100% free to use. There are no paid subscription tiers, paid features, or financial transactions processed within the application.
            </p>
          </section>

          {/* Section 3 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>3. Information We Collect</h2>

            <h3 style={subheadingStyle}>What We Do NOT Collect</h3>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>No Financial Data:</strong> We do not collect credit cards, bank details, or payment information.</li>
              <li><strong>No Geolocation Data:</strong> We do not request or track your precise location or GPS data.</li>
              <li><strong>No Address Books:</strong> We do not request access to your device contacts or address book.</li>
              <li><strong>No Tracking Pixels:</strong> We do not collect behavioral advertising profiles or use cross-site tracking scripts.</li>
            </ul>

            <h3 style={subheadingStyle}>Data You Provide to Us</h3>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Account Credentials:</strong> When registering, you provide an email address, username, display name, and password. Passwords are salted and hashed using <code>bcrypt</code> before storage; plain-text passwords are never saved.</li>
              <li><strong>Google Sign-In:</strong> If you log in via Google OAuth, we receive and store your Google Account ID (<code>googleId</code>), email address, display name, and avatar image URL.</li>
              <li><strong>Profile Information:</strong> Optional profile details you provide, including your bio and custom avatar image uploads.</li>
              <li><strong>Cubing & Session Data:</strong> Timer solve durations (in milliseconds), penalty status (+2 or DNF), scramble text strings, session names, puzzle categories, session notes, and lesson completion records.</li>
              <li><strong>Community Content:</strong> Text posts, shared solves, post comments, post likes, and uploaded post media.</li>
              <li><strong>Social Connections:</strong> Friend requests sent, received, accepted, or blocked.</li>
            </ul>

            <h3 style={subheadingStyle}>Public vs. Private Information Visibility</h3>
            <p>To ensure transparency in our community features, the table below outlines which data is public to other Cubit users and which remains strictly private:</p>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Publicly Visible Information</th>
                  <th style={thStyle}>Private / Non-Public Information</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><strong>Profile</strong></td>
                  <td style={tdStyle}>Username, Display Name, Avatar Picture, Bio, Account Creation Date, Cubit Rating, Daily Active Streaks.</td>
                  <td style={tdStyle}>Email Address, Password Hash, Google OAuth ID.</td>
                </tr>
                <tr>
                  <td style={tdStyle}><strong>Solves & Sessions</strong></td>
                  <td style={tdStyle}>Leaderboard PB times, average solve metrics, and solves explicitly shared via Community Posts.</td>
                  <td style={tdStyle}>Unshared solve histories, session lists, session names, and private session notes.</td>
                </tr>
                <tr>
                  <td style={tdStyle}><strong>Social & Feeds</strong></td>
                  <td style={tdStyle}>Community posts, comments, likes, public leaderboard rank, and friendship connections.</td>
                  <td style={tdStyle}>In-app notifications and pending friend request details.</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Section 4 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>4. How We Use Information</h2>
            <p>We use the collected information exclusively for the following operational and functional purposes:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Service Provision:</strong> Authenticating your identity, maintaining your session state, and synchronizing your solves, statistics, and trainer progress across devices.</li>
              <li><strong>Analytics & Metrics:</strong> Calculating your personal bests, rolling averages (Ao5, Ao12), Cubit Rating points, and activity streak milestones.</li>
              <li><strong>Community Interaction:</strong> Facilitating user search, friend connections, community feed posts, comments, notifications, and leaderboard placement.</li>
              <li><strong>Security & Integrity:</strong> Preventing automated abuse, maintaining leaderboard fairness, and verifying authentication tokens.</li>
            </ul>
            <p style={{ marginTop: '8px', padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.08)', borderRadius: '8px', borderLeft: '4px solid var(--brand-primary)' }}>
              <strong>AI Model Disclosure:</strong> Cubit does <strong>NOT</strong> process user data, prompts, or solve logs through artificial intelligence models or Large Language Models (LLMs). Your personal data and speedcubing records are <strong>never used to train or fine-tune AI models</strong>.
            </p>
          </section>

          {/* Section 5 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>5. Cookies and Browser Local Storage</h2>
            <p>
              <strong>Zero Cookies Policy:</strong> Cubit does <strong>not</strong> set HTTP cookies, session cookies, or third-party tracking cookies on your device.
            </p>
            <p>
              <strong>Local Storage Usage:</strong> We utilize browser <code>localStorage</code> solely to preserve client authentication and UI state across page reloads. This data remains on your local device:
            </p>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Storage Key</th>
                  <th style={thStyle}>Purpose</th>
                  <th style={thStyle}>Duration</th>
                  <th style={thStyle}>How to Remove</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><code>token</code></td>
                  <td style={tdStyle}>Stores your JSON Web Token (JWT) to maintain your authenticated login state.</td>
                  <td style={tdStyle}>7 days or until logout.</td>
                  <td style={tdStyle}>Click &quot;Logout&quot; in the application or clear your browser site data.</td>
                </tr>
                <tr>
                  <td style={tdStyle}><code>selectedSessionId</code></td>
                  <td style={tdStyle}>Remembers your active speedcubing session selection for seamless navigation.</td>
                  <td style={tdStyle}>Persistent until cleared.</td>
                  <td style={tdStyle}>Click &quot;Logout&quot; or clear browser storage.</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Section 6 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>6. Third-Party Service Providers</h2>
            <p>
              We rely on trusted third-party infrastructure providers to host and run Cubit. These providers process data strictly to deliver platform services:
            </p>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Provider</th>
                  <th style={thStyle}>Purpose & Service</th>
                  <th style={thStyle}>Privacy Policy</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><strong>Neon Database</strong></td>
                  <td style={tdStyle}>Serverless PostgreSQL database hosting for user accounts, solves, sessions, and posts.</td>
                  <td style={tdStyle}><a href="https://neon.tech/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>Neon Privacy Policy</a></td>
                </tr>
                <tr>
                  <td style={tdStyle}><strong>Cloudinary</strong></td>
                  <td style={tdStyle}>Media upload storage and CDN delivery for user profile avatars and community post images.</td>
                  <td style={tdStyle}><a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>Cloudinary Privacy Policy</a></td>
                </tr>
                <tr>
                  <td style={tdStyle}><strong>Google Identity Services</strong></td>
                  <td style={tdStyle}>OAuth 2.0 authentication for users choosing Google Sign-In.</td>
                  <td style={tdStyle}><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>Google Privacy Policy</a></td>
                </tr>
                <tr>
                  <td style={tdStyle}><strong>Vercel</strong></td>
                  <td style={tdStyle}>Frontend application web hosting and static asset delivery.</td>
                  <td style={tdStyle}><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={linkStyle}>Vercel Privacy Policy</a></td>
                </tr>
                <tr>
                  <td style={tdStyle}><strong>Backend API Host</strong></td>
                  <td style={tdStyle}>Cloud application environment hosting the Node.js / Express backend server.</td>
                  <td style={tdStyle}>Hosted in cloud infrastructure adhering to standard data processing security.</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Section 7 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>7. Data Retention and Account Deletion</h2>

            <h3 style={subheadingStyle}>In-App Data Management</h3>
            <p>
              You maintain direct control over individual data entries within the application. You can delete your individual solves, speedcubing sessions, session notes, community posts, post comments, and friend connections directly inside Cubit at any time. When deleted in-app, these records are deleted from our active database tables.
            </p>

            <h3 style={subheadingStyle}>Account Deletion Requests</h3>
            <p>
              To request complete deletion of your Cubit account and associated data, please send an email request from your registered email address to{' '}
              <a href="mailto:06v.parnil@gmail.com" style={linkStyle}>06v.parnil@gmail.com</a> with the subject line <em>&quot;Account Deletion Request&quot;</em>.
            </p>
            <p>
              Upon receiving and verifying your request, we will delete your user profile, solve logs, session histories, notes, posts, comments, likes, notifications, and rating ledger records from our primary application database.
            </p>

            <h3 style={subheadingStyle}>Backups & Operational Infrastructure Logs</h3>
            <p>
              When data is deleted from our active application database, it is removed immediately from live application interfaces. Infrastructure service providers (such as database hosts) maintain automated rolling system backups and temporary server security access logs for operational stability and security debugging. Data in infrastructure backups is overwritten according to standard provider backup cycles.
            </p>
          </section>

          {/* Section 8 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>8. Your Privacy Rights</h2>
            <p>Depending on your location, you may exercise specific privacy rights regarding your personal information:</p>

            <h3 style={subheadingStyle}>EEA / UK Rights (GDPR)</h3>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>Right of Access & Portability:</strong> Request details or a copy of your personal data processed by Cubit.</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate profile information.</li>
              <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request deletion of your account data.</li>
              <li><strong>Legal Basis (Art. 6 GDPR):</strong> We process your data based on <em>Performance of Contract</em> (delivering Cubit services you sign up for) and <em>Legitimate Interests</em> (maintaining platform integrity and security).</li>
            </ul>

            <h3 style={subheadingStyle}>California Privacy Rights (CCPA / CPRA)</h3>
            <p>
              California residents have the right to know what personal information is collected, request deletion, and request correction. <strong>Cubit does not sell or share your personal information</strong> with third parties for cross-context behavioral advertising.
            </p>

            <h3 style={subheadingStyle}>India Privacy Rights (DPDP Act 2023)</h3>
            <p>
              Indian users have the right to access summary information about personal data processed, request correction or erasure of personal data, and access grievance redressal by contacting us at{' '}
              <a href="mailto:06v.parnil@gmail.com" style={linkStyle}>06v.parnil@gmail.com</a>.
            </p>
          </section>

          {/* Section 9 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>9. International Data Transfers</h2>
            <p>
              Cubit operates globally. Information collected from you is stored and processed on secure servers located in cloud data centers managed by our infrastructure providers (including Neon Database and Cloudinary). By using Cubit, you acknowledge that your information may be transferred to and processed in countries outside your residence, where data protection standards meet cloud infrastructure security protocols.
            </p>
          </section>

          {/* Section 10 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>10. Children&apos;s Privacy</h2>
            <p>
              Cubit is a speedcubing utility designed for general audiences and is not directed at young children.
            </p>
            <p>
              Users below the age at which they can independently consent to personal data processing under applicable laws in their jurisdiction (such as under 13 in the United States under COPPA, 13–16 in EEA/UK jurisdictions under GDPR, or under 18 in India under the Digital Personal Data Protection Act) should use Cubit only with the involvement, supervision, or consent of a parent or legal guardian.
            </p>
            <p>
              If a parent or legal guardian discovers that a child below applicable local consent thresholds has created an account without authorization, please contact us at{' '}
              <a href="mailto:06v.parnil@gmail.com" style={linkStyle}>06v.parnil@gmail.com</a> to request account and data removal.
            </p>
          </section>

          {/* Section 11 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>11. Data Security</h2>
            <p>We implement technical and organizational security measures to protect your account data:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Encryption in Transit:</strong> All data transmitted between your browser and our servers is encrypted via standard TLS/HTTPS protocols.</li>
              <li><strong>Password Security:</strong> Passwords are cryptographically salted and hashed using <code>bcrypt</code> (10 salt rounds). Plain-text passwords are never stored.</li>
              <li><strong>Authentication Authorization:</strong> Protected API routes require a valid JSON Web Token (JWT) bearer header.</li>
              <li><strong>Database Protections:</strong> Parameterized database queries prevent SQL injection risks.</li>
            </ul>
            <p>
              Please note that while we take reasonable technical steps to safeguard data, no method of transmission over the internet or electronic storage is 100% secure. We do not claim end-to-end encryption (E2EE) or formal third-party SOC 2 / ISO certifications.
            </p>
          </section>

          {/* Section 12 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>12. Open Source Code vs. Data Privacy</h2>
            <p>
              Cubit&apos;s source code is publicly accessible under the MIT License on GitHub. Open-source code transparency allows anyone to inspect how the application operates. However, the public availability of Cubit&apos;s source code does <strong>not</strong> expose your private database records, email address, password hashes, or unshared solve logs.
            </p>
          </section>

          {/* Section 13 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>13. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect platform enhancements or legal requirements. Material modifications will be reflected by updating the &quot;Effective & Last Updated&quot; date at the top of this page. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* Section 14 */}
          <section style={sectionStyle}>
            <h2 style={headingStyle}>14. Contact & Community Information</h2>
            <p>
              For all official privacy inquiries, data rights requests, or account deletion requests, please contact the Operator directly via email:
            </p>
            <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              Primary Privacy Contact: <a href="mailto:06v.parnil@gmail.com" style={linkStyle}>06v.parnil@gmail.com</a>
            </p>
            <h3 style={subheadingStyle}>Community Channels (Non-Privacy Matters)</h3>
            <p>
              For technical issue tracking, open-source code contributions, or community discussions:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>GitHub Repository:</strong> <a href="https://github.com/parnilV06/Cubit" target="_blank" rel="noopener noreferrer" style={linkStyle}>github.com/parnilV06/Cubit</a></li>
              <li><strong>Community Discord:</strong> <a href="https://discord.gg/8mt7Ee9zv" target="_blank" rel="noopener noreferrer" style={linkStyle}>discord.gg/8mt7Ee9zv</a></li>
            </ul>
            <p style={{ fontSize: '13px', fontStyle: 'italic', marginTop: '6px' }}>
              Important: Please do not post personal privacy requests, email addresses, or account deletion requests publicly on GitHub issues or Discord channels.
            </p>
          </section>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

