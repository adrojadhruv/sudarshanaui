const express = require("express");
const router = express.Router();

const { login, signup, logout, updateAvatar, updateProfile, googleAuth, googleCallback, githubAuth, githubCallback } = require("../controllers/auth.controller");
const { auth, isuser, isadmin } = require("../middleware/auth.middleware"); // ✅ FIXED

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.put("/update-avatar", auth, updateAvatar);
router.put("/update-profile", auth, updateProfile);

// OAuth Routes
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleCallback);
router.get("/auth/github", githubAuth);
router.get("/auth/github/callback", githubCallback);

router.get("/test", auth, (req, res) => {
  res.json({
    success: true,
    message: "welcome authentic user.."
  });
});

// Protected user route
router.get("/user", auth, isuser, (req, res) => {
  res.json({
    success: true,
    message: "welcome user.."
  });
});

// GET CURRENT USER (Session Persistence)
router.get("/me", auth, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user, // payload from jwt
    message: "User verified"
  });
});

// Admin route
router.get("/admin", auth, isadmin, (req, res) => {
  res.json({
    success: true,
    message: "welcome admin"
  });
});

module.exports = router;
