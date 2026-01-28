import React from 'react';

/**
 * AdminChoice - Parallax Image Link
 * Generated from Sudarshana DB
 */

const styles = `
.hover-img-link { position: relative; display: inline-block; text-decoration: none; cursor: none; padding: 10px; } 
.link-text { font-family: times new roman, serif; font-style: italic; font-size: 48px; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.3); transition: all 0.3s; } 
.img-float { position: absolute; top: 50%; left: 100%; width: 200px; height: 140px; background-size: cover; background-position: center; transform: translate(20px, -50%) scale(0) rotate(-10deg); opacity: 0; pointer-events: none; border-radius: 8px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); } 
.hover-img-link:hover .img-float { opacity: 1; transform: translate(40px, -50%) scale(1) rotate(0deg); } 
.hover-img-link:hover .link-text { opacity: 0.5; letter-spacing: 2px; } 
.hover-img-link:active .link-text { opacity: 0.2; } 

`;

export const AdminchoiceParallaxImageLink = (props) => {
  let html = `
<a href="#" class="hover-img-link" data-label="VIEW CASE">
  <span class="link-text">ARCHITECTURE</span>
  <div class="img-float" style="background-image: url('https://picsum.photos/300/200?grayscale')"></div>
</a>
`;

  // Inject props
  

    return (
    <div {...props} className="sudarshana-component-AdminchoiceParallaxImageLink">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
