import React from "react";
import { X } from "lucide-react";

interface Props {
  mode: "login" | "signup";
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onClose: () => void;
  error: string;
  loading: boolean;
  toggleMode: () => void;
}

const AuthModal: React.FC<Props> = ({
  mode,
  formData,
  onChange,
  onSubmit,
  onClose,
  error,
  loading,
  toggleMode,
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-600">
          {mode === "login"
            ? "Log in to continue your learning journey"
            : "Join thousands of adaptive learners"}
        </p>
      </div>

      <div className="space-y-4">
        {mode === "signup" && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        {mode === "signup" && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
        </button>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={toggleMode}
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  </div>
);

export default AuthModal;
