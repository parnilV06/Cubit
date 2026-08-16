/**
 * Cubit Trainer — Deterministic MDX Renderer
 * 
 * Safely renders Markdown AST nodes and sandboxed registered components.
 */

import React, { useMemo, useState } from 'react';
import { parseMDX } from './mdxParser';
import { getRegisteredComponent } from './componentRegistry';
import { Callout } from './Callout';
import { Copy, Check, AlertCircle } from 'lucide-react';

/**
 * Inline text renderer supporting bold, italic, code, links, and keyboard tags.
 */
export function renderInlineText(text) {
  if (!text || typeof text !== 'string') return text;

  // Split text by inline tokens: `code`, **bold**, *italic*, [link](url), <kbd>key</kbd>
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|<kbd>[^<]+<\/kbd>)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const codeContent = part.slice(1, -1);
      return (
        <code
          key={idx}
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            backgroundColor: 'rgba(87, 47, 247, 0.12)',
            color: 'var(--brand-ter, #bc8be0)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.9em',
            fontWeight: '600',
            border: '1px solid rgba(87, 47, 247, 0.25)',
          }}
        >
          {codeContent}
        </code>
      );
    }

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} style={{ color: '#ffffff', fontWeight: '700' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} style={{ color: 'var(--text-secondary, #a8a8b5)', fontStyle: 'italic' }}>
          {part.slice(1, -1)}
        </em>
      );
    }

    // Link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      const isExternal = linkUrl.startsWith('http');
      return (
        <a
          key={idx}
          href={linkUrl}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          style={{
            color: 'var(--brand-ter, #bc8be0)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            fontWeight: '500',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--brand-ter, #bc8be0)'; }}
        >
          {linkText}
        </a>
      );
    }

    // Keyboard Key: <kbd>key</kbd>
    const kbdMatch = part.match(/^<kbd>([^<]+)<\/kbd>$/i);
    if (kbdMatch) {
      return (
        <kbd
          key={idx}
          style={{
            display: 'inline-block',
            padding: '2px 7px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono, monospace)',
            fontWeight: '600',
            color: '#fafafa',
            backgroundColor: '#1c1c24',
            border: '1px solid #3c3c4a',
            borderRadius: '5px',
            boxShadow: '0 2px 0 #121217',
            margin: '0 2px',
          }}
        >
          {kbdMatch[1]}
        </kbd>
      );
    }

    return part;
  });
}

/**
 * Code block with syntax styling and copy-to-clipboard button.
 */
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'relative',
        margin: '18px 0',
        borderRadius: '10px',
        backgroundColor: '#0d0d12',
        border: '1px solid var(--border-primary, #2b2b35)',
        overflow: 'hidden',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid var(--border-primary, #2b2b35)',
          fontSize: '11px',
          fontFamily: 'var(--font-mono, monospace)',
          color: 'var(--text-muted, #7a7a88)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          title="Copy code"
          style={{
            background: 'none',
            border: 'none',
            color: copied ? '#22c55e' : 'var(--text-muted, #7a7a88)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            padding: '2px 6px',
            borderRadius: '4px',
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <pre
        style={{
          margin: 0,
          padding: '16px',
          overflowX: 'auto',
          fontSize: '14px',
          lineHeight: '1.5',
          fontFamily: 'var(--font-mono, monospace)',
          color: '#e4e4ed',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Component Error Boundary fallback
 */
class SafeComponentBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`Trainer Component Render Error [${this.props.componentName}]:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            margin: '16px 0',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={18} />
          <span>
            Failed to render interactive component &lt;{this.props.componentName} /&gt;
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Main MDXRenderer Component
 */
export function MDXRenderer({ content, className = '', style = {} }) {
  const ast = useMemo(() => {
    return parseMDX(content);
  }, [content]);

  if (!ast || ast.length === 0) {
    return null;
  }

  return (
    <div
      className={`cubit-trainer-mdx-content ${className}`}
      style={{
        color: 'var(--text-secondary, #a8a8b5)',
        fontFamily: 'var(--font-main, Rubik, sans-serif)',
        fontSize: '15px',
        lineHeight: '1.7',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {ast.map((node, index) => {
        switch (node.type) {
          case 'heading': {
            const HeadingTag = `h${node.level}`;
            const fontSizes = { 1: '30px', 2: '23px', 3: '18px', 4: '16px' };
            const margins = { 1: '28px 0 14px 0', 2: '26px 0 12px 0', 3: '20px 0 10px 0', 4: '16px 0 8px 0' };

            return (
              <HeadingTag
                key={index}
                id={node.id}
                style={{
                  fontFamily: 'var(--font-heading, Rajdhani, sans-serif)',
                  color: 'var(--text-primary, #ffffff)',
                  fontSize: fontSizes[node.level] || '20px',
                  fontWeight: '700',
                  margin: margins[node.level] || '20px 0 10px 0',
                  letterSpacing: '0.02em',
                  scrollMarginTop: '80px',
                  textAlign: 'left',
                }}
              >
                {renderInlineText(node.text)}
              </HeadingTag>
            );
          }

          case 'paragraph': {
            return (
              <p
                key={index}
                style={{
                  marginBottom: '16px',
                  marginTop: 0,
                  color: 'var(--text-secondary, #a8a8b5)',
                  textAlign: 'left',
                  fontSize: '15px',
                  lineHeight: '1.7',
                }}
              >
                {renderInlineText(node.text)}
              </p>
            );
          }

          case 'list': {
            const ListTag = node.listType === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag
                key={index}
                style={{
                  paddingLeft: '22px',
                  margin: '12px 0 18px 0',
                  color: 'var(--text-secondary, #a8a8b5)',
                  textAlign: 'left',
                  lineHeight: '1.65',
                }}
              >
                {node.items.map((item, itemIdx) => (
                  <li key={itemIdx} style={{ marginBottom: '8px' }}>
                    {renderInlineText(item)}
                  </li>
                ))}
              </ListTag>
            );
          }

          case 'blockquote': {
            return (
              <blockquote
                key={index}
                style={{
                  margin: '16px 0',
                  padding: '12px 18px',
                  borderLeft: '3px solid var(--brand-primary, #572ff7)',
                  backgroundColor: 'rgba(87, 47, 247, 0.05)',
                  borderRadius: '0 8px 8px 0',
                  color: '#d0d0dc',
                  fontStyle: 'italic',
                  textAlign: 'left',
                }}
              >
                {renderInlineText(node.text)}
              </blockquote>
            );
          }

          case 'callout': {
            return (
              <Callout key={index} type={node.alertType}>
                {renderInlineText(node.text)}
              </Callout>
            );
          }

          case 'code_block': {
            return (
              <CodeBlock
                key={index}
                code={node.code}
                language={node.language}
              />
            );
          }

          case 'table': {
            return (
              <div
                key={index}
                style={{
                  overflowX: 'auto',
                  margin: '18px 0',
                  borderRadius: '8px',
                  border: '1px solid var(--border-primary, #2b2b35)',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    fontSize: '14px',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        borderBottom: '1px solid var(--border-primary, #2b2b35)',
                      }}
                    >
                      {node.headers.map((header, hIdx) => (
                        <th
                          key={hIdx}
                          style={{
                            padding: '10px 14px',
                            fontWeight: '700',
                            color: '#ffffff',
                            fontFamily: 'var(--font-heading, sans-serif)',
                          }}
                        >
                          {renderInlineText(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {node.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        style={{
                          borderBottom: rIdx < node.rows.length - 1 ? '1px solid var(--border-primary, #2b2b35)' : 'none',
                          backgroundColor: rIdx % 2 === 1 ? 'rgba(255, 255, 255, 0.015)' : 'transparent',
                        }}
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            style={{
                              padding: '10px 14px',
                              color: 'var(--text-secondary, #a8a8b5)',
                            }}
                          >
                            {renderInlineText(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case 'thematic_break': {
            return (
              <hr
                key={index}
                style={{
                  border: 'none',
                  borderTop: '1px solid var(--border-primary, #2b2b35)',
                  margin: '28px 0',
                }}
              />
            );
          }

          case 'jsx_component': {
            const Component = getRegisteredComponent(node.component);

            if (!Component) {
              return (
                <div
                  key={index}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: '#f59e0b',
                    margin: '14px 0',
                    fontSize: '13px',
                    textAlign: 'left',
                  }}
                >
                  <em>Unregistered component &lt;{node.component} /&gt; omitted.</em>
                </div>
              );
            }

            return (
              <SafeComponentBoundary key={index} componentName={node.component}>
                <div style={{ margin: '20px 0', width: '100%' }}>
                  <Component {...node.props}>
                    {node.children ? renderInlineText(node.children) : null}
                  </Component>
                </div>
              </SafeComponentBoundary>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}

export default MDXRenderer;
