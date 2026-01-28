const User = require("../models/user.model");
const Component = require("../models/componentModel");

/**
 * Assign verifieduser role to a user
 * Admin only
 */
exports.assignVerifiedUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Prevent changing admin role
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot modify admin role"
      });
    }

    user.role = "verifieduser";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated to verifieduser",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to assign role"
    });
  }
};

/**
 * Get All Users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      users
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};

/**
 * Revoke Verified User Role (Demote to 'user')
 */
exports.revokeVerifiedUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ success: false, message: "Cannot modify admin" });

    user.role = "user";
    await user.save();

    return res.status(200).json({ success: true, message: "User role revoked", user });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to revoke role" });
  }
};
/**
 * Delete User (Admin Only)
 */
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ success: false, message: "Cannot delete admin" });

    // Optionally delete their components or keep them orphaned (orphaned is safer for history unless mandated)
    // For now, let's delete their components to keep DB clean
    await Component.deleteMany({ owner: userId });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ success: true, message: "User and their components deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

/**
 * Get User Activity (Components created)
 */
exports.getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    // Get latest 20 components
    const components = await Component.find({ owner: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("name status version createdAt category");

    return res.status(200).json({ success: true, components });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch activity" });
  }
};
