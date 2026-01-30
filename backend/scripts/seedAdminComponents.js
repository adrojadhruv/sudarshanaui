const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user.model');
const Component = require('../models/componentModel');
const Version = require('../models/version.model');

// Load env vars
dotenv.config({ path: '.env' });

const adminComponents = [
  {
    name: "AdminChoice - Kinetic Marquee Button",
    category: "Button",
    markup: "\n<button class=\"sd-kinetic-mag-btn\">\n  <div class=\"sd-marquee-wrap\">\n    <div class=\"sd-marquee-track\">\n      <span>START PROJECT</span><img src=\"https://api.iconify.design/ph:arrow-right-bold.svg?color=white\" class=\"sd-icon\"/>\n      <span>START PROJECT</span><img src=\"https://api.iconify.design/ph:arrow-right-bold.svg?color=white\" class=\"sd-icon\"/>\n      <span>START PROJECT</span><img src=\"https://api.iconify.design/ph:arrow-right-bold.svg?color=white\" class=\"sd-icon\"/>\n    </div>\n    <div class=\"sd-marquee-track\">\n      <span>START PROJECT</span><img src=\"https://api.iconify.design/ph:arrow-right-bold.svg?color=white\" class=\"sd-icon\"/>\n      <span>START PROJECT</span><img src=\"https://api.iconify.design/ph:arrow-right-bold.svg?color=white\" class=\"sd-icon\"/>\n      <span>START PROJECT</span><img src=\"https://api.iconify.design/ph:arrow-right-bold.svg?color=white\" class=\"sd-icon\"/>\n    </div>\n  </div>\n</button>\n",
    styles: {
      ".sd-kinetic-mag-btn": {
        "position": "relative",
        "width": "240px",
        "height": "64px",
        "background": "#111",
        "border": "none",
        "border-radius": "32px",
        "overflow": "hidden",
        "cursor": "pointer",
        "color": "#fff",
        "font-family": "sans-serif",
        "font-weight": "800",
        "transition": "transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), background 0.3s"
      },
      ".sd-kinetic-mag-btn:hover": {
        "transform": "scale(1.05) rotate(-1deg)",
        "background": "#222"
      },
      ".sd-kinetic-mag-btn:active": {
        "transform": "scale(0.95) rotate(0deg)",
        "transition": "transform 0.1s"
      },
      ".sd-marquee-wrap": {
        "display": "flex",
        "width": "100%",
        "height": "100%",
        "align-items": "center",
        "mask-image": "linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)"
      },
      ".sd-marquee-track": {
        "display": "flex",
        "align-items": "center",
        "white-space": "nowrap",
        "animation": "k-scroll 6s linear infinite",
        "transition": "animation-duration 0.3s"
      },
      ".sd-kinetic-mag-btn:hover .sd-marquee-track": {
        "animation-duration": "3s"
      },
      ".sd-marquee-track span": {
        "padding-left": "20px",
        "font-size": "16px"
      },
      ".sd-icon": {
        "width": "20px",
        "height": "20px",
        "margin-left": "10px",
        "margin-right": "10px"
      },
      "@keyframes k-scroll": {
        "0%": {
          "transform": "translateX(0)"
        },
        "100%": {
          "transform": "translateX(-100%)"
        }
      }
    }
  },
  {
    name: "AdminChoice - Noise Glass Card",
    category: "Card",
    markup: "\n<div class=\"sd-grain-card\">\n  <div class=\"sd-grain-bg\"></div>\n  <div class=\"sd-grain-content\">\n    <div class=\"sd-badge\">NEW</div>\n    <h3>FROSTED</h3>\n    <p>Hyper-realistic Grain</p>\n  </div>\n</div>\n",
    styles: {
      ".sd-grain-card": {
        "width": "280px",
        "height": "380px",
        "position": "relative",
        "background": "rgba(20, 20, 20, 0.6)",
        "backdrop-filter": "blur(24px) saturate(180%)",
        "-webkit-backdrop-filter": "blur(24px) saturate(180%)",
        "border": "1px solid rgba(255,255,255,0.1)",
        "border-radius": "24px",
        "overflow": "hidden",
        "cursor": "pointer",
        "transition": "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), background 0.6s, box-shadow 0.6s"
      },
      ".sd-grain-bg": {
        "position": "absolute",
        "inset": "-50%",
        "background-image": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E\")",
        "opacity": "0.3",
        "pointer-events": "none",
        "transition": "opacity 0.6s"
      },
      ".sd-grain-content": {
        "position": "absolute",
        "inset": "0",
        "padding": "30px",
        "display": "flex",
        "flex-direction": "column",
        "justify-content": "flex-end",
        "color": "#fff",
        "z-index": "2",
        "transition": "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
      },
      ".sd-grain-card:hover": {
        "background": "rgba(255,255,255,0.15)",
        "transform": "translateY(-15px) scale(1.02) rotateX(2deg)",
        "box-shadow": "0 30px 60px rgba(0,0,0,0.5)"
      },
      ".sd-grain-card:hover .sd-grain-bg": {
        "opacity": "0.6"
      },
      ".sd-grain-card:hover .sd-grain-content": {
        "transform": "translateY(-10px)"
      },
      ".sd-grain-card:active": {
        "transform": "translateY(-5px) scale(0.98)",
        "box-shadow": "0 10px 30px rgba(0,0,0,0.3)",
        "transition": "all 0.1s"
      },
      ".sd-badge": {
        "align-self": "flex-start",
        "padding": "6px 12px",
        "background": "#fff",
        "color": "#000",
        "border-radius": "100px",
        "font-size": "10px",
        "font-weight": "bold",
        "margin-bottom": "auto"
      },
      ".sd-grain-content h3": {
        "font-family": "arial, sans-serif",
        "font-weight": "900",
        "font-size": "36px",
        "margin": "0 0 10px 0",
        "letter-spacing": "-1px"
      },
      ".sd-grain-content p": {
        "font-family": "monospace",
        "opacity": "0.6",
        "margin": "0"
      }
    }
  },
  {
    name: "AdminChoice - Magnetic Attraction Button",
    category: "Button",
    markup: "\n<button class=\"sd-magnet-core\">\n  <span class=\"sd-magnet-text\">MAGNETIC</span>\n  <div class=\"sd-magnet-field\"></div>\n  <div class=\"sd-magnet-ripple\"></div>\n</button>\n",
    styles: {
      ".sd-magnet-core": {
        "position": "relative",
        "padding": "25px 50px",
        "background": "transparent",
        "border": "1px solid rgba(255,255,255,0.3)",
        "border-radius": "100px",
        "color": "#fff",
        "font-family": "sans-serif",
        "font-weight": "600",
        "cursor": "pointer",
        "overflow": "hidden",
        "transition": "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)"
      },
      ".sd-magnet-field": {
        "position": "absolute",
        "top": "50%",
        "left": "50%",
        "width": "0",
        "height": "0",
        "background": "#fff",
        "border-radius": "50%",
        "transform": "translate(-50%, -50%)",
        "transition": "width 0.6s cubic-bezier(0.19, 1, 0.22, 1), height 0.6s cubic-bezier(0.19, 1, 0.22, 1)",
        "z-index": "-1"
      },
      ".sd-magnet-core:hover .sd-magnet-field": {
        "width": "350px",
        "height": "350px"
      },
      ".sd-magnet-core:hover": {
        "color": "#000",
        "border-color": "transparent",
        "transform": "scale(1.05)"
      },
      ".sd-magnet-core:active": {
        "transform": "scale(0.95)"
      },
      ".sd-magnet-ripple": {
        "position": "absolute",
        "top": "50%",
        "left": "50%",
        "width": "100%",
        "height": "100%",
        "border": "2px solid #fff",
        "border-radius": "100px",
        "transform": "translate(-50%, -50%) scale(1)",
        "opacity": "0",
        "pointer-events": "none"
      },
      ".sd-magnet-core:active .sd-magnet-ripple": {
        "animation": "mag-ping 0.6s cubic-bezier(0, 0, 0.2, 1)"
      },
      ".sd-magnet-text": {
        "position": "relative",
        "z-index": "2"
      },
      "@keyframes mag-ping": {
        "75%, 100%": {
          "transform": "translate(-50%, -50%) scale(1.5)",
          "opacity": "0"
        },
        "0%": {
          "transform": "translate(-50%, -50%) scale(1)",
          "opacity": "0.5"
        }
      }
    }
  },
  {
    name: "AdminChoice - Reveal Mask Text",
    category: "Text",
    markup: "\n<h1 class=\"sd-masked-h1\" data-label=\"CREATIVE\">\n  CREATIVE\n</h1>\n",
    styles: {
      ".sd-masked-h1": {
        "font-family": "impact, sans-serif",
        "font-size": "90px",
        "color": "#222",
        "margin": "0",
        "position": "relative",
        "cursor": "crosshair",
        "user-select": "none",
        "line-height": "1",
        "transition": "transform 0.4s"
      },
      ".sd-masked-h1::before": {
        "content": "attr(data-label)",
        "position": "absolute",
        "top": "0",
        "left": "0",
        "color": "transparent",
        "background": "linear-gradient(45deg, #ff0055, #0000ff)",
        "-webkit-background-clip": "text",
        "background-clip": "text",
        "clip-path": "circle(0% at 50% 50%)",
        "transition": "clip-path 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
      },
      ".sd-masked-h1:hover::before": {
        "clip-path": "circle(100% at 50% 50%)"
      },
      ".sd-masked-h1:hover": {
        "transform": "scale(1.02)"
      },
      ".sd-masked-h1:active": {
        "transform": "scale(0.98)"
      }
    }
  },
  {
    name: "AdminChoice - Liquid Morph Loader",
    category: "Loader",
    markup: "\n<div class=\"sd-gooey-wrap\">\n  <svg style=\"width:0;height:0;position:absolute;\"><filter id=\"goo-sharp\"><feGaussianBlur in=\"SourceGraphic\" stdDeviation=\"10\" result=\"blur\"/><feColorMatrix in=\"blur\" values=\"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9\" result=\"goo\"/><feComposite in=\"SourceGraphic\" in2=\"goo\" operator=\"atop\"/></filter></svg>\n  <div class=\"sd-blobs\">\n    <div class=\"sd-blob-main\"></div>\n    <div class=\"sd-blob-orbit\"></div>\n  </div>\n</div>\n",
    styles: {
      ".sd-gooey-wrap": {
        "width": "100px",
        "height": "100px",
        "position": "relative",
        "filter": "url(#goo-sharp)",
        "cursor": "wait",
        "transition": "transform 0.3s"
      },
      ".sd-gooey-wrap:hover": {
        "transform": "scale(1.1)"
      },
      ".sd-blobs": {
        "width": "100%",
        "height": "100%",
        "animation": "rotate-g 4s linear infinite"
      },
      ".sd-blob-main": {
        "position": "absolute",
        "top": "35px",
        "left": "35px",
        "width": "30px",
        "height": "30px",
        "background": "#fff",
        "border-radius": "50%",
        "transition": "background 0.3s"
      },
      ".sd-blob-orbit": {
        "position": "absolute",
        "top": "10px",
        "left": "40px",
        "width": "20px",
        "height": "20px",
        "background": "#fff",
        "border-radius": "50%",
        "animation": "orbit-g 2s ease-in-out infinite alternate",
        "transition": "background 0.3s"
      },
      ".sd-gooey-wrap:active .sd-blob-main, .sd-gooey-wrap:active .sd-blob-orbit": {
        "background": "#00ff88"
      },
      "@keyframes rotate-g": {
        "to": {
          "transform": "rotate(360deg)"
        }
      },
      "@keyframes orbit-g": {
        "0%": {
          "transform": "translateY(0)"
        },
        "100%": {
          "transform": "translateY(60px) scale(0.8)"
        }
      }
    }
  },
  {
    name: "AdminChoice - Creative Grid Menu",
    category: "Menu",
    markup: "\n<nav class=\"sd-brut-nav\">\n  <a href=\"#\" class=\"sd-brut-link\"><span>01</span> WORK</a>\n  <a href=\"#\" class=\"sd-brut-link\"><span>02</span> STUDIO</a>\n  <a href=\"#\" class=\"sd-brut-link\"><span>03</span> CONTACT</a>\n</nav>\n",
    styles: {
      ".sd-brut-nav": {
        "display": "flex",
        "flex-direction": "column",
        "border": "1px solid #fff",
        "width": "220px",
        "background": "#000"
      },
      ".sd-brut-link": {
        "display": "flex",
        "justify-content": "space-between",
        "padding": "24px",
        "color": "#fff",
        "text-decoration": "none",
        "font-family": "arial, sans-serif",
        "font-weight": "bold",
        "border-bottom": "1px solid #fff",
        "position": "relative",
        "overflow": "hidden",
        "transition": "color 0.3s, padding 0.3s"
      },
      ".sd-brut-link:last-child": {
        "border-bottom": "none"
      },
      ".sd-brut-link::before": {
        "content": "\"\"",
        "position": "absolute",
        "top": "0",
        "left": "0",
        "width": "100%",
        "height": "100%",
        "background": "#fff",
        "transform": "translateX(-101%)",
        "transition": "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        "z-index": "-1"
      },
      ".sd-brut-link:hover": {
        "color": "#000",
        "padding-left": "34px"
      },
      ".sd-brut-link:hover::before": {
        "transform": "translateX(0)"
      },
      ".sd-brut-link:active": {
        "opacity": "0.8"
      },
      ".sd-brut-link span": {
        "font-family": "monospace",
        "opacity": "0.5",
        "transition": "opacity 0.3s"
      },
      ".sd-brut-link:hover span": {
        "opacity": "1"
      }
    }
  },
  {
    name: "AdminChoice - Parallax Image Link",
    category: "Link",
    markup: "\n<a href=\"#\" class=\"sd-hover-img-link\" data-label=\"VIEW CASE\">\n  <span class=\"sd-link-text\">ARCHITECTURE</span>\n  <div class=\"sd-img-float\" style=\"background-image: url('https://picsum.photos/300/200?grayscale')\"></div>\n</a>\n",
    styles: {
      ".sd-hover-img-link": {
        "position": "relative",
        "display": "inline-block",
        "text-decoration": "none",
        "cursor": "none",
        "padding": "10px"
      },
      ".sd-link-text": {
        "font-family": "times new roman, serif",
        "font-style": "italic",
        "font-size": "48px",
        "color": "#fff",
        "border-bottom": "1px solid rgba(255,255,255,0.3)",
        "transition": "all 0.3s"
      },
      ".sd-img-float": {
        "position": "absolute",
        "top": "50%",
        "left": "100%",
        "width": "200px",
        "height": "140px",
        "background-size": "cover",
        "background-position": "center",
        "transform": "translate(20px, -50%) scale(0) rotate(-10deg)",
        "opacity": "0",
        "pointer-events": "none",
        "border-radius": "8px",
        "transition": "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      },
      ".sd-hover-img-link:hover .sd-img-float": {
        "opacity": "1",
        "transform": "translate(40px, -50%) scale(1) rotate(0deg)"
      },
      ".sd-hover-img-link:hover .sd-link-text": {
        "opacity": "0.5",
        "letter-spacing": "2px"
      },
      ".sd-hover-img-link:active .sd-link-text": {
        "opacity": "0.2"
      }
    }
  },
  {
    name: "AdminChoice - Glitch Title",
    category: "Text",
    markup: "\n<h1 class=\"sd-rgb-text\" data-text=\"SYSTEM_FAILURE\">SYSTEM_FAILURE</h1>\n",
    styles: {
      ".sd-rgb-text": {
        "font-family": "monospace",
        "font-weight": "bold",
        "font-size": "48px",
        "color": "#fff",
        "position": "relative",
        "mix-blend-mode": "lighten",
        "cursor": "help",
        "transition": "transform 0.2s"
      },
      ".sd-rgb-text:hover": {
        "transform": "scale(1.05) skewX(-2deg)"
      },
      ".sd-rgb-text::before, .sd-rgb-text::after": {
        "content": "attr(data-text)",
        "position": "absolute",
        "top": "0",
        "left": "0",
        "width": "100%",
        "height": "100%",
        "opacity": "0.8",
        "transition": "animation-duration 0.2s"
      },
      ".sd-rgb-text:hover::before": {
        "animation-duration": "0.1s"
      },
      ".sd-rgb-text:hover::after": {
        "animation-duration": "0.1s"
      },
      ".sd-rgb-text::before": {
        "color": "#ff0000",
        "z-index": "-1",
        "animation": "rgb-1 8s infinite"
      },
      ".sd-rgb-text::after": {
        "color": "#0000ff",
        "z-index": "-2",
        "animation": "rgb-2 8s infinite"
      },
      "@keyframes rgb-1": {
        "0%,100%": {
          "transform": "translate(0)"
        },
        "20%": {
          "transform": "translate(-2px, 1px)"
        },
        "40%": {
          "transform": "translate(-1px, -1px)"
        },
        "60%": {
          "transform": "translate(1px, 1px)"
        },
        "80%": {
          "transform": "translate(2px, -1px)"
        }
      },
      "@keyframes rgb-2": {
        "0%,100%": {
          "transform": "translate(0)"
        },
        "25%": {
          "transform": "translate(2px, -1px)"
        },
        "50%": {
          "transform": "translate(1px, 2px)"
        },
        "75%": {
          "transform": "translate(-2px, 1px)"
        }
      }
    }
  },
  {
    name: "AdminChoice - Interactive Toggle",
    category: "Toggle",
    markup: "\n<label class=\"sd-pill-toggle\">\n  <input type=\"checkbox\">\n  <div class=\"sd-pill-track\">\n    <span class=\"sd-label-off\">OFF</span>\n    <span class=\"sd-label-on\">ON</span>\n  </div>\n  <div class=\"sd-pill-thumb\"></div>\n</label>\n",
    styles: {
      ".sd-pill-toggle": {
        "position": "relative",
        "width": "80px",
        "height": "36px",
        "cursor": "pointer"
      },
      ".sd-pill-toggle input": {
        "display": "none"
      },
      ".sd-pill-track": {
        "width": "100%",
        "height": "100%",
        "background": "#222",
        "border-radius": "36px",
        "display": "flex",
        "justify-content": "space-between",
        "align-items": "center",
        "padding": "0 12px",
        "box-sizing": "border-box",
        "font-family": "sans-serif",
        "font-size": "10px",
        "font-weight": "bold",
        "color": "#555",
        "transition": "background 0.3s"
      },
      ".sd-pill-toggle:hover .sd-pill-track": {
        "background": "#333"
      },
      ".sd-pill-thumb": {
        "position": "absolute",
        "top": "3px",
        "left": "3px",
        "width": "30px",
        "height": "30px",
        "background": "#fff",
        "border-radius": "50%",
        "transition": "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      },
      ".sd-pill-toggle:active .sd-pill-thumb": {
        "width": "36px"
      },
      "input:checked ~ .sd-pill-thumb": {
        "transform": "translateX(44px)",
        "background": "#00ff88"
      },
      "input:checked ~ .sd-pill-track .sd-label-on": {
        "color": "#fff"
      }
    }
  },
  {
    name: "AdminChoice - Spotlight Input",
    category: "Input",
    markup: "\n<div class=\"sd-halo-input\">\n  <input type=\"email\" placeholder=\"notify@me.com\">\n  <div class=\"sd-halo-border\"></div>\n  <div class=\"sd-halo-glow\"></div>\n</div>\n",
    styles: {
      ".sd-halo-input": {
        "position": "relative",
        "width": "300px",
        "background": "#000",
        "border-radius": "12px",
        "padding": "1px",
        "overflow": "visible",
        "transition": "transform 0.2s"
      },
      ".sd-halo-input:hover": {
        "transform": "scale(1.02)"
      },
      ".sd-halo-border": {
        "position": "absolute",
        "top": "-100%",
        "left": "-100%",
        "width": "300%",
        "height": "300%",
        "background": "conic-gradient(from 0deg, transparent 0%, #fff 10%, transparent 20%)",
        "animation": "halo-spin 3s linear infinite",
        "opacity": "0",
        "transition": "opacity 0.3s",
        "pointer-events": "none"
      },
      ".sd-halo-glow": {
        "position": "absolute",
        "inset": "0",
        "background": "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2), transparent 70%)",
        "opacity": "0",
        "transition": "opacity 0.4s"
      },
      ".sd-halo-input:hover .sd-halo-glow": {
        "opacity": "1"
      },
      ".sd-halo-input:focus-within .sd-halo-border": {
        "opacity": "1"
      },
      ".sd-halo-input input": {
        "position": "relative",
        "width": "100%",
        "padding": "16px",
        "background": "#111",
        "border": "none",
        "color": "#fff",
        "border-radius": "11px",
        "outline": "none",
        "font-family": "monospace",
        "z-index": "2",
        "transition": "background 0.3s"
      },
      ".sd-halo-input:hover input": {
        "background": "#1a1a1a"
      },
      "@keyframes halo-spin": {
        "to": {
          "transform": "rotate(360deg)"
        }
      }
    }
  }
];

const run = async () => {
  try {
    console.log("Starting Seeding Script...");
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is missing from env. ");
      const localUri = "mongodb://localhost:27017/sudarshana";
      console.log("Attempting fallback URI:", localUri);
      await mongoose.connect(localUri);
    } else {
      console.log("Connecting to provided DB URI...");
      await mongoose.connect(process.env.MONGODB_URI);
    }

    console.log("Connected to DB");

    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log("Admin role not found. Checking by email dhruv@admin.com...");
      admin = await User.findOne({ email: "dhruv@admin.com" });
    }

    if (!admin) {
      console.log("Admin not found. Creating default admin...");
      admin = await User.create({
        name: "dhruv1",
        email: "dhruv@admin.com",
        password: "$2b$10$9AB//SEwc1esqtCAMRLVNeKfFh9PF3IFX9qZcxgbdhOLpjkpaHtmG",
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=3yjyfg"
      });
      console.log("Created Admin: ", admin.email);
    } else {
      console.log("Found Admin: ", admin.email);
    }

    // 1. (REMOVED) Delete Existing Broken Admin Choice Components
    // We now Upsert (Update or Create) to preserve Version History
    console.log("Syncing AdminChoice components (Smart Seed)...");

    // 2. Create New Components
    for (const item of adminComponents) {
      console.log("Seeding: " + item.name);

      const definition = {};
      if (item.code) {
        definition.code = item.code;
        definition.tags = ["premium", "animated", "react"];
      } else {
        // Standard JSON Format
        definition.markup = item.markup;
        definition.styles = item.styles;
        definition.defaultProps = item.defaultProps || {};
        definition.tags = ["standard", "css", "html"];
      }

      let comp = await Component.findOne({ name: item.name, owner: admin._id });

      let isNew = false;

      if (comp) {
        console.log(`  -> Updating existing: ${item.name}`);
        comp.definition = definition;
        // We DO NOT reset version or status here, preserving history.
        await comp.save();
      } else {
        console.log(`  -> Creating new: ${item.name}`);
        isNew = true;
        comp = await Component.create({
          name: item.name,
          category: item.category,
          description: "Official Sudarshana UI Premium Component",
          definition: definition,
          owner: admin._id,
          status: "approved",
          version: "1.0.0"
        });
      }

      // Ensure a version snapshot exists for the Current State?
      // For now, if we update code, we should probably ensure the 'current' state is backed by a version if it's new.
      // But if it's existing, we might just be patching the definition in place without bumping version (Hotfix).

      if (isNew) {
        // Create Initial Version Snapshot for 1.0.0
        await Version.create({
          component: comp._id,
          version: "1.0.0",
          definition: definition,
          author: admin._id,
          collaborators: []
        });
      } else {
        // OPTIONAL: If you want to force a version bump on seed, uncomment below.
        // But usually seeding is just "fixing the underlying data".
        // If the user wants to release a new version, they should use the UI or a specific migration script.
      }
    }

    console.log("All Components Synced Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding Failed:", err);
    process.exit(1);
  }
};

run();
