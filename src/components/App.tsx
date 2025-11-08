"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import AuthModal from "./AuthModal"; 
import Dashboard from "./Dashbord";
import { useAuth } from "../context/AuthContext";

export default function App() {
  const { isLoggedIn, username, login, logout } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleAuth = async () => {
    setError("");
    setLoading(true);

    try {
      const endpoint = authMode === "login" ? "/auth/login" : "/auth/signup";
      const body =
        authMode === "login"
          ? { email: formData.email, password: formData.password }
          : {
              username: formData.username,
              email: formData.email,
              password: formData.password,
            };

      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || data.message || "Authentication failed");

      // ✅ update context
      login(data.username || formData.username, data.user_id);

      setShowAuthModal(false);
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar
        isLoggedIn={isLoggedIn}
        username={username}
        onLogin={() => {
          setAuthMode("login");
          setShowAuthModal(true);
        }}
        onSignup={() => {
          setAuthMode("signup");
          setShowAuthModal(true);
        }}
        onLogout={logout}
      />

      {!isLoggedIn ? (
        <>
          <HeroSection onSignup={() => setShowAuthModal(true)} />
          <FeaturesSection />
        </>
      ) : (
        <Dashboard username={username} />
      )}

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleAuth}
          onClose={() => setShowAuthModal(false)}
          error={error}
          loading={loading}
          toggleMode={() =>
            setAuthMode(authMode === "login" ? "signup" : "login")
          }
        />
      )}
    </div>
  );
}
