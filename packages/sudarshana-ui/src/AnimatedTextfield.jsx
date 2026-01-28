import React from 'react';

/**
 * Animated TextField
 * Generated from Sudarshana DB
 */

const styles = `
.input-group { position: relative; margin-top: 20px; } 
.input-anim { width: 100%; padding: 10px 0; border: none; border-bottom: 2px solid #999; outline: none; background: transparent; color: #333; transition: border-color 0.3s; } 
.input-anim:focus { border-color: #6200ea; } 
.label-anim { position: absolute; top: 10px; left: 0; color: #999; pointer-events: none; transition: 0.3s ease all; } 
.input-anim:focus ~ .label-anim, .input-anim:not(:placeholder-shown) ~ .label-anim { top: -20px; font-size: 12px; color: #6200ea; } 

`;

export const AnimatedTextfield = ({ label = "Username", ...rest }) => {
  let html = `
<div class="input-group">
  <input type="text" class="input-anim" placeholder=" " />
  <label class="label-anim">{{label}}</label>
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
