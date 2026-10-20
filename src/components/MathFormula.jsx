import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Universal KaTeX formula renderer component.
 * Safely renders LaTeX mathematical expressions with crisp typography.
 */
export default function MathFormula({ math, display = false, className = '' }) {
  const html = React.useMemo(() => {
    if (!math) return '';
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: display,
        output: 'htmlAndMathml'
      });
    } catch (err) {
      console.warn('KaTeX render error:', err);
      return math;
    }
  }, [math, display]);

  return (
    <span
      className={`${display ? 'block my-1 overflow-x-auto py-1' : 'inline-block'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
