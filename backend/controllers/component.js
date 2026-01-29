const Component = require("../models/componentModel");
const Version = require("../models/version.model");

/**
 * CREATE COMPONENT (Updated)
 */
exports.createComponent = async (req, res) => {
  // ... (keep existing)
  try {
    const { name, category, definition } = req.body;

    if (!name || !category || !definition) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const component = await Component.create({
      name,
      category,
      definition,
      owner: req.user.id,
      status: "draft",
      version: "1.0.0"
    });

    return res.status(201).json({ success: true, message: "Component created", component });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to create" });
  }
};

/**
 * GET COMPONENTS (Public Approved + Own Drafts/Pending + Fallback for Pending)
 */
exports.getComponents = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const userRole = req.user ? req.user.role : null;
    const isAdmin = userRole === "admin";

    let query = {};

    if (isAdmin) {
      // Admin sees everything
      query = {};
    } else {
      // Users see Approved OR Pending (we will filter/swap pending below) OR their own OR where they collaborate
      query = {
        $or: [
          { status: "approved" },
          { status: "pending" }, // Include pending to check for previous versions
          ...(userId ? [{ owner: userId }, { collaborators: userId }] : [])
        ]
      };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter Logic
    const { search, category, npmOnly } = req.query;

    // Apply filters to the base query
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    if (category) {
      query.category = category;
    }
    if (npmOnly === "true") {
      query.npmStatus = "published";
    }

    const total = await Component.countDocuments(query);
    const rawComponents = await Component.find(query)
      .sort({ updatedAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit)
      .populate("owner", "name email")
      .populate("lastCollaborator", "name avatar")
      .populate("collaborators", "name avatar");

    // Process components to handle "Pending" fallback for normal users
    const components = await Promise.all(rawComponents.map(async (comp) => {
      // Convert to object to modify
      const c = comp.toObject();

      // If Admin or Owner, show as is
      if (isAdmin || (userId && c.owner && c.owner._id.toString() === userId)) {
        return c;
      }

      // If Pending or Rejected (and not admin/owner), try to find previous version
      if (c.status === "pending" || c.status === "rejected") {
        const lastVer = await Version.findOne({ component: c._id }).sort({ createdAt: -1 });
        if (lastVer) {
          // Found previous version: Mask as approved with old data
          c.definition = lastVer.definition;
          c.version = lastVer.version;
          c.status = "approved"; // Mask status so it appears live
          return c;
        } else {
          // No previous version: Hide it
          return null;
        }
      }

      // If Approved or Draft (Draft shouldn't be here due to query, but safely return)
      return c;
    }));

    // Filter out nulls (hidden new pending)
    const filtered = components.filter(c => c !== null);

    return res.status(200).json({
      success: true,
      components: filtered,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    console.error("Error fetching components:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch" });
  }
};

/**
 * GET SINGLE COMPONENT
 */
exports.getComponentById = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const userRole = req.user ? req.user.role : null;
    const isAdmin = userRole === "admin";

    const compDoc = await Component.findById(req.params.id)
      .populate("owner", "name email role")
      .populate("lastCollaborator", "name avatar")
      .populate("collaborators", "name avatar");
    if (!compDoc) return res.status(404).json({ success: false, message: "Component not found" });

    let component = compDoc.toObject();

    // Fallback Logic for Single Component
    // If Admin or Owner, show as is.
    // If Pending or Rejected and Viewer is basic user:
    if (!isAdmin && (!userId || (component.owner && component.owner._id.toString() !== userId))) {
      if (component.status === "pending" || component.status === "rejected") {
        const lastVer = await Version.findOne({ component: component._id }).sort({ createdAt: -1 });
        if (lastVer) {
          component.definition = lastVer.definition;
          component.version = lastVer.version;
          component.status = "approved";
        } else {
          // No public version exists
          return res.status(404).json({ success: false, message: "Component not found" });
        }
      }
      // If draft (and not owner), block it. (Rejected is handled above or falls back)
      if (component.status === "draft") {
        // Basic users shouldn't see someone else's draft
        return res.status(404).json({ success: false, message: "Component not found" });
      }
    }

    return res.status(200).json({ success: true, component });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch component" });
  }
};

/**
 * UPDATE COMPONENT
 * Block if approved
 */
exports.updateComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, definition } = req.body;

    const existing = await Component.findById(id);
    if (existing.status === "approved") {
      return res.status(403).json({ success: false, message: "Cannot edit approved component. Create new version." });
    }

    // Build update object dynamically to avoid overwriting missing fields with undefined
    const updateData = {
      lastCollaborator: req.user.id
    };

    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (definition) updateData.definition = definition;

    const updatedComponent = await Component.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return res.status(200).json({ success: true, message: "Updated successfully", component: updatedComponent });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update" });
  }
};

/**
 * DELETE COMPONENT
 */
exports.deleteComponent = async (req, res) => {
  try {
    await Component.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

/**
 * SUBMIT FOR APPROVAL
 */
exports.submitForApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    // IF ADMIN: Auto-Approve immediately
    if (userRole === "admin") {
      const component = await Component.findByIdAndUpdate(
        id,
        { status: "approved" },
        { new: true }
      );

      // Create Version Snapshot (Same logic as approveComponent)
      await Version.create({
        component: component._id,
        version: component.version,
        definition: component.definition,
        author: component.lastCollaborator || component.owner,
        collaborators: component.collaborators
      });

      return res.status(200).json({ success: true, message: "Auto-approved and published (Admin)", component });
    }

    // NORMAL USER: Set to pending
    const component = await Component.findByIdAndUpdate(
      id,
      { status: "pending" },
      { new: true }
    );
    return res.status(200).json({ success: true, message: "Submitted for approval", component });
  } catch (err) {
    console.error("Submit Error:", err);
    return res.status(500).json({ success: false, message: "Failed to submit" });
  }
};

/**
 * APPROVE COMPONENT
 * Saves snapshot to Version collection
 */
exports.approveComponent = async (req, res) => {
  try {
    const { id } = req.params;

    const component = await Component.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    // Save Version Snapshot
    await Version.create({
      component: component._id,
      version: component.version,
      definition: component.definition,
      author: component.lastCollaborator || component.owner, // Credit the actual worker
      collaborators: component.collaborators // Snapshot current collaborators
    });

    return res.status(200).json({ success: true, message: "Approved and versioned", component });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to approve" });
  }
};

/**
 * REJECT COMPONENT
 */
exports.rejectComponent = async (req, res) => {
  try {
    const { id } = req.params;

    const component = await Component.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    return res.status(200).json({ success: true, message: "Component rejected", component });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to reject" });
  }
};



/**
 * REVERT COMPONENT (Discard changes/rejected version)
 * If previous version exists -> Fallback to it (status=approved).
 * If no previous version -> Delete component (it was new).
 */
exports.revertComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const component = await Component.findById(id);
    if (!component) return res.status(404).json({ success: false, message: "Component not found" });

    // Ensure only owner can revert
    if (component.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Find last approved version
    const lastVer = await Version.findOne({ component: id }).sort({ createdAt: -1 });

    if (lastVer) {
      // Revert to last approved state
      component.definition = lastVer.definition;
      component.version = lastVer.version;
      component.status = "approved";
      await component.save();
      return res.status(200).json({ success: true, message: "Reverted to previous approved version", component });
    } else {
      // No previous version exists (It was a new component) -> Delete it
      await Component.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: "Draft deleted (No previous version)", deleted: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to revert" });
  }
};

/**
 * CREATE NEW VERSION
 * 1.0.0 -> 1.0.1 (Simple patch increment)
 */
exports.createNewVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const { customVersion, versionType } = req.body; // Expect "1.2.0" OR "major"/"minor"/"patch"

    const component = await Component.findById(id);

    if (component.status !== "approved") {
      return res.status(400).json({ success: false, message: "Component must be approved first" });
    }

    let newVersion;

    if (customVersion) {
      // User provided explicit version (e.g. "2.0.0")
      // Simple validation: must be different (and ideally higher, but let's trust user for now or add semver check)
      if (customVersion === component.version) {
        return res.status(400).json({ success: false, message: "New version must be different" });
      }
      newVersion = customVersion;
    } else {
      // Auto-increment based on type (default to patch)
      const parts = (component.version || "1.0.0").split(".");
      let major = parseInt(parts[0] || "1");
      let minor = parseInt(parts[1] || "0");
      let patch = parseInt(parts[2] || "0");

      if (versionType === "major") {
        major++;
        minor = 0;
        patch = 0;
      } else if (versionType === "minor") {
        minor++;
        patch = 0;
      } else {
        // Default: patch
        patch++;
      }
      newVersion = `${major}.${minor}.${patch}`;
    }

    // Reset to draft, update version
    component.status = "draft";
    component.version = newVersion;
    await component.save();

    return res.status(200).json({ success: true, message: `New version ${newVersion} created`, component });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to create version" });
  }
};

/**
 * GET COMPONENT VERSIONS
 */
exports.getComponentVersions = async (req, res) => {
  try {
    const versions = await Version.find({ component: req.params.id })
      .sort({ createdAt: -1 })
      .select("version createdAt");
    return res.status(200).json({ success: true, versions });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch versions" });
  }
};

/**
 * GET SINGLE VERSION DETAIL
 */
exports.getVersionDetails = async (req, res) => {
  try {
    const version = await Version.findById(req.params.id)
      .populate("author", "name avatar")
      .populate("collaborators", "name avatar");

    if (!version) {
      return res.status(404).json({ success: false, message: "Version not found" });
    }
    return res.status(200).json({ success: true, version });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch version details" });
  }
};

/**
 * GENERATE PACKAGE FILES
 */
exports.generatePackage = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ success: false });

    // SANITIZE NAME: remove non-alphanumeric chars for JS variable name
    // e.g. "My-Button" -> "MyButton"
    const safeName = component.name.replace(/[^a-zA-Z0-9]/g, "");
    const fileName = safeName; // MyButton
    const cssFileName = `${fileName}.css`;

    // CALC VERSION (Hoisted for both modes)
    let pkgVersion = component.version || "1.0.0";
    if (component.publishedVersion) {
      const parts = component.publishedVersion.split(".");
      const major = parts[0] || "1";
      const minor = parts[1] || "0";
      const patch = parseInt(parts[2] || "0") + 1;
      pkgVersion = `${major}.${minor}.${patch}`;
    }

    // 0. HANDLE CODE MODE (If raw code exists)
    if (component.definition && component.definition.code) {
      const packageJson = {
        name: `@sudarshanaui/${component.name.toLowerCase().replace(/\s+/g, "-")}`,
        version: pkgVersion,
        main: "index.js",
        peerDependencies: {
          react: ">=16"
        }
      };

      // In Code Mode, we assume the user exported default or named.
      // We'll re-export everything for maximum compatibility.
      const indexJs = `export * from './${fileName}';\nexport { default } from './${fileName}';`;

      return res.status(200).json({
        success: true,
        files: {
          "package.json": JSON.stringify(packageJson, null, 2),
          "index.js": indexJs,
          [`${fileName}.jsx`]: component.definition.code,
          "README.md": `# ${component.name}\n\nGenerated from Sudarshana UI (Code Mode).\n\n## Usage\n\n\`\`\`jsx\nimport ${safeName} from './${fileName}';\n\n<${safeName} />\n\`\`\``
        }
      });
    }

    // 1. GENERATE CSS
    // definition.styles = { ".btn": { color: "red" } }
    let cssContent = "";
    if (component.definition && component.definition.styles) {
      for (const [selector, rules] of Object.entries(component.definition.styles)) {
        cssContent += `${selector} {\n`;
        for (const [prop, value] of Object.entries(rules)) {
          cssContent += `  ${prop}: ${value};\n`;
        }
        cssContent += `}\n\n`;
      }
    }

    // 2. GENERATE JSX
    // markup: "<button class='btn'>{{label}}</button>"
    // defaultProps: { label: "Click Me" }
    let jsxBody = component.definition.markup || "";

    // Replace class= with className= (simple regex, covers most standard cases)
    jsxBody = jsxBody.replace(/class=/g, "className=");

    // Replace {{prop}} with {prop}
    // And collect prop names for destructuring
    const props = [];
    if (component.definition.defaultProps) {
      props.push(...Object.keys(component.definition.defaultProps));
    }

    // Replace {{key}} -> {key} in markup
    // We handle attributes first: attr="{{val}}" -> attr={val}
    props.forEach(p => {
      // 1. Attribute substitution (remove quotes): someProp="{{text}}" -> someProp={text}
      const attrRegex = new RegExp(`=["']{{${p}}}["']`, 'g');
      jsxBody = jsxBody.replace(attrRegex, `={${p}}`);

      // 2. Text Content substitution: >{{text}}< -> >{text}<
      const contentRegex = new RegExp(`{{${p}}}`, 'g');
      jsxBody = jsxBody.replace(contentRegex, `{${p}}`);
    });

    // Build Props Destructuring String: ({ label = "Click Me", ... })
    // Default to "(props)" if empty, because "{} =>" is invalid syntax.
    let propsString = "(props)";
    if (props.length > 0) {
      propsString = "({ " + props.map(p => {
        const def = component.definition.defaultProps[p];
        const defVal = typeof def === 'string' ? `"${def}"` : def;
        return `${p} = ${defVal}`;
      }).join(", ") + " })";
    }

    const jsxContent = `import React from 'react';
import './${cssFileName}';

export const ${safeName} = ${propsString} => {
  return (
    <>
      ${jsxBody}
    </>
  );
};
`;

    // 3. DETERMINE VERSION (Already calculated above)


    // 4. GENERATE PACKAGE.JSON
    const packageJson = {
      name: `@sudarshanaui/${component.name.toLowerCase().replace(/\s+/g, "-")}`,
      version: pkgVersion,
      main: "index.js",
      peerDependencies: {
        react: ">=16"
      }
    };

    // 5. GENERATE INDEX.JS
    const indexJs = `export * from './${fileName}';`;

    return res.status(200).json({
      success: true,
      files: {
        "package.json": JSON.stringify(packageJson, null, 2),
        "index.js": indexJs,
        [`${fileName}.jsx`]: jsxContent,
        [cssFileName]: cssContent,
        "README.md": `# ${component.name}\n\nGenerated by Sudarshana UI.\n\n## Usage\n\n\`\`\`jsx\nimport { ${safeName} } from './${fileName}';\n\n<${safeName} />\n\`\`\``
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to generate package" });
  }
};

/**
 * ----------------------------
 * NPM PUBLICATION WORKFLOW
 * ----------------------------
 */

// 1. REQUEST NPM PUBLICATION (Owner)
exports.requestNpmPublish = async (req, res) => {
  try {
    const { id } = req.params;
    const component = await Component.findById(id);

    if (!component) return res.status(404).json({ success: false, message: "Component not found" });

    // Only owner
    if (component.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Must be approved first (The code must be valid)
    if (component.status !== "approved") {
      return res.status(400).json({ success: false, message: "Component must be approved in Sudarshana first." });
    }

    component.npmStatus = "requested";
    await component.save();

    return res.status(200).json({ success: true, message: "NPM Publication Requested", component });
  } catch (err) {
    console.error("NPM Request Error:", err);
    return res.status(500).json({ success: false, message: "Failed to request NPM publish" });
  }
};

// 2. CONFIRM PUBLISH (Admin)
// This simulates the actual npm publish process
exports.confirmNpmPublish = async (req, res) => {
  try {
    const { id } = req.params;

    // Admin check is done in middleware, but safe to double check or if logic moves
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    const component = await Component.findById(id);
    if (!component) return res.status(404).json({ success: false, message: "Component not found" });

    // SIMULATED PUBLISH PROCESS
    // In real world: 
    // 1. Write generatePackage() output to /tmp
    // 2. Exec `npm publish`

    const packageName = `@sudarshanaui/${component.name.toLowerCase().replace(/\s+/g, "-")}`;

    component.npmStatus = "published";
    component.npmPackageName = packageName;
    component.publishedVersion = component.version; // Syncs current version to printed version

    await component.save();
    console.log(`[NPM PUBLISH] Component ${component.name} published. Status: ${component.npmStatus}`);

    return res.status(200).json({
      success: true,
      message: `Successfully published ${packageName}@${component.version} to NPM`,
      component
    });
  } catch (err) {
    console.error("NPM Publish Error:", err);
    return res.status(500).json({ success: false, message: "Failed to publish to NPM" });
  }
}


/**
 * GET PUBLISHED NPM COMPONENTS (Public Gallery)
 */
exports.getPublishedNpmComponents = async (req, res) => {
  try {
    const components = await Component.find({ npmStatus: "published" })
      .populate("owner", "name")
      .select("name category description version npmPackageName publishedVersion definition.styles definition.image updatedAt");

    console.log(`[GALLERY] Found ${components.length} published components.`);
    if (components.length === 0) {
      // Debug: Check if any exist at all, or if status is wrong
      const all = await Component.countDocuments({});
      console.log(`[GALLERY DEBUG] Total components in DB: ${all}`);
    }

    return res.status(200).json({ success: true, components });
  } catch (err) {
    console.error("Gallery Error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch gallery" });
  }
};

/**
 * GET UNIQUE CATEGORIES
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Component.find({ status: "approved" }).distinct("category");
    // Case-insensitive sort
    const sorted = categories.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    return res.status(200).json({ success: true, categories: sorted });
  } catch (err) {
    console.error("Categories Error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};
