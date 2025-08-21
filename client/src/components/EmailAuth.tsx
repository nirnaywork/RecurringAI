import React, { useState } from "react";

type Props = {
  onAuthSuccess: (user: any) => void;
};

export default function EmailAuth({ onAuthSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Replace with your actual auth logic
      let user;
      if (mode === "login") {
        // user = await loginWithEmail(email);
        user = { email }; // mock
      } else {
        // user = await signUpWithEmail(email);
        user = { email }; // mock
      }
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Sign Up"}
        </h2>
        <input
          type="email"
          required
          placeholder="Email address"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
        </button>
        <div className="mt-4 text-center">
          {mode === "login" ? (
            <span>
              New here?{" "}
              <button
                type="button"
                className="underline text-blue-600"
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                className="underline text-blue-600"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
