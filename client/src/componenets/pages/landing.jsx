import React from 'react'
import { Link } from 'react-router-dom'
import {
  Timer,
  Layers,
  BarChart3,
  Settings2,
  Globe,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Coffee,
  Sparkles,
  Heart
} from 'lucide-react'

import LandingNav from '../layout/landingNav.jsx'
import LandingFooter from '../layout/landingFooter.jsx'
import InteractiveCube from '../ui/InteractiveCube.jsx'


import './landing.css'

export default function Landing() {
  return (
    <div className="landing-page-container">
      {/* Grid background overlay across the landing page */}
      <div className="grid-bg-overlay"></div>

      {/* Navigation Navbar */}
      <LandingNav />

      {/* ==========================================
          1. HERO SECTION
          ========================================== */}
      <section className="landing-hero" id="hero">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>

        <div className="hero-content">
          <h1 className="hero-title">
            Time . Train .
            <span className="hero-title-highlight">Improve</span>
          </h1>
          <p className="hero-subtitle">
            Cubit is a fast , modern , minimal and Open Source Cubing platform . Built for everyone from newbies to sub 10’s . It’s time now to “Cube-it” the modern way
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary" id="hero-cta-start">
              Get Started
              <ChevronRight className="btn-chevron" />
            </Link>
            <a href="#features" className="btn-secondary" id="hero-cta-features">
              Explore Features
              <ChevronRight className="btn-chevron" />
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-cube-wrapper">
            <InteractiveCube />
          </div>
        </div>
      </section>

      {/* ==========================================
          2. FEATURES GRID SECTION
          ========================================== */}
      <section className="landing-section" id="features">
        <h2 className="section-title">Everything you need ,<br></br> Nothing you don’t</h2>
        <p className="section-subtitle">
          Cubit is built by cubers , for cubers . Every feature exists because
          someone reaches for it during a solve .
        </p>

        <div className="features-grid">
          {/* Card 1: Precession Timer */}
          <div className="feature-card">
            <h3 className="feature-title">Precession Timer</h3>
            <p className="feature-desc">
              Millisecond-accurate solves with inspection, hold-to-start. +2 and DNF.
              Exactly the controls you expect.
            </p>
          </div>

          {/* Card 2: Session Tracking */}
          <div className="feature-card">
            <h3 className="feature-title">Session Tracking</h3>
            <p className="feature-desc">
              Group solves into sessions per event. Auto calculated a05, a012 ,a100
              and best single. with full history.
            </p>
          </div>

          {/* Card 3: Smart Scrambles */}
          <div className="feature-card">
            <h3 className="feature-title">Smart Scrambles</h3>
            <p className="feature-desc">
              WCA-spec scramble generation for every event. Visual scramble preview
              shows the cube state before you start.
            </p>
          </div>

          {/* Card 4: Train and Learn */}
          <div className="feature-card">
            <h3 className="feature-title">Train and Learn</h3>
            <p className="feature-desc">
              Begginer friendly learning and training modes, To onboard you
              into the world of speedcubing .
            </p>
          </div>

          {/* Card 5: Progress Analytics */}
          <div className="feature-card">
            <h3 className="feature-title">Progress Analytics</h3>
            <p className="feature-desc">
              See PB history. time-of-day patterns. and recognition vs. execution splits.
              Charts you actually need.
            </p>
          </div>

          {/* Card 6: Works Offline */}
          <div className="feature-card">
            <h3 className="feature-title">Works Offline</h3>
            <p className="feature-desc">
              Open Cubit once and use it on a plane. at a comp. anywhere.
              Your solves stay on your device until you sync.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. TRAINING CALLOUT SECTION
          ========================================== */}
      <section className="landing-section training-section-container" id="training">
        <div className="training-card">
          <h2 className="training-card-title">
            Start your SpeedCubing journey
            <span className="training-card-title-sub">WITH <span style={{ color: 'var(--brand-primary)', fontFamily: 'var(--font-logo)', fontSize: '64px' }}>C</span> <span style={{ fontFamily: 'var(--font-logo)', fontSize: '64px' }}>
              U B I T </span> </span>
          </h2>

          <div className="training-divider"></div>

          <p className="training-card-desc">
            Special Learn and Train mode , Crafted for begginers , designed for your very first Rubik’s cube solve ,
            <br /><br />
            Learn Algorithms , train weak areas and kickstart your journey in the world of Rubik’s cube .
          </p>

          <div className="training-card-actions">
            <Link to="/trainer" className="btn-primary" id="training-cta">
              Explore Learn Mode
              <ChevronRight className="btn-chevron" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. COMMUNITY SECTION
          ========================================== */}
      <section className="landing-section" id="community">
        <div className="community-main-row">
          <div className="community-content">
            <h2 className="section-title">
              A community <br />
              that solves together, <br />
              improves together.
            </h2>
            <p className="section-subtitle">
              Connect with cubers around the world, Share, learn, help, and grow together.
            </p>

            <div className="community-actions-container">
              <Link to="/community" className="btn-primary" id="community-cta">
                Join the Community
                <ChevronRight className="btn-chevron" />
              </Link>
            </div>
          </div>

          <div className="community-visual">
            <div className="community-visual-container">
              <svg viewBox="0 0 200 200" className="community-svg-bg">
                <defs>
                  {/* Clip paths for circular avatars */}
                  <clipPath id="avatar-clip-1">
                    <circle cx="160" cy="140" r="18" />
                  </clipPath>
                  <clipPath id="avatar-clip-2">
                    <circle cx="170" cy="50" r="18" />
                  </clipPath>
                  <clipPath id="avatar-clip-3">
                    <circle cx="40" cy="110" r="18" />
                  </clipPath>
                  <linearGradient id="comm-logo-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#A768D4" />
                    <stop offset="100%" stopColor="#572FF7" />
                  </linearGradient>
                </defs>

                {/* Orbit lines */}
                <circle cx="100" cy="100" r="80" fill="none" className="orbit-line" stroke="rgba(167, 104, 212, 0.25)" strokeWidth="1" />
                <circle cx="100" cy="100" r="55" fill="none" className="orbit-line" stroke="rgba(167, 104, 212, 0.25)" strokeWidth="1" />

                {/* Smaller purple circles as design elements */}
                <circle cx="100" cy="20" r="4" fill="var(--brand-sec)" />
                <circle cx="180" cy="100" r="4" fill="var(--brand-sec)" />
                <circle cx="100" cy="180" r="4" fill="var(--brand-sec)" />
                <circle cx="20" cy="100" r="4" fill="var(--brand-sec)" />
                <circle cx="139" cy="61" r="4" fill="var(--brand-sec)" />
                <circle cx="61" cy="139" r="4" fill="var(--brand-sec)" />

                {/* Central Cubit Logo */}
                <g transform="translate(100, 100) scale(0.12) translate(-182, -216.5)">
                  {/* Outer hexagonal shape */}
                  <path d="M0.5 118.6V317.1C1.91839 323.303 3.71713 326.121 8.5 330.1L178.5 430.6C186.187 432.82 190.257 432.377 197.5 430.6L362.5 328.1C362.816 324.036 363.824 322.712 362 320.1C360.176 317.487 301 284.6 301 284.6C296.72 283.086 294.932 281.513 288.5 284.6C282.068 287.686 193 344.1 193 344.1C188.175 345.328 185.357 345.469 180 344.1L85 289.1C77.9794 285.306 75.8106 281.84 74 274.1V162.1C75.3492 156.49 76.4425 153.965 81.5 151.1L176 93.0996C183.368 89.5736 188.029 88.5885 195.5 92.0996L288 146.1H298L361 107.1C364.299 103.659 364.157 101.566 361 97.5996L200 4.09963C189.218 -0.682341 183.948 -0.717379 176 4.09963C176 4.09963 10 104.1 6.5 106.6C3 109.1 0.5 114.1 0.5 118.6Z" fill="url(#comm-logo-grad)" />
                  {/* Inner diamond shape */}
                  <path d="M102 181.1L100 267.6L182 314.6V226.6L102 181.1Z" fill="url(#comm-logo-grad)" />
                </g>

                {/* User Avatars with outer borders */}
                <image href="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80" x="142" y="122" width="36" height="36" clipPath="url(#avatar-clip-1)" />
                <circle cx="160" cy="140" r="18" fill="none" stroke="var(--brand-sec)" strokeWidth="1.5" />

                <image href="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80" x="152" y="32" width="36" height="36" clipPath="url(#avatar-clip-2)" />
                <circle cx="170" cy="50" r="18" fill="none" stroke="var(--brand-sec)" strokeWidth="1.5" />

                <image href="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" x="22" y="92" width="36" height="36" clipPath="url(#avatar-clip-3)" />
                <circle cx="40" cy="110" r="18" fill="none" stroke="var(--brand-sec)" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* 3-column features grid at bottom */}
        <div className="community-grid">
          <div className="community-card">
            <h3 className="community-card-title">Discuss and Learn</h3>
            <p className="community-card-desc">
              Begginer friendly learning and training modes, To onboard you into the world of speedcubing .
            </p>
          </div>
          <div className="community-card">
            <h3 className="community-card-title">Connect and Share</h3>
            <p className="community-card-desc">
              See PB history. time-of-day patterns. and recognition vs. execution splits. Charts you actually need.
            </p>
          </div>
          <div className="community-card">
            <h3 className="community-card-title">Events and Challenges</h3>
            <p className="community-card-desc">
              Open Cubit once and use it on a plane. at a comp. anywhere. Your solves stay on your device until you sync.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. OPEN SOURCE SECTION
          ========================================== */}
      <section className="landing-section" id="open-source">
        <div className="open-source-main-row">
          <div className="open-source-left-col">
            <h2 className="section-title">Built in the open. <br></br>Built to stay that way.</h2>
            <p className="section-subtitle">
              Cubit will never have a paywall. The code lives on GitHub. issues are public. and the roadmap is decided in the open with the community.
            </p>

            <div className="open-source-actions">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                id="github-star-cta"
              >
                Star on Github
                <ChevronRight className="btn-chevron" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                id="github-contribute-cta"
              >
                Contribute
                <ChevronRight className="btn-chevron" />
              </a>
            </div>
          </div>

          <div className="open-source-right-col">
            <div className="support-card">
              <h3 className="support-card-title">Support Us</h3>
              <p className="support-card-desc">
                Help shape Cubit. Contribute code, ideas, or support development with a small donation.
              </p>
              <div className="support-card-actions">
                <a href="#support" className="btn-outline" id="coffee-donate-cta">
                  Buy me a Coffee
                  <ChevronRight className="btn-chevron" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars grid */}
        <div className="pillars-grid">
          <div className="pillar-card">
            <h3 className="pillar-title">Free</h3>
            <p className="pillar-desc">
              Always . Every Feature , no tiers , no paywalls
            </p>
          </div>
          <div className="pillar-card">
            <h3 className="pillar-title">Open Source</h3>
            <p className="pillar-desc">
              MIT licensed , fork it , audit it , contribute
            </p>
          </div>
          <div className="pillar-card">
            <h3 className="pillar-title">Local first</h3>
            <p className="pillar-desc">
              Your data lives on your device by default
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. FOOTER CALL-TO-ACTION (CTA CARD)
          ========================================== */}
      <section className="cta-card-section">
        <div className="cta-card-container">
          <div className="cta-glow"></div>

          <div className="cta-card-left">
            <span className="cta-tag">Ready to “ Cube-it ”</span>
            <h2 className="cta-title">
              Start your journey <br />
              with <span className="cta-title-sub"><span style={{ color: 'var(--brand-primary)', fontFamily: 'var(--font-logo)', fontSize: '64px' }}>C</span> <span style={{ fontFamily: 'var(--font-logo)', fontSize: '64px' }}>
                U B I T </span></span>
            </h2>
            <p className="cta-subtext">
              Join a growing community of cubers and <br />
              take your solves to the next level.
            </p>
          </div>

          <div className="cta-card-right">
            <Link to="/signup" className="btn-primary" id="foot-cta-start">
              Get Started
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer component */}
      <LandingFooter />
    </div>
  )
}
