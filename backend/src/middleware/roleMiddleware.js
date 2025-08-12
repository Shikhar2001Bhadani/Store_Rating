const roleMiddleware = (roles = []) => {
    if (typeof roles === "string") roles = [roles];
    return (req, res, next) => {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      if (!roles.length || roles.includes(req.user.role)) return next();
      return res.status(403).json({ message: "Forbidden" });
    };
  };
  
  module.exports = roleMiddleware;
  