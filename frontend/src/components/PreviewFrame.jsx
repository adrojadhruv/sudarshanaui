import CodePreviewFrame from "./CodePreviewFrame";

export default function PreviewFrame({ definition }) {
  if (!definition) return <div>Invalid JSON</div>;

  if (definition && definition.code) {
    return <CodePreviewFrame code={definition.code} />;
  }

  const { markup, styles, defaultProps } = definition;

  let html = markup;
  for (let key in defaultProps) {
    html = html.replaceAll(`{{${key}}}`, defaultProps[key]);
  }

  let css = "";
  for (let selector in styles) {
    css += `${selector}{`;
    for (let rule in styles[selector]) {
      css += `${rule}:${styles[selector][rule]};`;
    }
    css += `}`;
  }

  const srcDoc = `
    <html>
      <head>
        <style>${css}</style>
        <script>
          document.addEventListener('DOMContentLoaded', () => {
             document.body.addEventListener('click', (e) => {
               if (e.target.closest('a')) {
                 e.preventDefault();
                 console.log("Navigation prevented in preview.");
               }
             });
          });
        </script>
      </head>
      <body>${html}</body>
    </html>
  `;

  return (
    <iframe
      title="preview"
      style={{ width: "100%", height: "100%", border: "none" }}
      src="about:blank"
      srcDoc={srcDoc}
    />
  );
}
