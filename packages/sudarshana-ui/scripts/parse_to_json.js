const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const distFile = path.join(__dirname, '../dist/components_data.js');

// Helper: Parse CSS String to Object
function parseCSS(css) {
    const styleObj = {};
    if (!css) return styleObj;

    // Remove comments and whitespace
    css = css.replace(/\/\*[\s\S]*?\*\//g, '').trim();

    // Split by blocks
    const blocks = css.match(/[^{]+\{[^}]+\}/g);
    if (!blocks) return styleObj;

    blocks.forEach(block => {
        const parts = block.split('{');
        const selector = parts[0].trim();
        const body = parts[1].replace('}', '').trim();

        const rules = {};
        body.split(';').forEach(rule => {
            if (rule.trim()) {
                const [prop, val] = rule.split(':');
                if (prop && val) {
                    rules[prop.trim()] = val.trim();
                }
            }
        });
        styleObj[selector] = rules;
    });
    return styleObj;
}

// Helper: Infer Category
function getCategory(name) {
    const n = name.toLowerCase();
    if (n.includes('button')) return 'Button';
    if (n.includes('input') || n.includes('otp') || n.includes('textfield')) return 'Input';
    if (n.includes('text') || n.includes('title')) return 'Text';
    if (n.includes('card')) return 'Card';
    if (n.includes('menu') || n.includes('footer')) return 'Navigation';
    if (n.includes('loader')) return 'Loader';
    return 'UI';
}

const files = fs.readdirSync(srcDir);
const output = [];

files.forEach(file => {
    if (file.endsWith('.jsx')) {
        const content = fs.readFileSync(path.join(srcDir, file), 'utf8');

        // 1. Extract Name (JSDoc)
        const nameMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.*?)\n/);
        const name = nameMatch ? nameMatch[1] : path.basename(file, '.jsx');

        // 2. Extract Category
        const category = getCategory(name);

        // 3. Extract Markup
        // Find return statement content
        const returnMatch = content.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
        let markup = "";
        let defaultLabel = "LABEL";

        if (returnMatch) {
            let rawMarkup = returnMatch[1];

            // Clean up: Remove wrapper div and style tag
            // We assume structure: <div ...> <style>...</style> [CONTENT] </div>
            rawMarkup = rawMarkup.replace(/<div[\s\S]*?>/, '')
                .replace(/<\/div>\s*$/, '')
                .replace(/<style>[\s\S]*?<\/style>/, '')
                .trim();

            // Replace className with class
            rawMarkup = rawMarkup.replace(/className=/g, 'class=');

            // REMOVED: Specific label replacement. We now rely on the source code structure.
            // If source has data-label={text}, we keep it as is.

            // CLEANUP: Smart Dedent
            const lines = rawMarkup.split('\n');
            while (lines.length && !lines[0].trim()) lines.shift();
            while (lines.length && !lines[lines.length - 1].trim()) lines.pop();

            if (lines.length > 0) {
                const minIndent = lines.reduce((min, line) => {
                    if (!line.trim()) return min;
                    const indent = line.match(/^\s*/)[0].length;
                    return (min === null || indent < min) ? indent : min;
                }, null) || 0;

                markup = lines.map(line => {
                    return line.length >= minIndent ? line.slice(minIndent) : line;
                }).join('\n');

                // Ensure single line string if that's preferred, or keep structure.
                // User asked for specific format like "\n<h1...".
                // We'll keep the newlines we joined.
                // Adding outer newlines to match user example logic if needed:
                // markup = '\n' + markup + '\n'; // Let's try matching exact requested look
            } else {
                markup = rawMarkup.trim();
            }
        }

        // 4. Extract Default Props
        const propsMatch = content.match(/export const \w+ = \(\{\s*([\s\S]*?)\s*\}\) =>/);
        const defaultProps = {};

        if (propsMatch) {
            const propsStr = propsMatch[1];
            // Split by comma, handling potential newlines
            const propsList = propsStr.split(',').map(p => p.trim());

            propsList.forEach(prop => {
                // Match key = "value" or key = 'value' or key = value
                const [key, val] = prop.split('=').map(s => s.trim());
                if (key && val && key !== '...rest') {
                    // Strip quotes if present
                    const cleanVal = val.replace(/^["']|["']$/g, '');
                    defaultProps[key] = cleanVal;
                }
            });
        }

        // 5. Extract Styles
        const stylesMatch = content.match(/const styles = `([\s\S]*?)`;/);
        const styles = stylesMatch ? parseCSS(stylesMatch[1]) : {};

        output.push({
            name,
            category,
            markup,
            styles,
            defaultProps // Added at end or consistent location. User example had it at bottom.
        });
    }
});

const jsonContent = JSON.stringify(output, null, 2);

// 1. Write JS File
const jsContent = `export const componentsData = ${jsonContent};`;
fs.writeFileSync(distFile, jsContent);
console.log('Generated components_data.js');

// 2. Write JSON File
const jsonPath = path.join(__dirname, '../dist/components_data.json');
fs.writeFileSync(jsonPath, jsonContent);
console.log('Generated components_data.json');
