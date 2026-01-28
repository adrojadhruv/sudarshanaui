const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectDB = async () => {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
    await mongoose.connect(process.env.MONGODB_URI);
};

const componentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        definition: { type: Object, required: true },
        npmStatus: { type: String, default: "none" },
        npmPackageName: { type: String }
    },
    { collection: 'components' }
);

const Component = mongoose.model("component", componentSchema);

const inspect = async () => {
    try {
        await connectDB();
        const published = await Component.find({ npmStatus: 'published' });

        const dump = published.map(c => ({
            name: c.name,
            npmPackageName: c.npmPackageName,
            definition: c.definition
        }));

        fs.writeFileSync(
            path.join(__dirname, 'temp_component_dump.json'),
            JSON.stringify(dump, null, 2)
        );
        console.log(`Dumped ${dump.length} components to temp_component_dump.json`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

inspect();
