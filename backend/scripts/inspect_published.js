require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Component = require('./models/componentModel');

const inspectComponents = async () => {
    try {
        await connectDB();
        console.log("Connected to DB");

        // Find components with npmStatus 'published'
        // Also check if user meant just "uploaded", so we check for anything not 'none' just in case,
        // but user specifically said "mark npm uploaded" which matches the enum.
        // Let's check for 'published' as that is the standard enum value I saw.
        const components = await Component.find({ npmStatus: 'published' });

        console.log(`Found ${components.length} published components.`);

        if (components.length > 0) {
            console.log("--- Component Inspection ---");
            components.forEach(c => {
                console.log(`Name: ${c.name}`);
                console.log(`NPM Package Name: ${c.npmPackageName}`);
                console.log(`Definition Keys: ${Object.keys(c.definition || {})}`);
                // Peek at definition content to see if it's code string or object
                console.log(`Definition Preview:`, JSON.stringify(c.definition).substring(0, 200));
                console.log("----------------------------");
            });
        } else {
            // Fallback: Check if ANY component has a status other than none
            const anyComponents = await Component.find({ npmStatus: { $ne: 'none' } });
            console.log(`Found ${anyComponents.length} components with npmStatus != 'none'.`);
            anyComponents.forEach(c => console.log(`- ${c.name} (${c.npmStatus})`));
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

inspectComponents();
