const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user.model");

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "token not found"
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user data from DB to ensure roles are up-to-date
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user; // Now contains fresh role from DB
    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "token is invalid"
    });
  }
};

exports.softAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).select("-password");
      req.user = user || null;
    } catch (e) {
      req.user = null;
    }
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

exports.isuser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({
      success: false,
      message: "user access only"
    });
  }
  next();
};

exports.isverifieduser = (req, res, next) => {
  if (req.user.role !== "verifieduser" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "verified user access only"
    });
  }
  next();
};

exports.isadmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "admin access only"
    });
  }
  next();
};
