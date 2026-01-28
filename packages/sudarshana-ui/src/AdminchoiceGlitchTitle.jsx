import React from 'react';

/**
 * AdminChoice - Glitch Title
 * Generated from Sudarshana DB
 */

const styles = `
.rgb-text { font-family: monospace; font-weight: bold; font-size: 48px; color: #fff; position: relative; mix-blend-mode: lighten; cursor: help; transition: transform 0.2s; } 
.rgb-text:hover { transform: scale(1.05) skewX(-2deg); } 
.rgb-text::before, .rgb-text::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.8; transition: animation-duration 0.2s; } 
.rgb-text:hover::before { animation-duration: 0.1s; } 
.rgb-text:hover::after { animation-duration: 0.1s; } 
.rgb-text::before { color: #ff0000; z-index: -1; animation: rgb-1 8s infinite; } 
.rgb-text::after { color: #0000ff; z-index: -2; animation: rgb-2 8s infinite; } 
@keyframes rgb-1 { 0%,100%: [object Object]; 20%: [object Object]; 40%: [object Object]; 60%: [object Object]; 80%: [object Object]; } 
@keyframes rgb-2 { 0%,100%: [object Object]; 25%: [object Object]; 50%: [object Object]; 75%: [object Object]; } 

`;

export const AdminchoiceGlitchTitle = (props) => {
  let html = `
<h1 class="rgb-text" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h1>
`;

  // Inject props
  

    return (
    <div {...props} className="sudarshana-component-AdminchoiceGlitchTitle">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
