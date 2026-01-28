const express = require("express");
const router = express.Router();
const Collaboration = require("../models/collaboration.model");
const Component = require("../models/componentModel");
const Version = require("../models/version.model");
const User = require("../models/user.model"); // Assuming auth middleware attaches user
const { auth } = require("../middleware/auth.middleware.js");

// Middleware to ensure user is logged in (simplified for this example, usually handled by auth middleware)
// const ensureAuth = (req, res, next) => {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });
//     next();
// };

const ensureAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: "Access denied" });
    next();
};

// 1. Submit a Proposal
router.post("/request", auth, async (req, res) => {
    try {
        const { componentId, proposal, baseVersion } = req.body;

        // Find component to get owner
        const component = await Component.findById(componentId);
        if (!component) return res.status(404).json({ message: "Component not found" });

        if (component.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot submit a collaboration request to your own component. Just edit it!" });
        }

        const newRequest = new Collaboration({
            component: componentId,
            baseVersion,
            requester: req.user._id,
            owner: component.owner,
            proposal,
            status: "pending_owner"
        });

        await newRequest.save();
        res.status(201).json({ message: "Proposal submitted to owner", request: newRequest });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 1.5 Get Single Request (For Review in Editor)
router.get("/requests/:id", auth, async (req, res) => {
    try {
        const request = await Collaboration.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        // Security: Only Owner, Admin, or Requester can view? 
        // For now, if we want to allow public review links potentially (or just shared), maybe looser?
        // But stricter is better: Requester, Owner, Admin.
        const isAdmin = req.user.role === 'admin';
        const isOwner = request.owner.toString() === req.user._id.toString();
        const isRequester = request.requester.toString() === req.user._id.toString();

        if (!isAdmin && !isOwner && !isRequester) {
            return res.status(403).json({ message: "Not authorized to view this request" });
        }

        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Get Requests for Owner (Pending Owner Approval)
router.get("/pending/owner", auth, async (req, res) => {
    try {
        const requests = await Collaboration.find({ owner: req.user._id, status: "pending_owner" })
            .populate("component", "name")
            .populate("requester", "name avatar");
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Get Requests for Admin (Pending Admin Approval)
router.get("/pending/admin", auth, ensureAdmin, async (req, res) => {
    try {
        const requests = await Collaboration.find({ status: "pending_admin" })
            .populate("component", "name")
            .populate("owner", "name")
            .populate("requester", "name avatar");
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. Get My Sent Requests
router.get("/my-requests", auth, async (req, res) => {
    try {
        const requests = await Collaboration.find({ requester: req.user._id })
            .populate("component", "name");
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. Owner Approves (Moves to Admin Queue)
router.put("/:id/approve/owner", auth, async (req, res) => {
    try {
        const request = await Collaboration.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        if (request.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        request.status = "pending_admin";
        await request.save();
        res.json({ message: "Approved! Sent to admin for final review.", request });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6. Admin Approves (Final Merge & Version Bump)
router.put("/:id/approve/admin", auth, ensureAdmin, async (req, res) => {
    try {
        const request = await Collaboration.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        const component = await Component.findById(request.component);
        if (!component) return res.status(404).json({ message: "Component not found" });

        // 1. Create new Version archive for the OLD version
        // Actually, we usually archive the current state before overwriting, OR the component 'version' field tracks current.
        // Let's assume we create a Version doc for the NEW state? Or we Archive existing?
        // Common pattern: Current live is in Component. Previous states in Version table.
        // Let's archive the PREVIOUS (current live) version first.
        const oldVersionDoc = new Version({
            component: component._id,
            version: component.version || "1.0.0",
            definition: component.definition
        });
        await oldVersionDoc.save();

        // 2. Bump Version
        const currentVer = component.version || "1.0.0";
        const parts = currentVer.split('.').map(Number);
        parts[1]++; // Bump minor version for feature/collab
        const newVersion = parts.join('.');

        // 3. Update Component
        component.definition = request.proposal;
        component.version = newVersion;
        component.lastCollaborator = request.requester; // Record who made this change

        // Add to collaborators list (ensure unique)
        component.collaborators.addToSet(request.requester);

        await component.save();

        // 4. Update Request Status
        request.status = "approved";
        request.adminComments = "Merged by Admin";
        await request.save();

        // 5. Check Verification Eligibility (Feature: Suggest Verification)
        try {
            const ownerUser = await User.findById(component.owner);
            const requesterUser = await User.findById(request.requester);

            if (ownerUser && requesterUser) {
                // If a normal User collaborates with a Verified User, flag them!
                if (ownerUser.role === 'verifieduser' && requesterUser.role === 'user') {
                    requesterUser.isVerificationCandidate = true;
                    await requesterUser.save();
                    console.log(`[Verification] User ${requesterUser.name} flagged as candidate.`);
                }
            }
        } catch (verErr) {
            console.error("Verification flag error:", verErr);
        }

        res.json({ message: `Merged successfully! Version bumped to ${newVersion}`, component });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 7. Reject (Owner or Admin)
router.put("/:id/reject", auth, async (req, res) => {
    try {
        const { reason } = req.body; // optional reason
        const request = await Collaboration.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        // Check auth: Must be owner OR admin
        const isOwner = request.owner.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Not authorized" });
        }

        request.status = "rejected";
        request.adminComments = reason || "Rejected";
        await request.save();
        res.json({ message: "Request rejected", request });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
