import React from 'react';

/**
 * AdminChoice - Creative Grid Menu
 * Generated from Sudarshana DB
 */

const styles = `
.brut-nav { display: flex; flex-direction: column; border: 1px solid #fff; width: 220px; background: #000; } 
.brut-link { display: flex; justify-content: space-between; padding: 24px; color: #fff; text-decoration: none; font-family: arial, sans-serif; font-weight: bold; border-bottom: 1px solid #fff; position: relative; overflow: hidden; transition: color 0.3s, padding 0.3s; } 
.brut-link:last-child { border-bottom: none; } 
.brut-link::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #fff; transform: translateX(-101%); transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); z-index: -1; } 
.brut-link:hover { color: #000; padding-left: 34px; } 
.brut-link:hover::before { transform: translateX(0); } 
.brut-link:active { opacity: 0.8; } 
.brut-link span { font-family: monospace; opacity: 0.5; transition: opacity 0.3s; } 
.brut-link:hover span { opacity: 1; } 

`;

export const AdminchoiceCreativeGridMenu = (props) => {
  let html = `
<nav class="brut-nav">
  <a href="#" class="brut-link"><span>01</span> WORK</a>
  <a href="#" class="brut-link"><span>02</span> STUDIO</a>
  <a href="#" class="brut-link"><span>03</span> CONTACT</a>
</nav>
`;

  // Inject props
  

    return (
    <div {...props} className="sudarshana-component-AdminchoiceCreativeGridMenu">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
