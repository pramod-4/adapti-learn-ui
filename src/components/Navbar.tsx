import React from "react";
import { Brain } from "lucide-react";

interface NavbarProps {
  isLoggedIn: boolean;
  username: string;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  username,
  onLogin,
  onSignup,
  onLogout,
}) => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AdaptiLearn
          </span>
        </div>

        {!isLoggedIn ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={onLogin}
              className="px-5 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition"
            >
              Log in
            </button>
            <button
              onClick={onSignup}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition"
            >
              Sign up
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium">Hi, {username}!</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
