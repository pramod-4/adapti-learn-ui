"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import AuthModal from "./AuthModal";
import Dashboard from "./Dashbord";
import OperatingSystemsNotes from "./OperatingSystemNotes";

import { useAuth } from "../context/AuthContext";

const initialFormState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  active_reflective: "Active",
  sensing_intuitive: "Sensing",
  visual_verbal: "Visual",
  sequential_global: "Sequential",
};

export default function App() {
  const { isLoggedIn, username, login, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const openLogin = () => {
      setAuthMode("login");
      setShowAuthModal(true);
    };
    const openSignup = () => {
      setAuthMode("signup");
      setShowAuthModal(true);
    };

    window.addEventListener("auth:login", openLogin);
    window.addEventListener("auth:signup", openSignup);

    return () => {
      window.removeEventListener("auth:login", openLogin);
      window.removeEventListener("auth:signup", openSignup);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
              active_reflective: formData.active_reflective,
              sensing_intuitive: formData.sensing_intuitive,
              visual_verbal: formData.visual_verbal,
              sequential_global: formData.sequential_global,
            };

      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || data.message || "Authentication failed");

      login(data.username || formData.username, data.user_id, data.learning_style);
      setShowAuthModal(false);
      setFormData(initialFormState);
    } catch (err: unknown) {
      if(err instanceof Error) setError(err.message);
      else setError("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      {!isLoggedIn ? (
        <>
          <HeroSection onSignup={() => setShowAuthModal(true)} />
          <FeaturesSection />
        </>
      ) : (
        <>
          <Dashboard username={username} />
          <OperatingSystemsNotes />
        </>
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
