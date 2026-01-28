import React, { useEffect, useRef } from 'react';

export default function CodePreviewFrame({ code }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;

    // We need to prepare the user's code:
    // 1. Remove imports (robust regex for multiline)
    // 2. Transpile 'export default' to 'window.renderComponent =' to capture it globally
    const preparedCode = code
      .replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '')
      .replace(/export\s+default\s+/, 'window.renderComponent = ');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <!-- Framer Motion -->
        <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>
        <!-- Lucide React (Icons) -->
        <script src="https://unpkg.com/lucide-react@0.294.0/dist/lucide-react.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <style>body { margin: 0; padding: 20px; background: white; }</style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel" data-presets="react" id="babel-script"></script>
      </body>
      </html>
    `);

    const scriptEl = doc.getElementById('babel-script');
    if (scriptEl) {
      scriptEl.textContent = `
        window.onerror = function(message, source, lineno, colno, error) {
          document.body.innerHTML = '<div style="color:red; margin:20px; padding:20px; border:1px solid red; background:#fff5f5; border-radius:4px; font-family:sans-serif;"><h3>Preview Error</h3><p>'+message+'</p><pre style="font-size:0.8em; overflow:auto;">'+(error && error.stack ? error.stack : '')+'</pre></div>';
        };

        try {
          const { useState, useEffect, useRef, useMemo, useCallback } = React;
          
          // Inject Framer Motion globals
          const { motion, AnimatePresence } = window.Motion ? window.Motion : { motion: {}, AnimatePresence: {} };
          
          // Inject Lucide globals
          const lucide = window.lucide || {};

          ${preparedCode}
          
          const root = ReactDOM.createRoot(document.getElementById('root'));
          
          // Check for global renderComponent
          if (typeof window.renderComponent !== 'undefined') {
            root.render(React.createElement(window.renderComponent));
          } else {
             console.warn("No renderComponent found. Ensure you 'export default' your component.");
             throw new Error("Component not found. Please ensure your code ends with 'export default function...' or 'export default ComponentName'");
          }
        } catch (err) {
           document.body.innerHTML = '<div style="color:red; margin:20px; padding:20px; border:1px solid red; background:#fff5f5; border-radius:4px; font-family:sans-serif;"><h3>Runtime Error</h3><p>' + err.message + '</p></div>';
           console.error(err);
        }
      `;
    }

    doc.close();

  }, [code]);

  return (
    <iframe
      ref={iframeRef}
      title="code-preview"
      style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
    />
  );
}
