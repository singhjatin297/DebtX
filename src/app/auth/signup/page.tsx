"use client";

import { useSignupMutation } from "@/store/apiSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function SignupPage() {
  const [signup, { isLoading }] = useSignupMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const validatedData = signupSchema.parse({ username, password });
      await signup(validatedData).unwrap();
      toast.success("Signed up successfully");
      router.push("/auth/login");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors = err.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {} as Record<string, string>);
        setFormErrors(errors);
      } else {
        toast.error("Signup failed: Username may be taken");
        console.error("Signup failed:", err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-100">
      <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-gray-900">DebtX</h1>
        <p className="text-lg text-gray-600">Create your account</p>
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
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>
          <p className="text-sm text-gray-500 text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
