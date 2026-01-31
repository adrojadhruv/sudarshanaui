import React from 'react';

/**
 * Normal Footer
 * Generated from Sudarshana DB
 */

const styles = `
.sd-footer { display: flex; justify-content: space-around; padding: 40px 20px; background: #f8f9fa; color: #333; border-top: 1px solid #eee; } 
.sd-col { display: flex; flex-direction: column; gap: 10px; } 
.sd-footer h4 { margin: 0 0 10px 0; } 
.sd-footer a { text-decoration: none; color: #666; } 
.sd-footer a:hover { color: #000; } 

`;

export const NormalFooter = (props) => {
  return (
    <div {...props} className="sudarshana-component-NormalFooter">
      <style>{styles}</style>
      <footer className="sd-footer">
        <div className="sd-col">
          <h4>Brand</h4>
          <p>© 2024 All rights reserved.</p>
        </div>
        <div className="sd-col">
          <h4>Links</h4>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
        <div className="sd-col">
          <h4>Social</h4>
          <a href="#">Twitter</a>
          <a href="#">GitHub</a>
        </div>
      </footer>
    </div>
  );
};
