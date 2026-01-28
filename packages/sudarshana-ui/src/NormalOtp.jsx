import React from 'react';

/**
 * Normal OTP
 * Generated from Sudarshana DB
 */

const styles = `
.otp-group { display: flex; gap: 10px; } 
input { width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ccc; border-radius: 4px; } 

`;

export const NormalOtp = (props) => {
  let html = `<div class="otp-group"><input type="text" maxlength="1" /><input type="text" maxlength="1" /><input type="text" maxlength="1" /><input type="text" maxlength="1" /></div>`;

  // Inject props
  

    return (
    <div {...props} className="sudarshana-component-NormalOtp">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
