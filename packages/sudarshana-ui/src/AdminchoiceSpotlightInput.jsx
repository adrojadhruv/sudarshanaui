import React from 'react';

/**
 * AdminChoice - Spotlight Input
 * Generated from Sudarshana DB
 */

const styles = `
.halo-input { position: relative; width: 300px; background: #000; border-radius: 12px; padding: 1px; overflow: visible; transition: transform 0.2s; } 
.halo-input:hover { transform: scale(1.02); } 
.halo-border { position: absolute; top: -100%; left: -100%; width: 300%; height: 300%; background: conic-gradient(from 0deg, transparent 0%, #fff 10%, transparent 20%); animation: halo-spin 3s linear infinite; opacity: 0; transition: opacity 0.3s; pointer-events: none; } 
.halo-glow { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2), transparent 70%); opacity: 0; transition: opacity 0.4s; } 
.halo-input:hover .halo-glow { opacity: 1; } 
.halo-input:focus-within .halo-border { opacity: 1; } 
.halo-input input { position: relative; width: 100%; padding: 16px; background: #111; border: none; color: #fff; border-radius: 11px; outline: none; font-family: monospace; z-index: 2; transition: background 0.3s; } 
.halo-input:hover input { background: #1a1a1a; } 
@keyframes halo-spin { to: [object Object]; } 

`;

export const AdminchoiceSpotlightInput = (props) => {
  let html = `
<div class="halo-input">
  <input type="email" placeholder="notify@me.com">
  <div class="halo-border"></div>
  <div class="halo-glow"></div>
</div>
`;

  // Inject props
  

    return (
    <div {...props} className="sudarshana-component-AdminchoiceSpotlightInput">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
