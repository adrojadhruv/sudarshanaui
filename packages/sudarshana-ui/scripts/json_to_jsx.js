const inputJSON = {
    "name": "AdminChoice - Reveal Mask Text",
    "category": "Text",
    "markup": "\n<h1 class=\"sd-masked-h1\" data-label=\"CREATIVE\">\n  CREATIVE\n</h1>\n",
    "styles": {
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
};

function jsonToJsx(component) {
    // 1. Convert Name (AdminChoice - Reveal Mask Text -> AdminchoiceRevealMaskText)
    const pascalName = component.name
        .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special chars
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('')
        .replace(/^Adminchoice/, 'Adminchoice'); // Ensure prefix casing if needed (User ex: AdminchoiceRevealMaskText)

    // Match exact user casing preference: "AdminchoiceRevealMaskText" (Adminchoice is title case but one word)
    // The previous logic might produce "AdminChoiceRevealMaskText". Let's fix specific prefix if needed.
    const finalName = pascalName.replace('Adminchoice', 'Adminchoice');

    // 2. Convert Styles Object to String
    let styleString = '';
    for (const [selector, rules] of Object.entries(component.styles)) {
        const ruleString = Object.entries(rules)
            .map(([prop, val]) => `${prop}: ${val};`)
            .join(' ');
        styleString += `${selector} { ${ruleString} } \n`;
    }

    // 3. Process Markup
    let jsxMarkup = component.markup;

    // Replace class with className
    jsxMarkup = jsxMarkup.replace(/class=/g, 'className=');

    // Parameterize "CREATIVE" -> {label} (Reverse engineering for this specific demo)
    // In a real generic script, you might config this or detect "defaultProps".
    // Since input JSON lacks defaultProps, we assume the string "CREATIVE" is the target variable.
    const defaultVal = "CREATIVE";
    const propName = "label";

    // Replace attribute: some-attr="CREATIVE" -> some-attr={label}
    const attrRegex = new RegExp(`="${defaultVal}"`, 'g');
    jsxMarkup = jsxMarkup.replace(attrRegex, `={${propName}}`);

    // Replace text content: CREATIVE -> {label}
    // Be careful not to replace partial matches if possible, but global replace is simple for now.
    // Ideally use DOM parser, but regex works for simple structure.
    const textRegex = new RegExp(defaultVal, 'g');
    // We already handled attributes, so this might touch them again if we aren't careful? 
    // Wait, `={label}` doesn't contain "CREATIVE" anymore. So safe to replace remaining "CREATIVE".
    jsxMarkup = jsxMarkup.replace(textRegex, `{${propName}}`);

    // Clean up excessive newlines if present from replacements
    jsxMarkup = jsxMarkup.trim();

    // 4. Construct Template
    const fileContent = `import React from 'react';

/**
 * ${component.name}
 * Generated from Sudarshana DB
 */

const styles = \`
${styleString}
\`;

export const ${finalName} = ({ ${propName} = "${defaultVal}", ...rest }) => {
  return (
    <div {...rest} className="sudarshana-component-${finalName}">
      <style>{styles}</style>
      ${jsxMarkup}
    </div>
  );
};`;

    return fileContent;
}

const result = jsonToJsx(inputJSON);
console.log(result);
