import React from 'react';

/**
 * AdminChoice - Interactive Toggle
 * Generated from Sudarshana DB
 */

const styles = `
.pill-toggle { position: fixed; width: 80px; height: 36px; cursor: pointer; } 
.pill-toggle input { display: none; } 
.pill-track { width: 100%; height: 100%; background: #222; border-radius: 36px; display: flex; justify-content: space-between; align-items: center; padding: 0 12px; box-sizing: border-box; font-family: sans-serif; font-size: 10px; font-weight: bold; color: #555; transition: background 0.3s; } 
.pill-toggle:hover .pill-track { background: #333; } 
.pill-thumb { position: absolute; top: 3px; left: 3px; width: 30px; height: 30px; background: #fff; border-radius: 50%; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); } 
.pill-toggle:active .pill-thumb { width: 36px; } 
input:checked ~ .pill-thumb { transform: translateX(44px); background: #00ff88; } 
input:checked ~ .pill-track .label-on { color: #fff; } 

`;

export const AdminchoiceInteractiveToggle = (props) => {
  let html = `
<label class="pill-toggle">
  <input type="checkbox">
  <div class="pill-track">
    <span class="label-off">OFF</span>
    <span class="label-on">ON</span>
  </div>
  <div class="pill-thumb"></div>
</label>
`;

  // Inject props
  

    return (
    <div {...props} className="sudarshana-component-AdminchoiceInteractiveToggle">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
