/**
 * Comprehensive Validation Script for All Cubit Trainer Lessons
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseMDX, parseFrontmatter } from '../src/components/trainer/mdx/mdxParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.resolve(__dirname, '../../content/trainer');

console.log('\n======================================================');
console.log('🔍 VALIDATING ALL TRAINER LESSONS (MDX & METADATA)');
console.log('======================================================\n');

const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx'));
let totalErrors = 0;
let validatedCount = 0;

const MODULE_04_SLUGS = [
  'from-solving-to-speedsolving',
  'inspection',
  'cross-efficiency',
  'turning-and-finger-tricks',
  'lookahead',
  'reducing-pauses',
  'understanding-tps',
];

for (const file of files) {
  const filePath = path.join(contentDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const slug = file.replace(/\.mdx$/, '');

  try {
    const { frontmatter, body } = parseFrontmatter(raw);

    // 1. Frontmatter Validation
    if (!frontmatter.title) {
      console.error(`❌ [${file}] Missing frontmatter.title`);
      totalErrors++;
    }
    if (!frontmatter.difficulty) {
      console.error(`❌ [${file}] Missing frontmatter.difficulty`);
      totalErrors++;
    }
    if (!frontmatter.category) {
      console.error(`❌ [${file}] Missing frontmatter.category`);
      totalErrors++;
    }
    if (typeof frontmatter.estimatedMinutes !== 'number') {
      console.error(`❌ [${file}] Missing or non-numeric frontmatter.estimatedMinutes`);
      totalErrors++;
    }
    if (typeof frontmatter.order !== 'number') {
      console.error(`❌ [${file}] Missing or non-numeric frontmatter.order`);
      totalErrors++;
    }

    // 2. MDX AST Parsing
    const ast = parseMDX(body);
    if (!Array.isArray(ast) || ast.length === 0) {
      console.error(`❌ [${file}] AST parsed to empty or non-array`);
      totalErrors++;
    }

    // 3. Component Presence
    const jsxNodes = ast.filter((n) => n.type === 'jsx_component');
    const hasWhatNext = jsxNodes.some((n) => n.component === 'WhatNext');
    if (!hasWhatNext) {
      console.error(`❌ [${file}] Missing <WhatNext /> component!`);
      totalErrors++;
    }

    // 4. Anti-Slop Check (Forbidden Em-Dashes in non-code content)
    // Exclude code blocks from check
    const nonCodeBlocks = ast.filter((n) => n.type !== 'code_block');
    const emDashFound = nonCodeBlocks.some((n) => {
      const text = JSON.stringify(n);
      return text.includes('—');
    });
    if (emDashFound) {
      console.warn(`⚠️  [${file}] Warning: Contains em-dash (—). Consider replacing with colons or parentheses.`);
    }

    const componentNames = jsxNodes.map((n) => n.component);
    console.log(`✅ [${slug}] Validated (${ast.length} AST blocks, Components: [${componentNames.join(', ')}])`);
    validatedCount++;
  } catch (err) {
    console.error(`❌ [${file}] Parsing threw exception:`, err.message);
    totalErrors++;
  }
}

console.log('\n======================================================');
console.log(`📊 RESULTS: ${validatedCount}/${files.length} Lessons Validated. Errors: ${totalErrors}`);
console.log('======================================================\n');

// Specific check that all 7 Module 04 files exist
for (const slug of MODULE_04_SLUGS) {
  const exists = fs.existsSync(path.join(contentDir, `${slug}.mdx`));
  if (!exists) {
    console.error(`❌ Missing canonical Module 04 lesson file: ${slug}.mdx`);
    totalErrors++;
  }
}

if (totalErrors > 0) {
  process.exit(1);
} else {
  console.log('🎉 All Trainer Lessons and Module 04 curriculum are 100% verified!');
}
