// src/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw && raw !== "undefined" && raw !== "null") {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      } else {
        // cleanup any invalid entries
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.warn("AuthContext: invalid user in localStorage, clearing it.", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData ?? null);
    try {
      if (userData) localStorage.setItem("user", JSON.stringify(userData));
      if (token) localStorage.setItem("token", token);
    } catch (err) {
      console.warn("AuthContext: failed to persist user/token", err);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (err) {
      console.warn("AuthContext: failed to clear localStorage", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
