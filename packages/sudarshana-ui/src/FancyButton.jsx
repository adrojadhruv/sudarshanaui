import React from 'react';

/**
 * fancy button
 * Generated from Sudarshana DB
 */

const styles = `
.btn-anim { padding: 12px 24px; background: linear-gradient(25deg, #EF8B4A 50%, #FF6E64 40%); color: white; border: none; border-radius: 25px; cursor: wait; font-size: 16px; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 3px 5px 2px rgba(255, 105, 135, .3); } 
.btn-anim:hover { transform: scale(1.05); box-shadow: 0 3px 15px 2px rgba(255, 105, 135, .5); } 
.btn-anim:active { transform: scale(0.95); } 

`;

export const FancyButton = ({ label = "yo yes", ...rest }) => {
  let html = `<button class="btn-anim">{{label}}</button>`;

  // Inject props
  html = html.replaceAll('{{label}}', label);

    return (
    <div {...rest} className="sudarshana-component-FancyButton">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
