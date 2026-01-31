const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const distDir = path.join(__dirname, '../dist/json');
const allFile = path.join(__dirname, '../dist/all_components.json');

// Ensure directories exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
const components = [];

console.log('Processing components...');

files.forEach(file => {
    if (file.endsWith('.jsx')) {
        const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
        const name = path.basename(file, '.jsx');

        const componentData = {
            name: name,
            code: content,
            filename: file
        };

        // 1. Write individual JSON file
        fs.writeFileSync(
            path.join(distDir, `${name}.json`),
            JSON.stringify(componentData, null, 2)
        );
        console.log(`- Created dist/json/${name}.json`);

        // Add to master list
        components.push(componentData);
    }
});

// 2. Write master JSON file
fs.writeFileSync(allFile, JSON.stringify(components, null, 2));
console.log(`- Created dist/all_components.json`);

// 3. Write master JS file
const jsFile = path.join(__dirname, '../dist/all_components.js');
const jsContent = `export const allComponents = ${JSON.stringify(components, null, 2)};`;
fs.writeFileSync(jsFile, jsContent);
console.log(`- Created dist/all_components.js`);

console.log(`\nSuccess! Consolidated ${components.length} components.`);
