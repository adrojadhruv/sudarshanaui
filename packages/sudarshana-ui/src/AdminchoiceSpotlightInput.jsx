import React from 'react';

/**
 * AdminChoice - Spotlight Input
 * Generated from Sudarshana DB
 */

const styles = `
.sd-halo-input { position: relative; width: 300px; background: #000; border-radius: 12px; padding: 1px; overflow: visible; transition: transform 0.2s; } 
.sd-halo-input:hover { transform: scale(1.02); } 
.sd-halo-border { position: absolute; top: -100%; left: -100%; width: 300%; height: 300%; background: conic-gradient(from 0deg, transparent 0%, #fff 10%, transparent 20%); animation: halo-spin 3s linear infinite; opacity: 0; transition: opacity 0.3s; pointer-events: none; } 
.sd-halo-glow { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2), transparent 70%); opacity: 0; transition: opacity 0.4s; } 
.sd-halo-input:hover .sd-halo-glow { opacity: 1; } 
.sd-halo-input:focus-within .sd-halo-border { opacity: 1; } 
.sd-halo-input input { position: relative; width: 100%; padding: 16px; background: #111; border: none; color: #fff; border-radius: 11px; outline: none; font-family: monospace; z-index: 2; transition: background 0.3s; } 
.sd-halo-input:hover input { background: #1a1a1a; } 
@keyframes halo-spin { to: [object Object]; } 

`;

export const AdminchoiceSpotlightInput = (props) => {
  let html = `
<div class="sd-halo-input">
  <input type="email" placeholder="notify@me.com">
  <div class="sd-halo-border"></div>
  <div class="sd-halo-glow"></div>
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
