import React, { useState } from "react";
import { Brain, User, ChevronDown, LogOut, Settings } from "lucide-react";
import EditLearningStyleModal from "./EditLearningStyleModal";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { isLoggedIn, username, userId, learningStyles, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
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
                onClick={() => {
                  const loginEvent = new CustomEvent("auth:login");
                  window.dispatchEvent(loginEvent);
                }}
                className="px-5 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  const signupEvent = new CustomEvent("auth:signup");
                  window.dispatchEvent(signupEvent);
                }}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition"
              >
                Sign up
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition"
              >
                <User className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700 font-medium">{username}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg py-3">
                  <div className="px-4 pb-3 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Logged in as</p>
                    <p className="font-semibold text-gray-800">{username}</p>
                  </div>

                  {learningStyles && (
                    <div className="px-4 py-3 border-b border-gray-100 text-sm text-gray-700 space-y-1">
                      <p>
                        <strong>Active/Reflective:</strong>{" "}
                        {learningStyles.active_reflective}
                      </p>
                      <p>
                        <strong>Sensing/Intuitive:</strong>{" "}
                        {learningStyles.sensing_intuitive}
                      </p>
                      <p>
                        <strong>Visual/Verbal:</strong>{" "}
                        {learningStyles.visual_verbal}
                      </p>
                      <p>
                        <strong>Sequential/Global:</strong>{" "}
                        {learningStyles.sequential_global}
                      </p>
                    </div>
                  )}

                  <button
                    className="w-full text-left flex items-center px-4 py-2 hover:bg-indigo-50 text-indigo-600 font-medium transition"
                    onClick={() => {
                      setShowMenu(false);
                      setShowEditModal(true);
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Learning Style
                  </button>

                  <button
                    className="w-full text-left flex items-center px-4 py-2 hover:bg-red-50 text-red-600 font-medium transition"
                    onClick={() => {
                      setShowMenu(false);
                      logout();
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {showEditModal && learningStyles && userId && (
        <EditLearningStyleModal
          userId={userId}
          currentStyle={learningStyles}
          onClose={() => setShowEditModal(false)}
        />
      )}

    </>
  );
};

export default Navbar;
