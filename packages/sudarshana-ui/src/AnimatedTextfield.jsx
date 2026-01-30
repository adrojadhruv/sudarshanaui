import React from 'react';

/**
 * Animated TextField
 * Generated from Sudarshana DB
 */

const styles = `
.sd-input-group { position: relative; margin-top: 20px; } 
.sd-input-anim { width: 100%; padding: 10px 0; border: none; border-bottom: 2px solid #999; outline: none; background: transparent; color: #333; transition: border-color 0.3s; } 
.sd-input-anim:focus { border-color: #6200ea; } 
.sd-label-anim { position: absolute; top: 10px; left: 0; color: #999; pointer-events: none; transition: 0.3s ease all; } 
.sd-input-anim:focus ~ .sd-label-anim, .sd-input-anim:not(:placeholder-shown) ~ .sd-label-anim { top: -20px; font-size: 12px; color: #6200ea; } 

`;

export const AnimatedTextfield = ({ label = "Username", ...rest }) => {
  let html = `
<div class="sd-input-group">
  <input type="text" class="sd-input-anim" placeholder=" " />
  <label class="sd-label-anim">{{label}}</label>
</div>
        `;

  // Inject props
  html = html.replaceAll('{{label}}', label);

  return (
    <div {...rest} className="sudarshana-component-AnimatedTextfield">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
