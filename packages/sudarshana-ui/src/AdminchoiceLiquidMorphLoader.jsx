import React from 'react';

/**
 * AdminChoice - Liquid Morph Loader
 * Generated from Sudarshana DB
 */

const styles = `
.sd-gooey-wrap { width: 100px; height: 100px; position: relative; filter: url(#goo-sharp); cursor: wait; transition: transform 0.3s; } 
.sd-gooey-wrap:hover { transform: scale(1.1); } 
.sd-blobs { width: 100%; height: 100%; animation: rotate-g 4s linear infinite; } 
.sd-blob-main { position: absolute; top: 35px; left: 35px; width: 30px; height: 30px; background: #fff; border-radius: 50%; transition: background 0.3s; } 
.sd-blob-orbit { position: absolute; top: 10px; left: 40px; width: 20px; height: 20px; background: #fff; border-radius: 50%; animation: orbit-g 2s ease-in-out infinite alternate; transition: background 0.3s; } 
.sd-gooey-wrap:active .sd-blob-main, .sd-gooey-wrap:active .sd-blob-orbit { background: #00ff88; } 
@keyframes rotate-g { to: [object Object]; } 
@keyframes orbit-g { 0%: [object Object]; 100%: [object Object]; } 

`;

export const AdminchoiceLiquidMorphLoader = (props) => {
  let html = `
<div class="sd-gooey-wrap">
  <svg style="width:0;height:0;position:absolute;"><filter id="goo-sharp"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/><feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo"/><feComposite in="SourceGraphic" in2="goo" operator="atop"/></filter></svg>
  <div class="sd-blobs">
    <div class="sd-blob-main"></div>
    <div class="sd-blob-orbit"></div>
  </div>
</div>
`;

  // Inject props


  return (
    <div {...props} className="sudarshana-component-AdminchoiceLiquidMorphLoader">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
