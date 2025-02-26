import { Router, Request, Response } from "express";
import {
  register,
  login,
  checkAuth,
  logout,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", (req: Request, res: Response) => {
  checkAuth(req, res);
});
router.post("/logout", logout);

export default router;
