import React from 'react';

/**
 * AdminChoice - Reveal Mask Text
 * Generated from Sudarshana DB
 */

const styles = `
.sd-masked-h1 { font-family: impact, sans-serif; font-size: 90px; color: #222; margin: 0; position: relative; cursor: crosshair; user-select: none; line-height: 1; transition: transform 0.4s; } 
.sd-masked-h1::before { content: attr(data-label); position: absolute; top: 0; left: 0; color: transparent; background: linear-gradient(45deg, #ff0055, #0000ff); -webkit-background-clip: text; background-clip: text; clip-path: circle(0% at 50% 50%); transition: clip-path 0.5s cubic-bezier(0.22, 1, 0.36, 1); } 
.sd-masked-h1:hover::before { clip-path: circle(100% at 50% 50%); } 
.sd-masked-h1:hover { transform: scale(1.02); } 
.sd-masked-h1:active { transform: scale(0.98); } 

`;

export const AdminchoiceRevealMaskText = ({ text = "creative", ...rest }) => {
  return (
    <div {...rest} className="sudarshana-component-AdminchoiceRevealMaskText">
      <style>{styles}</style>
      <h1 className="sd-masked-h1" data-label={text}>
        {text}
      </h1>
    </div>
  );
};
