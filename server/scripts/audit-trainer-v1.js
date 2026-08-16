const fs = require('fs');
const path = require('path');
const { prisma } = require('../config/database');

const CANONICAL_CURRICULUM = [
  {
    moduleNumber: 1,
    moduleId: 'getting-started',
    moduleTitle: 'Getting Started',
    category: 'Getting Started',
    lessons: [
      { order: 1, slug: 'meet-the-rubiks-cube', title: "Meet the Rubik's Cube", difficulty: 'BEGINNER', est: 5 },
      { order: 2, slug: 'cube-types', title: 'Cube Types', difficulty: 'BEGINNER', est: 6 },
      { order: 3, slug: 'a-brief-history-of-the-cube', title: 'A Brief History of the Cube', difficulty: 'BEGINNER', est: 8 },
      { order: 4, slug: 'what-is-speedcubing', title: 'What is Speedcubing?', difficulty: 'BEGINNER', est: 7 },
      { order: 5, slug: 'fun-cube-patterns', title: 'Fun Cube Patterns', difficulty: 'BEGINNER', est: 8 },
    ]
  },
  {
    moduleNumber: 2,
    moduleId: 'cube-notation',
    moduleTitle: 'Cube Notation',
    category: 'Cube Notation',
    lessons: [
      { order: 1, slug: 'basic-face-notation', title: 'Basic Face Notation', difficulty: 'BEGINNER', est: 6 },
      { order: 2, slug: 'prime-double-turns', title: 'Prime & Double Turns', difficulty: 'BEGINNER', est: 6 },
      { order: 3, slug: 'whole-cube-rotations', title: 'Whole Cube Rotations', difficulty: 'BEGINNER', est: 6 },
      { order: 4, slug: 'wide-moves', title: 'Wide Moves', difficulty: 'INTERMEDIATE', est: 7 },
      { order: 5, slug: '4x4-5x5-notation', title: '4x4 & 5x5 Notation', difficulty: 'INTERMEDIATE', est: 8 },
    ]
  },
  {
    moduleNumber: 3,
    moduleId: 'solve-your-first-cube',
    moduleTitle: 'Solve Your First Cube',
    category: 'Solve Your First Cube',
    lessons: [
      { order: 1, slug: 'understanding-the-beginner-method', title: 'Understanding the Beginner Method', difficulty: 'BEGINNER', est: 5 },
      { order: 2, slug: 'make-the-white-cross', title: 'Make the White Cross', difficulty: 'BEGINNER', est: 8 },
      { order: 3, slug: 'solve-the-first-layer-corners', title: 'Solve the First-Layer Corners', difficulty: 'BEGINNER', est: 8 },
      { order: 4, slug: 'solve-the-middle-layer', title: 'Solve the Middle Layer', difficulty: 'BEGINNER', est: 10 },
      { order: 5, slug: 'make-the-yellow-cross', title: 'Make the Yellow Cross', difficulty: 'BEGINNER', est: 8 },
      { order: 6, slug: 'solve-the-yellow-edges', title: 'Solve the Yellow Edges', difficulty: 'BEGINNER', est: 8 },
      { order: 7, slug: 'position-the-yellow-corners', title: 'Position the Yellow Corners', difficulty: 'BEGINNER', est: 8 },
      { order: 8, slug: 'orient-the-yellow-corners', title: 'Orient the Yellow Corners', difficulty: 'BEGINNER', est: 8 },
      { order: 9, slug: 'bring-it-all-together', title: 'Bring It All Together', difficulty: 'BEGINNER', est: 10 },
    ]
  },
  {
    moduleNumber: 4,
    moduleId: 'speedcubing-fundamentals',
    moduleTitle: 'Speedcubing Fundamentals',
    category: 'Speedcubing Fundamentals',
    lessons: [
      { order: 1, slug: 'from-solving-to-speedsolving', title: 'From Solving to Speedsolving', difficulty: 'BEGINNER', est: 8 },
      { order: 2, slug: 'inspection', title: 'Inspection', difficulty: 'INTERMEDIATE', est: 8 },
      { order: 3, slug: 'cross-efficiency', title: 'Cross Efficiency', difficulty: 'INTERMEDIATE', est: 8 },
      { order: 4, slug: 'turning-and-finger-tricks', title: 'Turning & Finger Tricks', difficulty: 'BEGINNER', est: 8 },
      { order: 5, slug: 'lookahead', title: 'Lookahead', difficulty: 'INTERMEDIATE', est: 8 },
      { order: 6, slug: 'reducing-pauses', title: 'Reducing Pauses', difficulty: 'INTERMEDIATE', est: 8 },
      { order: 7, slug: 'understanding-tps', title: 'Understanding TPS', difficulty: 'INTERMEDIATE', est: 7 },
    ]
  },
  {
    moduleNumber: 5,
    moduleId: 'cfop',
    moduleTitle: 'CFOP',
    category: 'CFOP',
    lessons: [
      { order: 1, slug: 'cfop-what-is-cfop', title: 'What is CFOP?', difficulty: 'BEGINNER', est: 8 },
      { order: 2, slug: 'cfop-cross', title: 'Cross', difficulty: 'INTERMEDIATE', est: 8 },
      { order: 3, slug: 'cfop-f2l-introduction', title: 'F2L Introduction', difficulty: 'INTERMEDIATE', est: 10 },
      { order: 4, slug: 'cfop-f2l-cases', title: 'F2L Cases', difficulty: 'INTERMEDIATE', est: 12 },
      { order: 5, slug: 'cfop-f2l-efficiency', title: 'F2L Efficiency', difficulty: 'INTERMEDIATE', est: 10 },
      { order: 6, slug: 'cfop-2look-oll', title: '2-Look OLL', difficulty: 'INTERMEDIATE', est: 10 },
      { order: 7, slug: 'cfop-full-oll', title: 'Full OLL', difficulty: 'ADVANCED', est: 15 },
      { order: 8, slug: 'cfop-2look-pll', title: '2-Look PLL', difficulty: 'INTERMEDIATE', est: 10 },
      { order: 9, slug: 'cfop-full-pll', title: 'Full PLL', difficulty: 'ADVANCED', est: 15 },
      { order: 10, slug: 'cfop-putting-it-together', title: 'Putting CFOP Together', difficulty: 'INTERMEDIATE', est: 10 },
    ]
  },
  {
    moduleNumber: 6,
    moduleId: 'solving-other-cubes',
    moduleTitle: 'Solving Other Cubes',
    category: 'Solving Other Cubes',
    lessons: [
      { order: 1, slug: 'solving-the-2x2', title: 'Solving the 2x2', difficulty: 'BEGINNER', est: 10 },
      { order: 2, slug: 'solving-the-4x4', title: 'Solving the 4x4', difficulty: 'INTERMEDIATE', est: 15 },
      { order: 3, slug: 'solving-the-5x5', title: 'Solving the 5x5', difficulty: 'INTERMEDIATE', est: 15 },
    ]
  },
  {
    moduleNumber: 7,
    moduleId: 'algorithms-patterns',
    moduleTitle: 'Algorithms & Patterns',
    category: 'Algorithms & Patterns',
    lessons: [
      { order: 1, slug: 'sexy-move', title: 'Sexy Move', difficulty: 'BEGINNER', est: 5 },
      { order: 2, slug: 'sledgehammer', title: 'Sledgehammer', difficulty: 'BEGINNER', est: 5 },
      { order: 3, slug: 'checkerboard', title: 'Checkerboard', difficulty: 'BEGINNER', est: 5 },
      { order: 4, slug: 'snake', title: 'Snake', difficulty: 'BEGINNER', est: 5 },
      { order: 5, slug: 'cube-in-a-cube', title: 'Cube in a Cube', difficulty: 'INTERMEDIATE', est: 6 },
      { order: 6, slug: 'more-fun-algorithms', title: 'More Fun Algorithms', difficulty: 'BEGINNER', est: 7 },
    ]
  },
  {
    moduleNumber: 8,
    moduleId: 'cubing-guides-resources',
    moduleTitle: 'Cubing Guides & Resources',
    category: 'Cubing Guides & Resources',
    lessons: [
      { order: 1, slug: 'what-cube-should-you-buy', title: 'What Cube Should You Buy?', difficulty: 'BEGINNER', est: 10 },
      { order: 2, slug: 'taking-care-of-your-cube', title: 'Taking Care of Your Cube', difficulty: 'BEGINNER', est: 7 },
      { order: 3, slug: 'lubrication-and-maintenance', title: 'Lubrication & Maintenance', difficulty: 'INTERMEDIATE', est: 8 },
      { order: 4, slug: 'maintaining-and-adjusting-magnetic-cubes', title: 'Maintaining & Adjusting Magnetic Cubes', difficulty: 'INTERMEDIATE', est: 8 },
      { order: 5, slug: 'wca-and-official-cubing', title: 'WCA & Official Cubing', difficulty: 'BEGINNER', est: 8 },
      { order: 6, slug: 'cubing-competitions-and-events', title: 'Cubing Competitions & Events', difficulty: 'BEGINNER', est: 10 },
    ]
  }
];

async function runAudit() {
  console.log('=== STARTING DEEP AUDIT ===\n');

  // 1. Audit DB Records
  const dbLessons = await prisma.lesson.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
  console.log('Database total lessons count:', dbLessons.length);

  const dbMap = new Map();
  dbLessons.forEach(l => dbMap.set(l.slug, l));

  // 2. Audit MDX files
  const mdxDir = path.join(__dirname, '..', '..', 'content', 'trainer');
  const mdxFiles = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));
  console.log('MDX total files count:', mdxFiles.length);

  let totalCanonicalExpected = 0;
  const moduleSummary = [];
  const allLessonDetails = [];
  const navigationGraph = [];

  for (const mod of CANONICAL_CURRICULUM) {
    totalCanonicalExpected += mod.lessons.length;
    let modPass = true;
    const notes = [];

    for (const expLesson of mod.lessons) {
      const mdxFile = path.join(mdxDir, expLesson.slug + '.mdx');
      if (!fs.existsSync(mdxFile)) {
        notes.push('Missing MDX: ' + expLesson.slug);
        modPass = false;
        continue;
      }

      const content = fs.readFileSync(mdxFile, 'utf8');
      const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!fmMatch) {
        notes.push('Invalid frontmatter: ' + expLesson.slug);
        modPass = false;
        continue;
      }

      const fm = {};
      fmMatch[1].split('\n').forEach(line => {
        const p = line.split(':');
        if (p.length >= 2) fm[p[0].trim()] = p.slice(1).join(':').trim();
      });

      if (fm.category !== mod.category) {
        notes.push('Category mismatch in MDX for ' + expLesson.slug + ' (got: ' + fm.category + ', exp: ' + mod.category + ')');
        modPass = false;
      }
      if (parseInt(fm.order, 10) !== expLesson.order) {
        notes.push('Order mismatch in MDX for ' + expLesson.slug + ' (got: ' + fm.order + ', exp: ' + expLesson.order + ')');
        modPass = false;
      }

      // Check DB record
      const dbRec = dbMap.get(expLesson.slug);
      if (!dbRec) {
        notes.push('Missing DB record: ' + expLesson.slug);
        modPass = false;
      } else {
        if (dbRec.category !== mod.category) {
          notes.push('DB category mismatch for ' + expLesson.slug);
          modPass = false;
        }
        if (dbRec.order !== expLesson.order) {
          notes.push('DB order mismatch for ' + expLesson.slug);
          modPass = false;
        }
        if (!dbRec.published) {
          notes.push('DB record unpublished for ' + expLesson.slug);
          modPass = false;
        }
      }

      // Parse WhatNext props
      const nextMatch = content.match(/next=["']([^"']+)["']/);
      const relatedMatch = content.match(/related=\{([^}]+)\}/);
      const exploreMatch = content.match(/explore=\{([^}]+)\}/);

      const next = nextMatch ? nextMatch[1] : null;
      let related = [];
      let explore = [];
      if (relatedMatch) {
        try { related = JSON.parse(relatedMatch[1].replace(/'/g, '"')); } catch(e) {}
      }
      if (exploreMatch) {
        try { explore = JSON.parse(exploreMatch[1].replace(/'/g, '"')); } catch(e) {}
      }

      navigationGraph.push({
        module: mod.moduleNumber,
        slug: expLesson.slug,
        title: expLesson.title,
        next,
        related,
        explore
      });

      // Check interactive components used
      const hasCubeViewer = /<CubeViewer[\s\S]*?\/>/.test(content);
      const hasAlgorithmPlayer = /<AlgorithmPlayer[\s\S]*?\/>/.test(content);
      const hasNotationTrainer = /<NotationTrainer[\s\S]*?\/>/.test(content);
      const hasWhatNext = /<WhatNext[\s\S]*?\/>/.test(content);

      allLessonDetails.push({
        module: mod.moduleNumber,
        slug: expLesson.slug,
        title: expLesson.title,
        difficulty: fm.difficulty,
        estMinutes: parseInt(fm.estimatedMinutes, 10),
        components: [
          hasCubeViewer ? 'CubeViewer' : null,
          hasAlgorithmPlayer ? 'AlgorithmPlayer' : null,
          hasNotationTrainer ? 'NotationTrainer' : null,
          hasWhatNext ? 'WhatNext' : null,
        ].filter(Boolean).join(', ')
      });
    }

    moduleSummary.push({
      moduleNumber: mod.moduleNumber,
      moduleTitle: mod.moduleTitle,
      expectedCount: mod.lessons.length,
      actualCount: mod.lessons.filter(l => fs.existsSync(path.join(mdxDir, l.slug + '.mdx'))).length,
      status: modPass ? 'PASS' : 'FAIL',
      notes: notes.join('; ') || 'All lessons present & verified'
    });
  }

  console.log('\n--- MODULE AUDIT SUMMARY ---');
  console.table(moduleSummary);

  console.log('\n--- NAVIGATION GRAPH INTEGRITY CHECK ---');
  const allKnownSlugs = new Set(CANONICAL_CURRICULUM.flatMap(m => m.lessons.map(l => l.slug)));
  allKnownSlugs.add('cube-notation');
  allKnownSlugs.add('guides-what-cube-to-buy');
  allKnownSlugs.add('guides-taking-care-of-cube');
  allKnownSlugs.add('guides-lubrication-maintenance');
  allKnownSlugs.add('guides-magnetic-cube-maintenance');
  allKnownSlugs.add('guides-wca-official-cubing');
  allKnownSlugs.add('guides-cubing-competitions');
  allKnownSlugs.add('other-cubes-solving-2x2');
  allKnownSlugs.add('other-cubes-solving-4x4');
  allKnownSlugs.add('other-cubes-solving-5x5');
  allKnownSlugs.add('2x2-ortega-method');

  let brokenLinks = 0;
  navigationGraph.forEach(n => {
    if (n.next && !allKnownSlugs.has(n.next)) {
      console.warn(`[BROKEN NEXT] in ${n.slug} -> ${n.next}`);
      brokenLinks++;
    }
    n.related.forEach(r => {
      if (!allKnownSlugs.has(r)) {
        console.warn(`[BROKEN RELATED] in ${n.slug} -> ${r}`);
        brokenLinks++;
      }
    });
    n.explore.forEach(e => {
      if (!allKnownSlugs.has(e)) {
        console.warn(`[BROKEN EXPLORE] in ${n.slug} -> ${e}`);
        brokenLinks++;
      }
    });
  });

  if (brokenLinks === 0) {
    console.log('✅ All navigation links point to valid canonical lessons or registered aliases!');
  } else {
    console.warn(`⚠️ Found ${brokenLinks} broken navigation references!`);
  }

  console.log('\nTotal Canonical Lessons Expected:', totalCanonicalExpected);
  console.log('Total Lessons in Database:', dbLessons.length);
  console.log('Total MDX files in content/trainer:', mdxFiles.length);

  await prisma.$disconnect();
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
