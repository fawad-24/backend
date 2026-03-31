import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", (_req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: false });
  res.json({ message: "Çıkış yapıldı" });
});
router.get("/me", protect, getMe);

export default router;
