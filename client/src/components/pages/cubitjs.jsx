import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Copy, Check, ExternalLink, Code, Package, Cpu, ShieldCheck } from 'lucide-react';

import LandingNav from '../layout/landingNav.jsx';
import LandingFooter from '../layout/landingFooter.jsx';
import CubeStage2VisualizerHarness from '../scramble/CubeStage2VisualizerHarness.jsx';

import './landing.css';

export default function CubitJSPage() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('npm install @06parnil/cubit.js');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const cardStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  return (
    <div className="landing-page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="grid-bg-overlay"></div>
      <LandingNav />

      <main style={{ flex: 1, maxWidth: '1080px', margin: '0 auto', padding: '60px 24px', position: 'relative', zIndex: 1, width: '100%' }}>
        
        {/* ==========================================
            HERO SECTION
            ========================================== */}
        <section style={{ textAlign: 'center', marginBottom: '64px', paddingTop: '20px' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', backgroundColor: 'rgba(167, 104, 212, 0.12)', border: '1px solid rgba(167, 104, 212, 0.3)', marginBottom: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#A768D4' }}></span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#A768D4', fontFamily: 'var(--font-heading)' }}>
              npm package v1.0.0 • MIT License
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '52px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: '1.15' }}>
            Cubit<span style={{ color: 'var(--brand-primary)' }}>.js</span>
          </h1>

          <p style={{ fontSize: '22px', fontWeight: '500', color: 'var(--brand-primary)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
            Rubik&apos;s Cube visualization for JavaScript.
          </p>

          <p style={{ maxWidth: '680px', margin: '0 auto 36px auto', color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.65' }}>
            Extracted from Cubit&apos;s core engine, <code>cubit.js</code> is a modular, dependency-free JavaScript library for 2D Rubik&apos;s Cube scramble parsing, mathematical state computation, and unfolded net rendering.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://www.npmjs.com/package/@06parnil/cubit.js"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Package size={18} />
              View on npm
              <ExternalLink size={14} />
            </a>


            <a
              href="https://github.com/parnilV06/Cubit.JS"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              GitHub Repository
              <ExternalLink size={14} />
            </a>

            <Link
              to="/"
              className="btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              Back to Cubit
            </Link>
          </div>
        </section>

        {/* ==========================================
            INSTALLATION BLOCK
            ========================================== */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
              <span style={{ color: 'var(--brand-primary)', fontFamily: 'monospace', fontWeight: 'bold' }}>$</span>
              <code style={{ fontFamily: 'monospace', fontSize: '16px', color: '#f1f5f9' }}>
                npm install @06parnil/cubit.js
              </code>
            </div>
            <button
              onClick={handleCopyInstall}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid var(--brand-primary)',
                color: '#fff',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {copied ? <Check size={16} color="#4ade80" /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </section>

        {/* ==========================================
            WHAT IT DOES (FEATURES)
            ========================================== */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '12px' }}>
            Core Capabilities
          </h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '15px', marginBottom: '36px', maxWidth: '600px', margin: '0 auto 36px auto' }}>
            Stateless, pure JavaScript functions engineered for speedcubing software developers.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={cardStyle}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                <Code size={20} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                Scramble Parsing
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Parses WCA move tokens across 2×2 through 7×7 puzzles into validated execution sequences.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(167, 104, 212, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A768D4' }}>
                <Cpu size={20} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                State Engine
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Computes 3D facelet color matrices deterministically after applying sequence moves.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                <Package size={20} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                2D Net Mapper
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Transforms cube face matrices into canonical unfolded 2D net layouts ready for SVG/Canvas rendering.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(34, 197, 94, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                State Validation
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Verifies color conservation and sticker parity to ensure physical state validity.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================
            WHY IT EXISTS (ORIGIN STORY)
            ========================================== */}
        <section style={{ marginBottom: '64px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '20px', padding: '36px', position: 'relative', overflow: 'hidden' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px' }}>
            Why Cubit.js Exists
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7', marginBottom: '14px' }}>
            While building Cubit, we needed an accurate 2D Rubik&apos;s Cube scramble visualizer. While scramble generation could rely on established cubing utilities, generating exact 2D unfolded net representations for arbitrary NxN cube sizes led us to build our own mathematical state engine.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7' }}>
            That state engine proved fast, accurate, and completely decoupled from UI frameworks. We extracted it into <code>@06parnil/cubit.js</code> so developers building timers, training apps, or cubing tools can easily integrate cube state calculations and 2D net visualization.
          </p>
        </section>

        {/* ==========================================
            QUICK START CODE EXAMPLE
            ========================================== */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '12px' }}>
            Quick Start API
          </h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '15px', marginBottom: '28px' }}>
            Simple functional API for state computation and validation.
          </p>

          <div style={{ backgroundColor: '#090d16', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px', overflowX: 'auto' }}>
            <pre style={{ margin: 0, fontFamily: 'Consolas, Monaco, "Andale Mono", monospace', fontSize: '14px', lineHeight: '1.6', color: '#e2e8f0' }}>
              <code>{`import { createSolvedCube, applyScramble, validateCubeState } from '@06parnil/cubit.js';

// 1. Create a solved 3x3 cube state matrix
const cube = createSolvedCube('3x3');

// 2. Apply a WCA scramble sequence
const scramble = "R U R' U' R' F R2 U' R' U' R U R' F'";
const scrambledCube = applyScramble(scramble, '3x3');

// 3. Validate state & color conservation
const { isValid } = validateCubeState(scrambledCube);
console.log('Cube state valid:', isValid);`}</code>
            </pre>
          </div>
        </section>

        {/* ==========================================
            INTERACTIVE VISUAL SHOWCASE
            ========================================== */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '12px' }}>
            Live Visualization Harness
          </h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '15px', marginBottom: '28px' }}>
            Experience real-time scramble parsing and 2D unfolded net rendering powered by the engine.
          </p>

          {/* Reusing existing CubeStage2VisualizerHarness component */}
          <CubeStage2VisualizerHarness />
        </section>

        {/* ==========================================
            OPEN SOURCE & ECOSYSTEM
            ========================================== */}
        <section style={{ backgroundColor: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '20px', padding: '36px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
            Part of the Cubit Open Source Ecosystem
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '640px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            <code>@06parnil/cubit.js</code> is released under the open-source <strong>MIT License</strong>. It operates as an independent npm package within the broader Cubit ecosystem.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://github.com/parnilV06/Cubit.JS"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Star Cubit.js on GitHub
              <ChevronRight size={16} />
            </a>
            <a
              href="https://www.npmjs.com/package/@06parnil/cubit.js"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              View npm Package
              <ExternalLink size={14} />
            </a>
          </div>
        </section>

      </main>

      <LandingFooter />
    </div>
  );
}
