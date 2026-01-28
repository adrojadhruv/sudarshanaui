import React from 'react';

/**
 * Normal Footer
 * Generated from Sudarshana DB
 */

const styles = `
.footer { display: flex; justify-content: space-around; padding: 40px 20px; background: #f8f9fa; color: #333; border-top: 1px solid #eee; } 
.col { display: flex; flex-direction: column; gap: 10px; } 
h4 { margin: 0 0 10px 0; } 
a { text-decoration: none; color: #666; } 
a:hover { color: #000; } 

`;

export const NormalFooter = (props) => {
  let html = `
<footer class="footer">
  <div class="col">
    <h4>Brand</h4>
    <p>© 2024 All rights reserved.</p>
  </div>
  <div class="col">
    <h4>Links</h4>
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>
  <div class="col">
    <h4>Social</h4>
    <a href="#">Twitter</a>
    <a href="#">GitHub</a>
  </div>
</footer>
`;

  // Inject props
  

    return (
    <div {...props} className="sudarshana-component-NormalFooter">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
