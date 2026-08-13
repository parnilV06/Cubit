/**
 * Comprehensive Validation Test Suite for Trainer MDX Pipeline
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseMDX, parseFrontmatter, parseJSXAttributes } from '../src/components/trainer/mdx/mdxParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? `(${details})` : ''}`);
  }
}

console.log('\n======================================================');
console.log('🧪 RUNNING TRAINER MDX PIPELINE TEST SUITE');
console.log('======================================================\n');

// 1. Frontmatter Parsing Tests
console.log('--- 1. Frontmatter Parsing ---');
const rawMdxSample = `---
title: Basic Face Notation
description: Learn the six fundamental face moves
difficulty: BEGINNER
category: Cube Notation
estimatedMinutes: 6
order: 1
---

# Lesson Title

This is content.`;

const { frontmatter, body } = parseFrontmatter(rawMdxSample);
assert(frontmatter.title === 'Basic Face Notation', 'Frontmatter title extracted correctly');
assert(frontmatter.difficulty === 'BEGINNER', 'Frontmatter difficulty extracted correctly');
assert(frontmatter.estimatedMinutes === 6, 'Frontmatter numeric estimatedMinutes parsed as number');
assert(frontmatter.order === 1, 'Frontmatter numeric order parsed as number');
assert(body.startsWith('# Lesson Title'), 'Body correctly separated from frontmatter');

// 2. JSX Attribute Parsing Tests
console.log('\n--- 2. JSX Attribute Parsing ---');
const attrSample = 'dimension="3x3" showReset={true} speed={1.5} moves={["R", "U", "F"]} flag';
const parsedAttrs = parseJSXAttributes(attrSample);
assert(parsedAttrs.dimension === '3x3', 'String attribute parsed', JSON.stringify(parsedAttrs));
assert(parsedAttrs.showReset === true, 'Boolean expression {true} parsed', JSON.stringify(parsedAttrs));
assert(parsedAttrs.speed === 1.5, 'Float numeric expression {1.5} parsed', JSON.stringify(parsedAttrs));
assert(Array.isArray(parsedAttrs.moves) && parsedAttrs.moves.length === 3 && parsedAttrs.moves[0] === 'R', 'Array expression {["R", "U", "F"]} parsed', JSON.stringify(parsedAttrs));
assert(parsedAttrs.flag === true, 'Bare boolean flag attribute parsed as true', JSON.stringify(parsedAttrs));

// 3. Block AST Parsing Tests
console.log('\n--- 3. Markdown Block AST Parsing ---');
const testDoc = `
# Heading 1
## Heading 2 With Special Characters & Symbols!
### Heading 3

This is a **bold** and *italic* paragraph with \`inline code\` and <kbd>Space</kbd>.

- Bullet point 1
- Bullet point 2
- Bullet point 3

1. Step one
2. Step two

> [!NOTE]
> This is a callout alert box.

> Simple blockquote

\`\`\`javascript
const x = 42;
\`\`\`

| Header A | Header B |
| :--- | :--- |
| Val 1 | Val 2 |
| Val 3 | Val 4 |

---

<CubeViewer dimension="3x3" showReset={true} />

<Callout type="tip">
Remember to practice daily!
</Callout>
`;

const ast = parseMDX(testDoc);
assert(Array.isArray(ast), 'parseMDX returns array of AST nodes');

const headings = ast.filter((n) => n.type === 'heading');
assert(headings.length === 3, 'All 3 headings parsed');
assert(headings[0].level === 1 && headings[0].text === 'Heading 1' && headings[0].id === 'heading-1', 'Heading 1 ID generated');
assert(headings[1].id === 'heading-2-with-special-characters-symbols', 'Slug sanitized properly');

const lists = ast.filter((n) => n.type === 'list');
assert(lists.length === 2, 'Both unordered and ordered lists parsed');
assert(lists[0].listType === 'unordered' && lists[0].items.length === 3, 'Unordered list has 3 items');
assert(lists[1].listType === 'ordered' && lists[1].items.length === 2, 'Ordered list has 2 items');

const callouts = ast.filter((n) => n.type === 'callout');
assert(callouts.length === 1 && callouts[0].alertType === 'note', 'Alert Callout parsed');

const codeBlocks = ast.filter((n) => n.type === 'code_block');
assert(codeBlocks.length === 1 && codeBlocks[0].language === 'javascript' && codeBlocks[0].code.includes('const x = 42;'), 'Code block parsed');

const tables = ast.filter((n) => n.type === 'table');
assert(tables.length === 1 && tables[0].headers.length === 2 && tables[0].rows.length === 2, 'GFM table parsed with headers and rows');

const breaks = ast.filter((n) => n.type === 'thematic_break');
assert(breaks.length === 1, 'Thematic break parsed');

const jsxNodes = ast.filter((n) => n.type === 'jsx_component');
assert(jsxNodes.length === 2, 'Both self-closing and paired JSX components parsed');
assert(jsxNodes[0].component === 'CubeViewer' && jsxNodes[0].props.dimension === '3x3' && jsxNodes[0].props.showReset === true, 'CubeViewer props match');
assert(jsxNodes[1].component === 'Callout' && jsxNodes[1].props.type === 'tip' && jsxNodes[1].children.includes('Remember to practice daily!'), 'Callout children match');

// 4. Golden Lesson Content Verification
console.log('\n--- 4. Golden Lesson Verification ---');
const goldenLessonPath = path.resolve(__dirname, '../../content/trainer/basic-face-notation.mdx');
assert(fs.existsSync(goldenLessonPath), 'Golden Lesson basic-face-notation.mdx exists on disk');

const goldenContent = fs.readFileSync(goldenLessonPath, 'utf8');
const { frontmatter: glFm, body: glBody } = parseFrontmatter(goldenContent);
assert(glFm.title === 'Basic Face Notation', `Golden lesson title is "${glFm.title}"`);
assert(glFm.difficulty === 'BEGINNER', 'Golden lesson difficulty is BEGINNER');
assert(glFm.category === 'Cube Notation', 'Golden lesson category is Cube Notation');
assert(glFm.estimatedMinutes === 6, 'Golden lesson estimatedMinutes is 6');

const glAst = parseMDX(glBody);
const glComponents = glAst.filter((n) => n.type === 'jsx_component').map((n) => n.component);
console.log('    Found interactive components in Golden Lesson:', glComponents);
assert(glComponents.includes('CubeViewer'), 'Golden lesson includes <CubeViewer />');
assert(glComponents.includes('NotationTrainer'), 'Golden lesson includes <NotationTrainer />');
assert(glComponents.includes('AlgorithmPlayer'), 'Golden lesson includes <AlgorithmPlayer />');
assert(glComponents.includes('WhatNext'), 'Golden lesson includes <WhatNext />');

console.log('\n======================================================');
console.log(`📊 RESULTS: ${passedTests}/${totalTests} Tests Passed`);
console.log('======================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
