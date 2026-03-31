import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Yetkisiz" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Yetkisiz" });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Yetkisiz" });
  }
};

export const requireAuth = protect;


export const adminOnly = (req, res, next) => {
  if (req.user.email !== "fawaddilawar24@gmail.com") {
    return res.status(403).json({ message: "Admin yetkisi yok!" });
  }
  next();
};
