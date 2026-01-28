const Component = require("../models/componentModel");

/**
 * Allow only component owner OR admin
 */
exports.isOwnerOrAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const component = await Component.findById(id);

    if (!component) {
      return res.status(404).json({
        success: false,
        message: "Component not found"
      });
    }

    // Admin can always proceed
    if (req.user.role === "admin") {
      return next();
    }

    // Owner check
    if (component.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to modify this component"
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Ownership verification failed"
    });
  }
};
