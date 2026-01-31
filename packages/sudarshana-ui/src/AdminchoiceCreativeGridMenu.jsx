import React from 'react';

/**
 * AdminChoice - Creative Grid Menu
 * Generated from Sudarshana DB
 */

const styles = `
.sd-brut-nav { display: flex; flex-direction: column; border: 1px solid #fff; width: 220px; background: #000; } 
.sd-brut-link { display: flex; justify-content: space-between; padding: 24px; color: #fff; text-decoration: none; font-family: arial, sans-serif; font-weight: bold; border-bottom: 1px solid #fff; position: relative; overflow: hidden; transition: color 0.3s, padding 0.3s; } 
.sd-brut-link:last-child { border-bottom: none; } 
.sd-brut-link::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #fff; transform: translateX(-101%); transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); z-index: -1; } 
.sd-brut-link:hover { color: #000; padding-left: 34px; } 
.sd-brut-link:hover::before { transform: translateX(0); } 
.sd-brut-link:active { opacity: 0.8; } 
.sd-brut-link span { font-family: monospace; opacity: 0.5; transition: opacity 0.3s; } 
.sd-brut-link:hover span { opacity: 1; } 

`;

export const AdminchoiceCreativeGridMenu = ({ items = [{ label: "WORK", number: "01" }, { label: "STUDIO", number: "02" }, { label: "CONTACT", number: "03" }], ...rest }) => {
  return (
    <div {...rest} className="sudarshana-component-AdminchoiceCreativeGridMenu">
      <style>{styles}</style>
      <nav className="sd-brut-nav">
        {items.map((item, index) => (
          <a key={index} href={item.href || "#"} className="sd-brut-link">
            <span>{item.number}</span> {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
};
