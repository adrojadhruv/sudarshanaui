import React from 'react';

/**
 * AdminChoice - Magnetic Attraction Button
 * Generated from Sudarshana DB
 */

const styles = `
.sd-magnet-core { position: relative; padding: 25px 50px; background: black; border: 1px solid rgba(255,255,255,0.3); border-radius: 100px; color: #fff; font-family: sans-serif; font-weight: 600; cursor: pointer; overflow: hidden; transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); } 
.sd-magnet-field { position: absolute; top: 50%; left: 50%; width: 0; height: 0; background: #fff; border-radius: 50%; transform: translate(-50%, -50%); transition: width 0.6s cubic-bezier(0.19, 1, 0.22, 1), height 0.6s cubic-bezier(0.19, 1, 0.22, 1); z-index: -1; } 
.sd-magnet-core:hover .sd-magnet-field { width: 350px; height: 350px; } 
.sd-magnet-core:hover { color: #000; border-color: transparent; transform: scale(1.05); } 
.sd-magnet-core:active { transform: scale(0.95); } 
.sd-magnet-ripple { position: absolute; top: 50%; left: 50%; width: 100%; height: 100%; border: 2px solid #fff; border-radius: 100px; transform: translate(-50%, -50%) scale(1); opacity: 0; pointer-events: none; } 
.sd-magnet-core:active .sd-magnet-ripple { animation: mag-ping 0.6s cubic-bezier(0, 0, 0.2, 1); } 
.sd-magnet-text { position: relative; z-index: 2; } 
@keyframes mag-ping { 75%, 100%: [object Object]; 0%: [object Object]; } 

`;

export const AdminchoiceMagneticAttractionButton = (props) => {
  let html = `
<button class="sd-magnet-core">
  <span class="sd-magnet-text">MAGNETIC</span>
  <div class="sd-magnet-field"></div>
  <div class="sd-magnet-ripple"></div>
</button>
`;

  // Inject props


  return (
    <div {...props} className="sudarshana-component-AdminchoiceMagneticAttractionButton">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
