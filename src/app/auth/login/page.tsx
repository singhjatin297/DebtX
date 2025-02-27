"use client";

import { useLoginMutation } from "@/store/apiSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const validatedData = loginSchema.parse({ username, password });
      await login(validatedData).unwrap();
      toast.success("Logged in successfully");
      router.push("/customers");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors = err.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {} as Record<string, string>);
        setFormErrors(errors);
      } else {
        toast.error("Login failed: Invalid credentials");
        console.error("Login failed:", err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-100">
      <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-gray-900">DebtX</h1>
        <p className="text-lg text-gray-600">Login to your account</p>
        <div className="flex flex-col gap-4 w-full">
          <div>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full border-gray-300 focus:ring-blue-500"
            />
            {formErrors.username && (
              <p className="text-red-600 text-sm">{formErrors.username}</p>
            )}
          </div>
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border-gray-300 focus:ring-blue-500"
            />
            {formErrors.password && (
              <p className="text-red-600 text-sm">{formErrors.password}</p>
            )}
          </div>
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <p className="text-sm text-gray-500 text-center">
            Don’t have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
