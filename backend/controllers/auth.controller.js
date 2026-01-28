const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken"); // ✅ FIXED
const axios = require("axios"); // For OAuth
require("dotenv").config();

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body; // ❌ role removed (security)

    // 1. Validate Input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password"
      });
    }

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({
        success: false,
        message: "user already exists.."
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedpassword,
      role: "user" // ✅ default role
    });

    return res.status(200).json({
      success: true,
      message: "user created successfully.."
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "user cannot be registered, please try again"
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "please fill all details carefully.."
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "there is no user exist with this email..."
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role
    };

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "12h"
      });

      user = user.toObject();
      user.password = undefined;

      res.cookie("token", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true
      }).status(200).json({
        success: true,
        token,
        user,
        message: "user logged in successfully"
      });

    } else {
      return res.status(403).json({
        success: false,
        message: "password incorrect"
      });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "error occurred"
    });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { expires: new Date(Date.now()) })
      .json({
        success: true,
        message: "User logged out successfully"
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};

// UPDATE AVATAR
exports.updateAvatar = async (req, res) => {
  try {
    const { uploadToCloudinary } = require("../utils/cloudinary"); // Import utility

    // ... inside updateAvatar ...
    let { avatar } = req.body;
    const userId = req.user.id;

    // If it's a Base64 string (starts with "data:"), upload to Cloudinary
    if (avatar && avatar.startsWith("data:")) {
      console.log("Uploading avatar to Cloudinary...");
      avatar = await uploadToCloudinary(avatar, "sudarshana_profiles");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update avatar"
    });
  }
};

// UPDATE PROFILE (Name & Password)
exports.updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const userId = req.user.id;

    const updates = {};
    if (name) updates.name = name;
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};

// --- GOOGLE OAUTH ---
exports.googleAuth = (req, res) => {
  const redirectUri = "https://accounts.google.com/o/oauth2/v2/auth";
  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
  const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${SERVER_URL}/api/v1/auth/google/callback`,
    response_type: "code",
    scope: "profile email",
    access_type: "offline",
    prompt: "consent"
  });
  res.redirect(`${redirectUri}?${params.toString()}`);
};

exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";

    if (!code) return res.status(400).json({ message: "Authorization code missing" });

    // 1. Exchange code for tokens
    const { data: { access_token } } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${SERVER_URL}/api/v1/auth/google/callback`
    });

    // 2. Get User Info
    const { data: profile } = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // 3. Find or Create User
    let user = await User.findOne({ email: profile.email });

    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        if (!user.avatar) user.avatar = profile.picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name: profile.name,
        email: profile.email,
        googleId: profile.id,
        avatar: profile.picture,
        role: "user"
      });
    }

    // 4. Generate Token & Cookie
    const payload = { email: user.email, id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    res.redirect(`${CLIENT_URL}/components`);

  } catch (err) {
    console.error("Google Auth Error:", err.response?.data || err.message);
    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${CLIENT_URL}/login?error=GoogleAuthFailed`);
  }
};

// --- GITHUB OAUTH ---
exports.githubAuth = (req, res) => {
  const redirectUri = "https://github.com/login/oauth/authorize";
  const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: `${SERVER_URL}/api/v1/auth/github/callback`,
    scope: "user:email",
  });
  res.redirect(`${redirectUri}?${params.toString()}`);
};

exports.githubCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

    if (!code) return res.status(400).json({ message: "Authorization code missing" });

    // 1. Exchange code for tokens
    const { data: { access_token } } = await axios.post("https://github.com/login/oauth/access_token", {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }, { headers: { Accept: "application/json" } });

    // 2. Get User Info
    const { data: profile } = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // GitHub emails might be private
    let email = profile.email;
    if (!email) {
      const { data: emails } = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      email = emails.find(e => e.primary && e.verified)?.email;
    }

    if (!email) throw new Error("No verified email found on GitHub account");

    // 3. Find or Create User
    let user = await User.findOne({ email });

    if (user) {
      if (!user.githubId) {
        user.githubId = profile.id.toString();
        if (!user.avatar) user.avatar = profile.avatar_url;
        await user.save();
      }
    } else {
      user = await User.create({
        name: profile.name || profile.login,
        email,
        githubId: profile.id.toString(),
        avatar: profile.avatar_url,
        role: "user"
      });
    }

    // 4. Generate Token & Cookie
    const payload = { email: user.email, id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    res.redirect(`${CLIENT_URL}/components`);

  } catch (err) {
    console.error("GitHub Auth Error:", err.response?.data || err.message);
    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${CLIENT_URL}/login?error=GithubAuthFailed`);
  }
};
