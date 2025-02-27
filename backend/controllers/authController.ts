import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { registerUser, loginUser } from "../services/authService";
import logger from "../logger";

const SECRET = process.env.JWT_SECRET || "your-secret";

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await registerUser(username, password);
    res.status(201).json({ message: "User registered", userId: user.id });
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: "Username already taken" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await loginUser(username, password);
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1d" });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Logged in successfully" });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ error: "Invalid credentials" });
  }
};

export const checkAuth = (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) return res.json({ isAuthenticated: false });
  try {
    jwt.verify(token, SECRET);
    res.json({ isAuthenticated: true });
  } catch (error) {
    logger.error(error);
    res.json({ isAuthenticated: false });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
