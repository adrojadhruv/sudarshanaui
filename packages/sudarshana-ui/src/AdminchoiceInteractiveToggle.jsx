import React from 'react';

/**
 * AdminChoice - Interactive Toggle
 * Generated from Sudarshana DB
 */

const styles = `
.sd-pill-toggle { position: fixed; width: 80px; height: 36px; cursor: pointer; } 
.sd-pill-toggle input { display: none; } 
.sd-pill-track { width: 100%; height: 100%; background: #222; border-radius: 36px; display: flex; justify-content: space-between; align-items: center; padding: 0 12px; box-sizing: border-box; font-family: sans-serif; font-size: 10px; font-weight: bold; color: #555; transition: background 0.3s; } 
.sd-pill-toggle:hover .sd-pill-track { background: #333; } 
.sd-pill-thumb { position: absolute; top: 3px; left: 3px; width: 30px; height: 30px; background: #fff; border-radius: 50%; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); } 
.sd-pill-toggle:active .sd-pill-thumb { width: 36px; } 
.sd-pill-toggle input:checked ~ .sd-pill-thumb { transform: translateX(44px); background: #00ff88; } 
.sd-pill-toggle input:checked ~ .sd-pill-track .sd-label-on { color: #fff; } 

`;

export const AdminchoiceInteractiveToggle = ({ checked, onChange, ...rest }) => {
  return (
    <div {...rest} className="sudarshana-component-AdminchoiceInteractiveToggle">
      <style>{styles}</style>
      <label className="sd-pill-toggle">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <div className="sd-pill-track">
          <span className="sd-label-off">OFF</span>
          <span className="sd-label-on">ON</span>
        </div>
        <div className="sd-pill-thumb"></div>
      </label>
    </div>
  );
};
