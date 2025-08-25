// src/Components/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// adjust path if AuthContext.jsx is in a different folder
import { useAuth } from "../src/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // don't destructure directly — the provider might not be present (defensive)
  const auth = useAuth?.(); // if useAuth is undefined, auth will be undefined

  const currentUser = auth?.user ?? null;
  const loginFn = auth?.login ?? null;

  // If already logged in, redirect to home
  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { email, password }
      );

      const payload = response?.data ?? {};

      // Support several shapes that backend might return:
      // 1) { data: { user, accessToken } }
      // 2) { user, accessToken }
      // 3) { user: {...}, token: '...' }
      const loggedUser =
        payload?.data?.user || payload?.user || payload?.data || payload || null;

      const token =
        payload?.data?.accessToken ||
        payload?.accessToken ||
        payload?.token ||
        payload?.data?.token ||
        null;

      if (!loggedUser) {
        throw new Error("Login response did not include user data.");
      }

      // Prefer provider login if available
      if (typeof loginFn === "function") {
        try {
          loginFn(loggedUser, token); // provider should persist to localStorage if implemented
        } catch (err) {
          console.warn("Auth provider login threw:", err);
          // fallback to localStorage if provider fails
          try {
            localStorage.setItem("user", JSON.stringify(loggedUser));
            if (token) localStorage.setItem("token", token);
          } catch (storageErr) {
            console.warn("Failed to persist to localStorage:", storageErr);
          }
        }
      } else {
        // If no provider available, persist manually
        try {
          localStorage.setItem("user", JSON.stringify(loggedUser));
          if (token) localStorage.setItem("token", token);
        } catch (storageErr) {
          console.warn("Failed to persist to localStorage:", storageErr);
        }
      }

      navigate("/");
    } catch (err) {
      // Prefer detailed server message when available
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-cyan-400 to-orange-400">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg w-96 border border-white/20">
        <h1 className="text-blue-600 text-2xl font-bold text-center mb-2">
          Collabify
        </h1>
        <h2 className="text-xl font-bold mb-6 text-black text-center">Login</h2>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
