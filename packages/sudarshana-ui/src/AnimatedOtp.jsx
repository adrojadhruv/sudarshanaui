import React from 'react';

/**
 * Animated OTP
 * Generated from Sudarshana DB
 */

const styles = `
.otp-anim { display: flex; gap: 12px; } 
input { width: 50px; height: 60px; text-align: center; font-size: 24px; background: #f0f0f0; border: 2px solid transparent; border-radius: 12px; outline: none; transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); color: #333; } 
input:focus { transform: translateY(-5px) scale(1.1); border-color: #6200ea; background: white; box-shadow: 0 10px 20px rgba(98, 0, 234, 0.2); } 
@keyframes shake { 0%, 100%: [object Object]; 20%, 60%: [object Object]; 40%, 80%: [object Object]; } 

`;

export const AnimatedOtp = (props) => {
  let html = `<div class="otp-anim"><input type="text" maxlength="1" placeholder="•" /><input type="text" maxlength="1" placeholder="•" /><input type="text" maxlength="1" placeholder="•" /><input type="text" maxlength="1" placeholder="•" /></div>`;

  // Inject props
  

    return (
    <div {...props} className="sudarshana-component-AnimatedOtp">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
