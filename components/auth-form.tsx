"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useApi } from "@/context/apiContext";
import type { RegisterDTO, LoginDTO } from "@/types/index";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { login, register } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password || (!isLogin && !name)) {
        setError("Please fill in all fields");
        return;
      }

      if (isLogin) {
        const payload: LoginDTO = { email, password };
        const resp = await login(payload);
        if (!resp || resp.success === false) {
          setError(resp?.message || "Login failed");
          return;
        }

        // salva um "user" simples para a Home checar
        localStorage.setItem("user", JSON.stringify({ email }));
      } else {
        const payload: RegisterDTO = { name, email, password };
        const resp = await register(payload);
        if (!resp || resp.success === false) {
          setError(resp?.message || "Register failed");
          return;
        }

        localStorage.setItem("user", JSON.stringify({ name, email }));
      }

      router.push("/home");
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Authentication error";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-2 text-foreground">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            {isLogin ? "Sign in to your account" : "Sign up to get started"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground">
                  Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-destructive text-sm p-3 bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : isLogin
                ? "Sign In"
                : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
