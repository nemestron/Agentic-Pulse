"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-surface border border-border rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-accent text-center">Sign In</h1>
      {registered && <div className="mb-4 p-3 bg-success/10 border border-success text-success rounded text-sm text-center">Registration successful. Please log in.</div>}
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
            className="w-full p-2.5 bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 mt-2 bg-accent text-background font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-border">
        No account?{" "}
        <Link href="/register" className="text-accent hover:underline font-medium">
          Register here
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div className="text-accent">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}