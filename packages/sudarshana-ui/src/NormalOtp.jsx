import React from 'react';

/**
 * Normal OTP
 * Generated from Sudarshana DB
 */

const styles = `
.sd-otp-group { display: flex; gap: 10px; } 
.sd-otp-group input { width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ccc; border-radius: 4px; } 

`;

export const NormalOtp = (props) => {
  return (
    <div {...props} className="sudarshana-component-NormalOtp">
      <style>{styles}</style>
      <div className="sd-otp-group">
        <input type="text" maxLength="1" />
        <input type="text" maxLength="1" />
        <input type="text" maxLength="1" />
        <input type="text" maxLength="1" />
      </div>
    </div>
  );
};
