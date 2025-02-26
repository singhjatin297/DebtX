import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await registerUser(username, password);
    res.status(201).json({ message: "User registered", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Username already taken" });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log("Login request received:", req.body);
  const { username, password } = req.body;
  try {
    const user = await loginUser(username, password);
    res.cookie("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      signed: true,
    });
    res.json({ message: "Logged in successfully" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid credentials" });
  }
};

export const checkAuth = (req: Request, res: Response) => {
  const userId = req.signedCookies.session;
  if (!userId) {
    return res.json({ isAuthenticated: false });
  }
  res.json({ isAuthenticated: true });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("session");
  res.json({ message: "Logged out successfully" });
};
