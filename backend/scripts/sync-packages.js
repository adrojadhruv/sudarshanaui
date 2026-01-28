const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const UI_PACKAGE_PATH = path.join(__dirname, '../../packages/sudarshana-ui');
const SRC_PATH = path.join(UI_PACKAGE_PATH, 'src');

const connectDB = async () => {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
};

const componentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    definition: { type: Object, required: true },
    npmStatus: { type: String, default: "none" },
    npmPackageName: { type: String }
}, { collection: 'components' });

const Component = mongoose.model("component", componentSchema);

// Helper to sanitize name to PascalCase
// e.g. "fancy button" -> "FancyButton"
// "AdminChoice - Noise Glass Card" -> "AdminChoiceNoiseGlassCard"
const toPascalCase = (str) => {
    return str
        .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special chars
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
};

const generateComponentCode = (name, def) => {
    const { markup, styles, defaultProps } = def;
    const pascalName = toPascalCase(name);

    // CSS Generation
    let css = "";
    if (styles) {
        for (let selector in styles) {
            css += `${selector} { `;
            for (let prop in styles[selector]) {
                css += `${prop}: ${styles[selector][prop]}; `;
            }
            css += `} \n`;
        }
    }

    // Default Props Handling
    const propsList = defaultProps ? Object.keys(defaultProps) : [];
    const propsDestructuring = propsList.length > 0
        ? `{ ${propsList.map(p => `${p} = "${defaultProps[p]}"`).join(', ')}, ...rest }`
        : `props`;

    // Markup Replacement Logic
    // We perform replacement at runtime in the component
    // BUT we need to escape backticks in markup if any
    const safeMarkup = (markup || "").replace(/`/g, "\\`");

    return `import React from 'react';

/**
 * ${name}
 * Generated from Sudarshana DB
 */

const styles = \`
${css}
\`;

export const ${pascalName} = (${propsDestructuring}) => {
  let html = \`${safeMarkup}\`;

  // Inject props
  ${propsList.map(p => `html = html.replaceAll('{{${p}}}', ${p});`).join('\n  ')}

    return (
    <div {...${propsList.length === 0 ? 'props' : 'rest'}} className="sudarshana-component-${pascalName}">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
`;
};

const sync = async () => {
    try {
        await connectDB();

        // Find published components
        const components = await Component.find({ npmStatus: 'published' });
        console.log(`Found ${components.length} published components.`);

        // Ensure src dir exists
        if (!fs.existsSync(SRC_PATH)) fs.mkdirSync(SRC_PATH, { recursive: true });

        const exports = [];

        for (const c of components) {
            const pascalName = toPascalCase(c.name);
            const fileName = `${pascalName}.jsx`;
            const code = generateComponentCode(c.name, c.definition);

            fs.writeFileSync(path.join(SRC_PATH, fileName), code);
            console.log(`Generated ${fileName}`);

            exports.push(`export * from './src/${pascalName}';`);
        }

        // Update index.js
        const indexContent = `/**
 * Sudarshana UI
 * The official component library for Sudarshana.
 * 
 * Auto-generated exports from published components.
 */

${exports.join('\n')}
`;
        fs.writeFileSync(path.join(UI_PACKAGE_PATH, 'index.js'), indexContent);
        console.log("Updated index.js");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

sync();
