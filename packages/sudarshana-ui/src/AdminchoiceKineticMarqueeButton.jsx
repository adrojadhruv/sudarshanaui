import React from 'react';

/**
 * AdminChoice - Kinetic Marquee Button
 * Generated from Sudarshana DB
 */

const styles = `
.sd-kinetic-mag-btn { position: relative; width: 240px; height: 64px; background: #111; border: none; border-radius: 32px; overflow: hidden; cursor: pointer; color: #fff; font-family: sans-serif; font-weight: 800; transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), background 0.3s; } 
.sd-kinetic-mag-btn:hover { transform: scale(1.05) rotate(-1deg); background: #222; } 
.sd-kinetic-mag-btn:active { transform: scale(0.95) rotate(0deg); transition: transform 0.1s; } 
.sd-marquee-wrap { display: flex; width: 100%; height: 100%; align-items: center; mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent); } 
.sd-marquee-track { display: flex; align-items: center; white-space: nowrap; animation: k-scroll 6s linear infinite; transition: animation-duration 0.3s; } 
.sd-kinetic-mag-btn:hover .sd-marquee-track { animation-duration: 3s; } 
.sd-marquee-track span { padding-left: 20px; font-size: 16px; } 
.sd-icon { width: 20px; height: 20px; margin-left: 10px; margin-right: 10px; } 
@keyframes k-scroll { 0%: [object Object]; 100%: [object Object]; } 

`;

export const AdminchoiceKineticMarqueeButton = ({ label = "START PROJECT", ...rest }) => {
  return (
    <div {...rest} className="sudarshana-component-AdminchoiceKineticMarqueeButton">
      <style>{styles}</style>
      <button className="sd-kinetic-mag-btn">
        <div className="sd-marquee-wrap">
          {[1, 2].map((i) => (
            <div key={i} className="sd-marquee-track">
              <span>{label}</span><img src="https://api.iconify.design/ph:arrow-right-bold.svg?color=white" className="sd-icon" alt="" />
              <span>{label}</span><img src="https://api.iconify.design/ph:arrow-right-bold.svg?color=white" className="sd-icon" alt="" />
              <span>{label}</span><img src="https://api.iconify.design/ph:arrow-right-bold.svg?color=white" className="sd-icon" alt="" />
            </div>
          ))}
        </div>
      </button>
    </div>
  );
};
