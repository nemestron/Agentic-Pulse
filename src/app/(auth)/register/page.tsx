"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
      } else {
        router.push("/login?registered=true");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-surface border border-border rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-accent text-center">Create Account</h1>
        {error && <div className="mb-4 p-3 bg-error/10 border border-error text-error rounded text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full p-2.5 bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full p-2.5 bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-accent text-background font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-border">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}