import React from 'react';

/**
 * AdminChoice - Noise Glass Card
 * Generated from Sudarshana DB
 */

const styles = `
.sd-grain-card { width: 280px; height: 380px; position: relative; background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; overflow: hidden; cursor: pointer; transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), background 0.6s, box-shadow 0.6s; } 
.sd-grain-bg { position: absolute; inset: -50%; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E"); opacity: 0.3; pointer-events: none; transition: opacity 0.6s; } 
.sd-grain-content { position: absolute; inset: 0; padding: 30px; display: flex; flex-direction: column; justify-content: flex-end; color: #fff; z-index: 2; transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); } 
.sd-grain-card:hover { background: rgba(255,255,255,0.15); transform: translateY(-15px) scale(1.02) rotateX(2deg); box-shadow: 0 30px 60px rgba(0,0,0,0.5); } 
.sd-grain-card:hover .sd-grain-bg { opacity: 0.6; } 
.sd-grain-card:hover .sd-grain-content { transform: translateY(-10px); } 
.sd-grain-card:active { transform: translateY(-5px) scale(0.98); box-shadow: 0 10px 30px rgba(0,0,0,0.3); transition: all 0.1s; } 
.sd-badge { align-self: flex-start; padding: 6px 12px; background: #fff; color: #000; border-radius: 100px; font-size: 10px; font-weight: bold; margin-bottom: auto; } 
.sd-grain-content h3 { font-family: arial, sans-serif; font-weight: 900; font-size: 36px; margin: 0 0 10px 0; letter-spacing: -1px; } 
.sd-grain-content p { font-family: monospace; opacity: 0.6; margin: 0; } 

`;

export const AdminchoiceNoiseGlassCard = ({ title = "FROSTED", subtitle = "Hyper-realistic Grain", badge = "NEW", ...rest }) => {
  return (
    <div {...rest} className="sudarshana-component-AdminchoiceNoiseGlassCard">
      <style>{styles}</style>
      <div className="sd-grain-card">
        <div className="sd-grain-bg"></div>
        <div className="sd-grain-content">
          <div className="sd-badge">{badge}</div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
    </div>
  );
};
