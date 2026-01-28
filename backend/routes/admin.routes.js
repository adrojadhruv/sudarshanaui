const express = require("express");
const router = express.Router();

const { assignVerifiedUser, getAllUsers, revokeVerifiedUser, deleteUser, getUserActivity } = require("../controllers/admin");
const { auth, isadmin } = require("../middleware/auth.middleware.js");

/**
 * Get All Users
 */
router.get("/admin/users", auth, isadmin, getAllUsers);

/**
 * Get User Activity
 */
router.get("/admin/users/:userId/activity", auth, isadmin, getUserActivity);

/**
 * Delete User
 */
router.delete("/admin/users/:userId", auth, isadmin, deleteUser);

/**
 * Assign verifieduser role
 * Admin only
 */
router.put(
  "/admin/users/:userId/verify",
  auth,
  isadmin,
  assignVerifiedUser
);

/**
 * Revoke verifieduser role
 */
router.put(
  "/admin/users/:userId/revoke",
  auth,
  isadmin,
  revokeVerifiedUser
);

module.exports = router;
