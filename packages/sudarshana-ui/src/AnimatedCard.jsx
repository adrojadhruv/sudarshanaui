import React from 'react';

/**
 * Animated Card
 * Generated from Sudarshana DB
 */

const styles = `
.sd-card-anim { border-radius: 12px; overflow: hidden; max-width: 300px; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; color: #333; } 
.sd-card-anim:hover { transform: translateY(-10px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); } 
.sd-img-placeholder { height: 150px; background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%); } 
.sd-content { padding: 20px; } 
.sd-card-anim h3 { margin: 0 0 10px 0; } 

`;

export const AnimatedCard = ({ title = "Hover Card", content = "Hover over me to see the effect!", ...rest }) => {
  let html = `
<div class="sd-card-anim">
  <div class="sd-img-placeholder"></div>
  <div class="sd-content">
    <h3>{{title}}</h3>
    <p>{{content}}</p>
  </div>
</div>
      `;

  // Inject props
  html = html.replaceAll('{{title}}', title);
  html = html.replaceAll('{{content}}', content);

  return (
    <div {...rest} className="sudarshana-component-AnimatedCard">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
