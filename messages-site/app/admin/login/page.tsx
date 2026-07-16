"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSigningIn(true);
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.log("Admin login error:", error);
      setLoginError("The email or password was incorrect.");
      setIsSigningIn(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-xl px-6 py-16">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
            Private access
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
            Admin Sign In
          </h1>

          <div className="mx-auto mt-5 h-px w-32 bg-pink-500/70" />

          <p className="mt-6 leading-7 text-gray-400">
            Sign in to review and moderate submitted letters.
          </p>
        </div>

        <div className="relative mt-12 border border-pink-400/50 bg-gradient-to-b from-zinc-950 to-black p-8 shadow-[0_0_35px_rgba(236,72,153,0.18)]">
          <div className="mb-7 text-center text-5xl">🔐</div>

          {loginError && (
            <div className="mb-6 border border-red-400/50 bg-red-950/40 p-4 text-center text-red-200">
              {loginError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm uppercase tracking-[0.18em] text-pink-300"
              >
                Admin Email
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-white/20 bg-black/70 px-4 py-3 text-white outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm uppercase tracking-[0.18em] text-pink-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border border-white/20 bg-black/70 px-4 py-3 text-white outline-none focus:border-pink-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full border border-pink-300 bg-gradient-to-r from-pink-900 via-pink-700 to-pink-500 px-6 py-4 font-serif uppercase tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningIn ? "Opening Dashboard..." : "Sign In"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}