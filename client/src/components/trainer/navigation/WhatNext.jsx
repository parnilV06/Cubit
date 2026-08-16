/**
 * Cubit Trainer — Reusable WhatNext Component
 * 
 * Renders the structured "What's Next?" section at the end of lessons,
 * displaying recommended progression, related concepts, and optional exploration paths.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const LESSON_CATALOG_FALLBACKS = {
  'meet-the-rubiks-cube': {
    title: 'Meet the Rubik\'s Cube',
    description: 'Discover the classic 3x3 Rubik\'s Cube, explore its six faces and colors, and understand how centers, edges, and corners work together.',
    category: 'Getting Started',
    estimatedMinutes: 5,
  },
  'cube-types': {
    title: 'Cube Types',
    description: 'Explore the broader twisty puzzle family, from 2x2 through 5x5 NxN cubes to non-cubic puzzles like the Pyraminx, Megaminx, and Skewb.',
    category: 'Getting Started',
    estimatedMinutes: 5,
  },
  'a-brief-history-of-the-cube': {
    title: 'A Brief History of the Cube',
    description: 'Trace the journey of the Rubik\'s Cube from Ernő Rubik\'s architectural teaching tool in Budapest to a worldwide 1980s craze and modern competitive esport.',
    category: 'Getting Started',
    estimatedMinutes: 6,
  },
  'what-is-speedcubing': {
    title: 'What is Speedcubing?',
    description: 'Explore the global sport, official WCA events, and solving methods.',
    category: 'Getting Started',
    estimatedMinutes: 6,
  },
  'fun-cube-patterns': {
    title: 'Fun Cube Patterns',
    description: 'Create aesthetic patterns like Checkerboard and Cube-in-a-Cube.',
    category: 'Getting Started',
    estimatedMinutes: 8,
  },
  'basic-face-notation': {
    title: 'Basic Face Notation',
    description: 'Learn the six fundamental face moves (U, D, L, R, F, B) that form the universal language of the Rubik\'s Cube.',
    category: 'Cube Notation',
    estimatedMinutes: 6,
  },
  'prime-double-turns': {
    title: 'Prime & Double Turns',
    description: 'Learn counter-clockwise turns (R\') and 180-degree double turns (R2).',
    category: 'Cube Notation',
    estimatedMinutes: 5,
  },
  'whole-cube-rotations': {
    title: 'Whole Cube Rotations',
    description: 'Master x, y, and z whole-cube spatial reorientations.',
    category: 'Cube Notation',
    estimatedMinutes: 5,
  },
  'wide-moves': {
    title: 'Wide Moves',
    description: 'Learn double-layer turns (Rw, Uw, Fw) and their applications in speedcubing.',
    category: 'Cube Notation',
    estimatedMinutes: 6,
  },
  '4x4-5x5-notation': {
    title: '4x4 & 5x5 Notation',
    description: 'Understand big-cube scramble notation, depth prefixes (3Rw), and inner layers.',
    category: 'Cube Notation',
    estimatedMinutes: 7,
  },
  'understanding-the-beginner-method': {
    title: 'Understanding the Beginner Method',
    description: 'Master the 7-step Layer-by-Layer solving roadmap for the 3x3 Rubik\'s Cube.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 6,
  },
  'beginner-method-overview': {
    title: 'Understanding the Beginner Method',
    description: 'Master the 7-step Layer-by-Layer solving roadmap for the 3x3 Rubik\'s Cube.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 6,
  },
  'make-the-white-cross': {
    title: 'Make the White Cross',
    description: 'Build a correctly aligned White Cross by matching white edge pieces with their corresponding side centers.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 8,
  },
  'white-cross': {
    title: 'Make the White Cross',
    description: 'Build a correctly aligned White Cross by matching white edge pieces with their corresponding side centers.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 8,
  },
  'solve-the-first-layer-corners': {
    title: 'Solve the First-Layer Corners',
    description: 'Place and orient the four white corner pieces using the Right Trigger to complete the entire first layer.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 8,
  },
  'first-layer-corners': {
    title: 'Solve the First-Layer Corners',
    description: 'Place and orient the four white corner pieces using the Right Trigger to complete the entire first layer.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 8,
  },
  'solve-the-middle-layer': {
    title: 'Solve the Middle Layer',
    description: 'Insert the four middle-layer edge pieces to complete the First Two Layers (F2L) of the cube.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 10,
  },
  'second-layer-edges': {
    title: 'Solve the Middle Layer',
    description: 'Insert the four middle-layer edge pieces to complete the First Two Layers (F2L) of the cube.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 10,
  },
  'make-the-yellow-cross': {
    title: 'Make the Yellow Cross',
    description: 'Orient all four top-layer yellow edge pieces to form a Yellow Cross on the top face.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 8,
  },
  'yellow-cross': {
    title: 'Make the Yellow Cross',
    description: 'Orient all four top-layer yellow edge pieces to form a Yellow Cross on the top face.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 8,
  },
  'solve-the-yellow-edges': {
    title: 'Solve the Yellow Edges',
    description: 'Align the side colors of the Yellow Cross with their matching side centers using the Sune algorithm.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 7,
  },
  'yellow-edges-alignment': {
    title: 'Solve the Yellow Edges',
    description: 'Align the side colors of the Yellow Cross with their matching side centers using the Sune algorithm.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 7,
  },
  'position-the-yellow-corners': {
    title: 'Position the Yellow Corners',
    description: 'Move all four yellow corners into their correct spatial locations using the Niklas algorithm.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 7,
  },
  'yellow-corners-position': {
    title: 'Position the Yellow Corners',
    description: 'Move all four yellow corners into their correct spatial locations using the Niklas algorithm.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 7,
  },
  'orient-the-yellow-corners': {
    title: 'Orient the Yellow Corners',
    description: 'Twist the final yellow corners into place using the Right Trigger to complete your first Rubik\'s Cube solve.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 8,
  },
  'yellow-corners-orientation': {
    title: 'Orient the Yellow Corners',
    description: 'Twist the final yellow corners into place using the Right Trigger to complete your first Rubik\'s Cube solve.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 8,
  },
  'bring-it-all-together': {
    title: 'Bring It All Together',
    description: 'Review the complete 7-step beginner method, master the full algorithm cheat sheet, and complete full unassisted solves.',
    category: 'Solve Your First Cube',
    estimatedMinutes: 10,
  },
  'speedcubing-fundamentals': {
    title: 'From Solving to Speedsolving',
    description: 'Understand the fundamental shift from basic layer-by-layer solving to efficient speedcubing, and discover the core pillars of faster times.',
    category: 'Speedcubing Fundamentals',
    estimatedMinutes: 6,
  },
  'from-solving-to-speedsolving': {
    title: 'From Solving to Speedsolving',
    description: 'Understand the fundamental shift from basic layer-by-layer solving to efficient speedcubing, and discover the core pillars of faster times.',
    category: 'Speedcubing Fundamentals',
    estimatedMinutes: 6,
  },
  'inspection': {
    title: 'Inspection',
    description: 'Master the 15-second pre-solve inspection period to scan piece positions, plan your cross, and eliminate starting hesitation.',
    category: 'Speedcubing Fundamentals',
    estimatedMinutes: 7,
  },
  'cross-efficiency': {
    title: 'Cross Efficiency',
    description: 'Transition from the beginner Daisy method to direct bottom-layer cross solving in 8 moves or fewer.',
    category: 'Speedcubing Fundamentals',
    estimatedMinutes: 8,
  },
  'turning-and-finger-tricks': {
    title: 'Turning & Finger Tricks',
    description: 'Master ergonomic fingertricks, eliminate whole-hand regrips, and build smooth, accurate turning mechanics.',
    category: 'Speedcubing Fundamentals',
    estimatedMinutes: 7,
  },
  'turning-finger-tricks': {
    title: 'Turning & Finger Tricks',
    description: 'Master ergonomic fingertricks, eliminate whole-hand regrips, and build smooth, accurate turning mechanics.',
    category: 'Speedcubing Fundamentals',
    estimatedMinutes: 7,
  },
  'lookahead': {
    title: 'Lookahead',
    description: 'Discover the secret to sub-20 speedcubing: tracking upcoming pieces while your hands execute the current step on autopilot.',
    category: 'Speedcubing Fundamentals',
    estimatedMinutes: 7,
  },
  'reducing-pauses': {
    title: 'Reducing Pauses',
    description: 'Eliminate hesitation, minimize cube rotations, and establish continuous solve rhythm to drop 15–30 seconds off your times.',
    category: 'Speedcubing Fundamentals',
    estimatedMinutes: 6,
  },
  'understanding-tps': {
    title: 'Understanding TPS',
    description: 'Understand Turns Per Second (TPS), calculate your execution speed, and learn why move efficiency beats raw turning speed.',
    category: 'Speedcubing Fundamentals',
    estimatedMinutes: 5,
  },
  'cfop-what-is-cfop': {
    title: 'What is CFOP?',
    description: 'Understand the complete CFOP speedsolving pipeline and discover how Cross, F2L, OLL, and PLL systematically cut your move count in half.',
    category: 'CFOP',
    estimatedMinutes: 7,
  },
  'cfop-overview': {
    title: 'What is CFOP?',
    description: 'Understand the complete CFOP speedsolving pipeline and discover how Cross, F2L, OLL, and PLL systematically cut your move count in half.',
    category: 'CFOP',
    estimatedMinutes: 7,
  },
  'cfop-cross': {
    title: 'Cross',
    description: 'Master the CFOP bottom cross: 15-second inspection planning, zero-rotation execution, and seamless transition into your first F2L pair.',
    category: 'CFOP',
    estimatedMinutes: 8,
  },
  'cfop-f2l-introduction': {
    title: 'F2L Introduction',
    description: 'Discover the core engine of CFOP: pairing corners and edges to solve the first two layers simultaneously.',
    category: 'CFOP',
    estimatedMinutes: 9,
  },
  'cfop-f2l-cases': {
    title: 'F2L Cases',
    description: 'Master the 3 core F2L case archetypes and learn intuitive pairing logic for all 41 standard configurations.',
    category: 'CFOP',
    estimatedMinutes: 12,
  },
  'cfop-f2l-efficiency': {
    title: 'F2L Efficiency',
    description: 'Eliminate cube rotations, master back-slot insertions, reduce pauses, and unlock effortless F2L lookahead.',
    category: 'CFOP',
    estimatedMinutes: 9,
  },
  'cfop-2look-oll': {
    title: '2-Look OLL',
    description: 'Orient all top-layer yellow stickers in two swift stages using only 9 intuitive algorithms instead of 57.',
    category: 'CFOP',
    estimatedMinutes: 10,
  },
  'cfop-full-oll': {
    title: 'Full OLL',
    description: 'Explore the complete 57-case OLL system, organized by geometric case families and structured for systematic, long-term mastery.',
    category: 'CFOP',
    estimatedMinutes: 12,
  },
  'cfop-2look-pll': {
    title: '2-Look PLL',
    description: 'Permute all last-layer pieces in two systematic steps using only 6 algorithms to complete your solves.',
    category: 'CFOP',
    estimatedMinutes: 10,
  },
  'cfop-full-pll': {
    title: 'Full PLL',
    description: 'Master the complete 21-case PLL system: lightning-fast 2-sided recognition, fingertrick executions, and instant sub-2 second finishes.',
    category: 'CFOP',
    estimatedMinutes: 12,
  },
  'cfop-putting-it-together': {
    title: 'Putting CFOP Together',
    description: 'Experience a complete, end-to-end CFOP solve: connect inspection, cross, four F2L pairs, OLL, PLL, and AUF into one fluid performance.',
    category: 'CFOP',
    estimatedMinutes: 10,
  },
  'sexy-move': {
    title: 'Sexy Move',
    description: "Master the world's most famous 4-move trigger (R U R' U'), explore its 6-repetition cycle, and discover why it powers countless speedcubing algorithms.",
    category: 'Algorithms & Patterns',
    estimatedMinutes: 5,
  },
  'algorithms-sexy-move': {
    title: 'Sexy Move',
    description: "Master the world's most famous 4-move trigger (R U R' U'), explore its 6-repetition cycle, and discover why it powers countless speedcubing algorithms.",
    category: 'Algorithms & Patterns',
    estimatedMinutes: 5,
  },
  'sledgehammer': {
    title: 'Sledgehammer',
    description: "Master the powerful Sledgehammer trigger (R' F R F'), understand edge orientation control, and explore its mirror relationship with Hedgeslammer.",
    category: 'Algorithms & Patterns',
    estimatedMinutes: 5,
  },
  'algorithms-sledgehammer': {
    title: 'Sledgehammer',
    description: "Master the powerful Sledgehammer trigger (R' F R F'), understand edge orientation control, and explore its mirror relationship with Hedgeslammer.",
    category: 'Algorithms & Patterns',
    estimatedMinutes: 5,
  },
  'checkerboard': {
    title: 'Checkerboard',
    description: "Create the world's most famous Rubik's Cube pattern, understand the geometry of 180-degree axis turns, and explore its self-inverse property.",
    category: 'Algorithms & Patterns',
    estimatedMinutes: 5,
  },
  'algorithms-checkerboard': {
    title: 'Checkerboard',
    description: "Create the world's most famous Rubik's Cube pattern, understand the geometry of 180-degree axis turns, and explore its self-inverse property.",
    category: 'Algorithms & Patterns',
    estimatedMinutes: 5,
  },
  'snake': {
    title: 'Snake',
    description: 'Weave a continuous, winding serpent ribbon of color across the cube faces using the 14-move Snake (Anaconda) pattern.',
    category: 'Algorithms & Patterns',
    estimatedMinutes: 5,
  },
  'algorithms-snake': {
    title: 'Snake',
    description: 'Weave a continuous, winding serpent ribbon of color across the cube faces using the 14-move Snake (Anaconda) pattern.',
    category: 'Algorithms & Patterns',
    estimatedMinutes: 5,
  },
  'cube-in-a-cube': {
    title: 'Cube in a Cube',
    description: 'Create the stunning optical illusion of a miniature 2x2 cube nested inside a 3x3 using the classic 15-move Cube in a Cube algorithm.',
    category: 'Algorithms & Patterns',
    estimatedMinutes: 6,
  },
  'algorithms-cube-in-cube': {
    title: 'Cube in a Cube',
    description: 'Create the stunning optical illusion of a miniature 2x2 cube nested inside a 3x3 using the classic 15-move Cube in a Cube algorithm.',
    category: 'Algorithms & Patterns',
    estimatedMinutes: 6,
  },
  'more-fun-algorithms': {
    title: 'More Fun Algorithms',
    description: "Explore a curated gallery of iconic cube transformations: Six Spots (Center Swap), The Wire Cross, Vertical Stripes, and the legendary 20-move God's Number Superflip.",
    category: 'Algorithms & Patterns',
    estimatedMinutes: 7,
  },
  'algorithms-more-fun': {
    title: 'More Fun Algorithms',
    description: "Explore a curated gallery of iconic cube transformations: Six Spots (Center Swap), The Wire Cross, Vertical Stripes, and the legendary 20-move God's Number Superflip.",
    category: 'Algorithms & Patterns',
    estimatedMinutes: 7,
  },
  'solving-the-2x2': {
    title: 'Solving the 2x2',
    description: 'Transition your 3x3 solving skills to the 2x2 Pocket Cube: master first-layer construction, top-layer orientation, and corner permutation.',
    category: 'Solving Other Cubes',
    estimatedMinutes: 10,
  },
  'other-cubes-solving-2x2': {
    title: 'Solving the 2x2',
    description: 'Transition your 3x3 solving skills to the 2x2 Pocket Cube: master first-layer construction, top-layer orientation, and corner permutation.',
    category: 'Solving Other Cubes',
    estimatedMinutes: 10,
  },
  '2x2-ortega-method': {
    title: 'Solving the 2x2',
    description: 'Transition your 3x3 solving skills to the 2x2 Pocket Cube: master first-layer construction, top-layer orientation, and corner permutation.',
    category: 'Solving Other Cubes',
    estimatedMinutes: 10,
  },
  'solving-the-4x4': {
    title: 'Solving the 4x4',
    description: 'Master the 4x4 Revenge cube using the Reduction method: construct 2x2 center blocks, pair 24 wing edges, solve like a 3x3, and correct OLL and PLL parities.',
    category: 'Solving Other Cubes',
    estimatedMinutes: 15,
  },
  'other-cubes-solving-4x4': {
    title: 'Solving the 4x4',
    description: 'Master the 4x4 Revenge cube using the Reduction method: construct 2x2 center blocks, pair 24 wing edges, solve like a 3x3, and correct OLL and PLL parities.',
    category: 'Solving Other Cubes',
    estimatedMinutes: 15,
  },
  'solving-the-5x5': {
    title: 'Solving the 5x5',
    description: 'Scale the Reduction method to the 5x5 Professor Cube: build 3x3 center blocks around fixed centers, group 3-piece edge triplets (tredges), and master wing parity.',
    category: 'Solving Other Cubes',
    estimatedMinutes: 15,
  },
  'other-cubes-solving-5x5': {
    title: 'Solving the 5x5',
    description: 'Scale the Reduction method to the 5x5 Professor Cube: build 3x3 center blocks around fixed centers, group 3-piece edge triplets (tredges), and master wing parity.',
    category: 'Solving Other Cubes',
    estimatedMinutes: 15,
  },
  'what-cube-should-you-buy': {
    title: 'What Cube Should You Buy?',
    description: 'A comprehensive, honest hardware guide: understand magnetic positioning, tension systems, budget tiers, and find the perfect cube for your skill level.',
    category: 'Cubing Guides & Resources',
    estimatedMinutes: 10,
  },
  'guides-what-cube-to-buy': {
    title: 'What Cube Should You Buy?',
    description: 'A comprehensive, honest hardware guide: understand magnetic positioning, tension systems, budget tiers, and find the perfect cube for your skill level.',
    category: 'Cubing Guides & Resources',
    estimatedMinutes: 10,
  },
  'taking-care-of-your-cube': {
    title: 'Taking Care of Your Cube',
    description: 'Learn essential daily maintenance, dust prevention, piece cleaning, safe storage, and handling habits to keep your speedcube performing like new.',
    category: 'Cubing Guides & Resources',
    estimatedMinutes: 7,
  },
  'guides-taking-care-of-cube': {
    title: 'Taking Care of Your Cube',
    description: 'Learn essential daily maintenance, dust prevention, piece cleaning, safe storage, and handling habits to keep your speedcube performing like new.',
    category: 'Cubing Guides & Resources',
    estimatedMinutes: 7,
  },
  'lubrication-and-maintenance': {
    title: 'Lubrication & Maintenance',
    description: 'Master speedcube lubrication: understand silicone viscosities, fast vs control lubes, step-by-step piece application, core lubing, and cleaning old residue.',
    category: 'Cubing Guides & Resources',
    estimatedMinutes: 8,
  },
  'guides-lubrication-maintenance': {
    title: 'Lubrication & Maintenance',
    description: 'Master speedcube lubrication: understand silicone viscosities, fast vs control lubes, step-by-step piece application, core lubing, and cleaning old residue.',
    category: 'Cubing Guides & Resources',
    estimatedMinutes: 8,
  },
  'maintaining-and-adjusting-magnetic-cubes': {
    title: 'Maintaining & Adjusting Magnetic Cubes',
    description: 'Understand modern speedcube adjustment systems: tension screws, spring compression, MagLev magnetic repulsion, ball-cores, and step-by-step tuning workflows.',
    category: 'Cubing Guides & Resources',
    estimatedMinutes: 8,
  },
  'guides-magnetic-cube-maintenance': {
    title: 'Maintaining & Adjusting Magnetic Cubes',
    description: 'Understand modern speedcube adjustment systems: tension screws, spring compression, MagLev magnetic repulsion, ball-cores, and step-by-step tuning workflows.',
    category: 'Cubing Guides & Resources',
    estimatedMinutes: 8,
  },
  'wca-and-official-cubing': {
    title: 'WCA & Official Cubing',
    description: 'Explore the World Cube Association (WCA): official regulations, 17 recognized events, timing standards, delegates, and the global competitive community.',
    category: 'Cubing Guides & Resources',
    estimatedMinutes: 8,
  },
  'guides-wca-official-cubing': {
    title: 'WCA & Official Cubing',
    description: 'Explore the World Cube Association (WCA): official regulations, 17 recognized events, timing standards, delegates, and the global competitive community.',
    category: 'Cubing Guides & Resources',
    estimatedMinutes: 8,
  },
  'cubing-competitions-and-events': {
    title: 'Cubing Competitions & Events',
    description: 'A complete first-timer guide to speedcubing tournaments: registration, venue check-in, group calls, the 15-second inspection ritual, and competition etiquette.',
    category: 'Cubing Guides & Resources',
    estimatedMinutes: 10,
  },
  'guides-cubing-competitions': {
    title: 'Cubing Competitions & Events',
    description: 'A complete first-timer guide to speedcubing tournaments: registration, venue check-in, group calls, the 15-second inspection ritual, and competition etiquette.',
    category: 'Cubing Guides & Resources',
    estimatedMinutes: 10,
  },
};

export function WhatNext({
  next,
  related = [],
  explore = [],
  className = '',
  style = {},
}) {
  const navigate = useNavigate();

  // Helper to resolve card info from string slug or object
  const resolveLesson = (item) => {
    if (!item) return null;
    if (typeof item === 'object') {
      return {
        slug: item.slug || item.id,
        title: item.title,
        description: item.description,
        estimatedMinutes: item.estimatedMinutes || item.time,
        category: item.category,
      };
    }
    const cleanSlug = String(item).replace(/^notation-|^getting-started-/, '');
    const fallback = LESSON_CATALOG_FALLBACKS[cleanSlug] || {};
    return {
      slug: cleanSlug,
      title: fallback.title || cleanSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: fallback.description || 'Continue your cubing journey.',
      estimatedMinutes: fallback.estimatedMinutes || 5,
      category: fallback.category || 'Trainer',
    };
  };

  const nextLesson = resolveLesson(next);
  const relatedList = (Array.isArray(related) ? related : [related])
    .map(resolveLesson)
    .filter(Boolean);
  const exploreList = (Array.isArray(explore) ? explore : [explore])
    .map(resolveLesson)
    .filter(Boolean);

  const handleCardClick = (slug) => {
    if (slug) {
      navigate(`/app/trainer/lesson/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`cubit-trainer-what-next ${className}`}
      style={{
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '1px solid var(--border-primary, #2b2b35)',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-heading, sans-serif)',
          fontSize: '22px',
          fontWeight: '700',
          color: 'var(--text-primary, #fafafa)',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Compass size={20} color="var(--brand-primary, #572ff7)" />
        What&apos;s Next?
      </h2>

      {/* Primary Next Lesson Hero Card */}
      {nextLesson && (
        <div
          onClick={() => handleCardClick(nextLesson.slug)}
          style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(87, 47, 247, 0.18), rgba(23, 23, 28, 0.95))',
            border: '1.5px solid rgba(87, 47, 247, 0.4)',
            boxShadow: '0 8px 24px rgba(87, 47, 247, 0.12)',
            cursor: 'pointer',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--brand-primary, #572ff7)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(87, 47, 247, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(87, 47, 247, 0.4)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(87, 47, 247, 0.12)';
          }}
        >
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--brand-ter, #bc8be0)',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={13} color="var(--brand-ter, #bc8be0)" />
              Next Recommended Lesson
            </div>
            <div
              style={{
                fontSize: '17px',
                fontWeight: '700',
                color: '#ffffff',
                fontFamily: 'var(--font-heading, sans-serif)',
                marginBottom: '4px',
              }}
            >
              {nextLesson.title}
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary, #a8a8b5)',
                lineHeight: '1.4',
              }}
            >
              {nextLesson.description}
            </div>
          </div>

          <button
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--brand-primary, #572ff7)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(87, 47, 247, 0.35)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <span>Start Lesson</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Secondary Related / Explore Columns */}
      {(relatedList.length > 0 || exploreList.length > 0) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
            marginTop: '12px',
          }}
        >
          {relatedList.map((item) => (
            <div
              key={item.slug}
              onClick={() => handleCardClick(item.slug)}
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-primary, #2b2b35)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(87, 47, 247, 0.4)';
                e.currentTarget.style.backgroundColor = 'rgba(87, 47, 247, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-primary, #2b2b35)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text-muted, #7a7a88)',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <BookOpen size={12} />
                Related Topic
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary, #fafafa)',
                  marginBottom: '2px',
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary, #a8a8b5)',
                  lineHeight: '1.3',
                }}
              >
                {item.description}
              </div>
            </div>
          ))}

          {exploreList.map((item) => (
            <div
              key={item.slug}
              onClick={() => handleCardClick(item.slug)}
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-primary, #2b2b35)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(167, 104, 212, 0.4)';
                e.currentTarget.style.backgroundColor = 'rgba(167, 104, 212, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-primary, #2b2b35)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text-muted, #7a7a88)',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Compass size={12} />
                Explore
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary, #fafafa)',
                  marginBottom: '2px',
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary, #a8a8b5)',
                  lineHeight: '1.3',
                }}
              >
                {item.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WhatNext;
