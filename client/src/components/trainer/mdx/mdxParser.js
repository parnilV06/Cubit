/**
 * Cubit Trainer — Pure Deterministic MDX / Markdown AST Parser
 * 
 * Safely parses Markdown and embedded JSX component tags into a structured AST
 * without using eval() or arbitrary code execution.
 */

/**
 * Strips and parses YAML-style frontmatter (--- ... ---) from MDX string.
 * @param {string} rawText 
 * @returns {{ frontmatter: Object, content: string, body: string }}
 */
export function parseFrontmatter(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { frontmatter: {}, content: '', body: '' };
  }

  const trimmed = rawText.trim();
  if (!trimmed.startsWith('---')) {
    return { frontmatter: {}, content: trimmed, body: trimmed };
  }

  const match = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: trimmed, body: trimmed };
  }

  const yamlBlock = match[1];
  const content = match[2].trim();
  const frontmatter = {};

  yamlBlock.split(/\r?\n/).forEach((line) => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();

      // Parse booleans and numbers
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (!isNaN(Number(val)) && val !== '') val = Number(val);
      else if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);

      frontmatter[key] = val;
    }
  });

  return { frontmatter, content, body: content };
}

/**
 * Safely evaluates a primitive expression without eval().
 * Supports numbers, booleans, arrays, simple objects, and strings.
 * @param {string} expr 
 * @returns {any}
 */
function evaluateSafeExpression(expr) {
  if (!expr) return undefined;
  if (expr === 'true') return true;
  if (expr === 'false') return false;
  if (expr === 'null') return null;
  if (expr === 'undefined') return undefined;

  if (!isNaN(Number(expr))) return Number(expr);

  // String in quotes
  if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
    return expr.slice(1, -1);
  }

  // JSON Array or Object (using single quotes replaced by double quotes for valid JSON)
  if ((expr.startsWith('[') && expr.endsWith(']')) || (expr.startsWith('{') && expr.endsWith('}'))) {
    try {
      const jsonCandidate = expr
        .replace(/'/g, '"')
        .replace(/([a-zA-Z0-9_-]+):/g, '"$1":'); // quote keys
      return JSON.parse(jsonCandidate);
    } catch (e) {
      // Fallback: parse array manually if simple list of strings
      if (expr.startsWith('[') && expr.endsWith(']')) {
        const inner = expr.slice(1, -1).trim();
        if (!inner) return [];
        return inner.split(',').map((item) => {
          const t = item.trim();
          if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
            return t.slice(1, -1);
          }
          return t;
        });
      }
      return expr;
    }
  }

  return expr;
}

/**
 * Parses JSX-style attributes string into a typed props dictionary.
 * Supports:
 *   str="value"
 *   num={123}
 *   bool (bare attribute) or bool={true} / bool={false}
 *   arr={["a", "b"]}
 *   obj={{ key: "val" }}
 * 
 * @param {string} attrString
 * @returns {Object}
 */
export function parseJSXAttributes(attrString) {
  const props = {};
  if (!attrString || !attrString.trim()) return props;

  let pos = 0;
  const len = attrString.length;

  while (pos < len) {
    // Skip whitespace
    while (pos < len && /\s/.test(attrString[pos])) pos++;
    if (pos >= len) break;

    // Match attribute name
    const nameMatch = attrString.slice(pos).match(/^[a-zA-Z0-9_-]+/);
    if (!nameMatch) {
      pos++;
      continue;
    }

    const propName = nameMatch[0];
    pos += propName.length;

    // Skip whitespace around '='
    while (pos < len && /\s/.test(attrString[pos])) pos++;

    if (pos < len && attrString[pos] === '=') {
      pos++; // skip '='
      while (pos < len && /\s/.test(attrString[pos])) pos++;

      if (pos < len) {
        const quoteChar = attrString[pos];
        if (quoteChar === '"' || quoteChar === "'") {
          // String literal
          pos++; // skip quote
          const endQuote = attrString.indexOf(quoteChar, pos);
          if (endQuote !== -1) {
            props[propName] = attrString.slice(pos, endQuote);
            pos = endQuote + 1;
          } else {
            props[propName] = attrString.slice(pos);
            pos = len;
          }
        } else if (quoteChar === '{') {
          // Expression in braces
          pos++; // skip '{'
          let depth = 1;
          const startExpr = pos;
          while (pos < len && depth > 0) {
            if (attrString[pos] === '{') depth++;
            else if (attrString[pos] === '}') depth--;
            pos++;
          }
          const expr = attrString.slice(startExpr, pos - 1).trim();
          props[propName] = evaluateSafeExpression(expr);
        } else {
          // Unquoted bare token
          const tokenMatch = attrString.slice(pos).match(/^[^\s>]+/);
          if (tokenMatch) {
            props[propName] = tokenMatch[0];
            pos += tokenMatch[0].length;
          }
        }
      }
    } else {
      // Bare boolean prop (e.g. `showReset`)
      props[propName] = true;
    }
  }

  return props;
}

/**
 * Parses Markdown / MDX text into a structured AST array.
 * 
 * @param {string} mdxText 
 * @returns {Array<Object>} AST block nodes
 */
export function parseMDX(mdxText) {
  const { content } = parseFrontmatter(mdxText);
  if (!content) return [];

  const lines = content.split(/\r?\n/);
  const ast = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Fenced Code Block (```lang ... ```)
    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing ```
      ast.push({
        type: 'code_block',
        language: language || 'text',
        code: codeLines.join('\n'),
      });
      continue;
    }

    // 2. Embedded JSX Component (e.g. <CubeViewer ... /> or <AlgorithmPlayer ... />)
    if (trimmed.startsWith('<') && /^<[A-Z][a-zA-Z0-9_]*/.test(trimmed)) {
      const tagMatch = trimmed.match(/^<([A-Z][a-zA-Z0-9_]*)/);
      const componentName = tagMatch[1];
      
      // Collect full opening tag across lines until '>' or '/>'
      let fullTag = '';
      while (i < lines.length) {
        fullTag += (fullTag ? ' ' : '') + lines[i].trim();
        if (lines[i].includes('>') || lines[i].includes('/>')) {
          i++;
          break;
        }
        i++;
      }

      const isSelfClosing = fullTag.includes('/>') || fullTag.endsWith('/>');
      
      // Extract raw attributes between <ComponentName and /> or >
      let rawAttributes = fullTag
        .replace(new RegExp(`^<${componentName}\\s*`), '')
        .replace(/\/>|>$/, '')
        .trim();

      let childrenContent = '';
      if (!isSelfClosing) {
        const closingTag = `</${componentName}>`;
        if (fullTag.includes(closingTag)) {
          // Tag opened and closed on same block
          const afterOpen = fullTag.slice(fullTag.indexOf('>') + 1);
          childrenContent = afterOpen.replace(closingTag, '').trim();
        } else {
          // Collect child lines until </ComponentName>
          const childLines = [];
          while (i < lines.length && !lines[i].trim().includes(closingTag)) {
            childLines.push(lines[i]);
            i++;
          }
          childrenContent = childLines.join('\n').trim();
          if (i < lines.length && lines[i].trim().includes(closingTag)) {
            i++; // skip closing tag
          }
        }
      }

      const props = parseJSXAttributes(rawAttributes);

      ast.push({
        type: 'jsx_component',
        component: componentName,
        props,
        children: childrenContent,
      });
      continue;
    }

    // 3. Headings (# H1, ## H2, ### H3, #### H4)
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      ast.push({
        type: 'heading',
        level,
        text,
        id,
      });
      i++;
      continue;
    }

    // 4. Horizontal Rule (---, ***, ___)
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      ast.push({ type: 'thematic_break' });
      i++;
      continue;
    }

    // 5. Blockquote / Alert Callout (> [!NOTE], > [!TIP], > quote)
    if (trimmed.startsWith('>')) {
      const quoteLines = [];
      let alertType = null;

      while (i < lines.length && lines[i].trim().startsWith('>')) {
        let contentLine = lines[i].trim().replace(/^>\s?/, '');
        
        // Check for GFM alert prefix: [!NOTE], [!TIP], [!WARNING], [!IMPORTANT], [!CAUTION]
        const alertMatch = contentLine.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|SUCCESS)\]/i);
        if (alertMatch && quoteLines.length === 0) {
          alertType = alertMatch[1].toLowerCase();
          contentLine = contentLine.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|SUCCESS)\]\s*/i, '');
        }

        if (contentLine) {
          quoteLines.push(contentLine);
        }
        i++;
      }

      if (alertType) {
        ast.push({
          type: 'callout',
          alertType,
          text: quoteLines.join('\n'),
        });
      } else {
        ast.push({
          type: 'blockquote',
          text: quoteLines.join('\n'),
        });
      }
      continue;
    }

    // 6. GFM Tables (| Header 1 | Header 2 |)
    const isTableSeparator = (str) => /^\|?\s*:?-+:?\s*(\|?\s*:?-+:?\s*)+\|?$/.test(str.trim());
    if (trimmed.startsWith('|') && lines[i + 1] && isTableSeparator(lines[i + 1])) {
      const headerRow = trimmed
        .split('|')
        .map((h) => h.trim())
        .filter((_, idx, arr) => (idx > 0 && idx < arr.length - 1) || (arr.length === 2));
      i += 2; // Skip header and separator row

      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const row = lines[i]
          .trim()
          .split('|')
          .map((cell) => cell.trim())
          .filter((_, idx, arr) => (idx > 0 && idx < arr.length - 1) || (arr.length === 2));
        if (row.length > 0) {
          rows.push(row);
        }
        i++;
      }

      ast.push({
        type: 'table',
        headers: headerRow,
        rows,
      });
      continue;
    }

    // 7. Lists (Unordered - / * or Ordered 1. )
    const isUnordered = /^[-*]\s+/.test(trimmed);
    const isOrdered = /^\d+\.\s+/.test(trimmed);

    if (isUnordered || isOrdered) {
      const listType = isOrdered ? 'ordered' : 'unordered';
      const items = [];

      while (i < lines.length) {
        const curr = lines[i].trim();
        if (isOrdered && /^\d+\.\s+/.test(curr)) {
          items.push(curr.replace(/^\d+\.\s+/, ''));
          i++;
        } else if (!isOrdered && /^[-*]\s+/.test(curr)) {
          items.push(curr.replace(/^[-*]\s+/, ''));
          i++;
        } else if (curr === '') {
          // Empty line might end list or separate items
          if (i + 1 < lines.length && (isOrdered ? /^\d+\.\s+/.test(lines[i + 1].trim()) : /^[-*]\s+/.test(lines[i + 1].trim()))) {
            i++;
          } else {
            break;
          }
        } else {
          break;
        }
      }

      ast.push({
        type: 'list',
        listType,
        items,
      });
      continue;
    }

    // 8. Standard Paragraph (consume contiguous text lines)
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('<') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|') &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^(\*{3,}|-{3,}|_{3,})$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    if (paraLines.length > 0) {
      ast.push({
        type: 'paragraph',
        text: paraLines.join(' '),
      });
    } else {
      // Safety fallback to guarantee loop progression
      i++;
    }
  }

  return ast;
}
