const express = require("express");
const router = express.Router();

const {
  createComponent,
  getComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
  submitForApproval,
  approveComponent,
  rejectComponent,
  revertComponent,
  createNewVersion,
  getComponentVersions,
  getVersionDetails,
  generatePackage,
  requestNpmPublish,
  confirmNpmPublish,
  getPublishedNpmComponents,
  getCategories
} = require("../controllers/component");

const { auth, isverifieduser, isadmin, softAuth } = require("../middleware/auth.middleware.js");
const { isOwnerOrAdmin } = require("../middleware/ownership");

/**
 * CREATE COMPONENT
 * verifieduser only
 */
router.post(
  "/components",
  auth,
  isverifieduser,
  createComponent
);

/**
 * GET PUBLIC COMPONENTS
 * Public route for gallery
 */
router.get(
  "/public",
  getComponents
);

/**
 * GET ALL APPROVED COMPONENTS
 * public route (actually protected for dashboard)
 */
router.get(
  "/components",
  auth,
  getComponents
);

/**
 * GET SINGLE COMPONENT
 */

// Categories
router.get("/categories", getCategories);

// NPM Gallery (Must be before :id)
router.get("/components/npm", getPublishedNpmComponents);

router.get(
  "/components/:id",
  softAuth,
  getComponentById
);

/**
 * UPDATE COMPONENT
 * verifieduser + owner OR admin
 */
router.put(
  "/components/:id",
  auth,
  isverifieduser,
  isOwnerOrAdmin,
  updateComponent
);

/**
 * DELETE COMPONENT
 * verifieduser + owner OR admin
 */
router.delete(
  "/components/:id",
  auth,
  isverifieduser,
  isOwnerOrAdmin,
  deleteComponent
);

/**
 * SUBMIT COMPONENT FOR APPROVAL
 * owner only (verifieduser)
 */
router.post(
  "/components/:id/submit",
  auth,
  isverifieduser,
  isOwnerOrAdmin,
  submitForApproval
);

/**
 * APPROVE COMPONENT
 * admin only
 */
router.post(
  "/components/:id/approve",
  auth,
  isadmin,
  isadmin,
  approveComponent
);

/**
 * REJECT COMPONENT
 * admin only
 */
router.post(
  "/components/:id/reject",
  auth,
  isadmin,
  rejectComponent
);

/**
 * REVERT COMPONENT (Discard changes/delete if new)
 * verifieduser + owner OR admin
 */
router.post(
  "/components/:id/revert",
  auth,
  isverifieduser,
  isOwnerOrAdmin,
  revertComponent
);

/**
 * CREATE NEW VERSION
 * verifieduser + owner OR admin
 */
router.post(
  "/components/:id/version",
  auth,
  isverifieduser,
  isOwnerOrAdmin,
  createNewVersion
);

// ... (existing routes)

router.get("/components/:id/versions", auth, getComponentVersions);
router.get("/versions/:id", auth, getVersionDetails);
router.get("/components/:id/package", auth, generatePackage);

/**
 * NPM WORKFLOW
 */




// Request (Owner)
router.post(
  "/components/:id/npm-request",
  auth,
  isverifieduser,
  isOwnerOrAdmin,
  requestNpmPublish
);

// Publish (Admin)
router.post(
  "/components/:id/npm-publish",
  auth,
  isadmin,
  confirmNpmPublish
);

module.exports = router;
