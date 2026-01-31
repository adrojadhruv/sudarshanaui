import React from 'react';

/**
 * AdminChoice - Parallax Image Link
 * Generated from Sudarshana DB
 */

const styles = `
.sd-hover-img-link { position: relative; display: inline-block; text-decoration: none; cursor: none; padding: 10px; } 
.sd-link-text { font-family: times new roman, serif; font-style: italic; font-size: 48px; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.3); transition: all 0.3s; } 
.sd-img-float { position: absolute; top: 50%; left: 100%; width: 200px; height: 140px; background-size: cover; background-position: center; transform: translate(20px, -50%) scale(0) rotate(-10deg); opacity: 0; pointer-events: none; border-radius: 8px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); } 
.sd-hover-img-link:hover .sd-img-float { opacity: 1; transform: translate(40px, -50%) scale(1) rotate(0deg); } 
.sd-hover-img-link:hover .sd-link-text { opacity: 0.5; letter-spacing: 2px; } 
.sd-hover-img-link:active .sd-link-text { opacity: 0.2; } 

`;

export const AdminchoiceParallaxImageLink = ({ label = "ARCHITECTURE", image = "https://picsum.photos/300/200?grayscale", href = "#", ...rest }) => {
  return (
    <div {...rest} className="sudarshana-component-AdminchoiceParallaxImageLink">
      <style>{styles}</style>
      <a href={href} className="sd-hover-img-link" data-label={label}>
        <span className="sd-link-text">{label}</span>
        <div className="sd-img-float" style={{ backgroundImage: `url('${image}')` }}></div>
      </a>
    </div>
  );
};
