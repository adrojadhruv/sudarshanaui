import React from 'react';

/**
 * Animated Footer
 * Generated from Sudarshana DB
 */

const styles = `
.footer-anim { position: relative; background: #333; color: white; padding: 50px 20px; text-align: center; overflow: hidden; margin-top: 50px; } 
.content { position: relative; z-index: 2; } 
.socials { display: flex; justify-content: center; gap: 20px; margin-bottom: 20px; } 
.soc { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; transition: transform 0.3s, background 0.3s; } 
.soc:hover { transform: translateY(-5px) rotate(10deg); background: #6200ea; } 
.wave { position: absolute; top: -50px; left: 0; width: 100%; height: 100px; background: white; border-radius: 0 0 50% 50% / 0 0 100% 100%; transform: scaleX(1.5); } 

`;

export const AnimatedFooter = (props) => {
  let html = `
<footer class="footer-anim">
  <div class="wave"></div>
  <div class="content">
    <div class="socials">
      <a href="#" class="soc">Tw</a>
      <a href="#" class="soc">In</a>
      <a href="#" class="soc">Fb</a>
    </div>
    <p>Designed with ❤️ by You</p>
  </div>
</footer>
`;

  // Inject props
  

    return (
    <div {...props} className="sudarshana-component-AnimatedFooter">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
