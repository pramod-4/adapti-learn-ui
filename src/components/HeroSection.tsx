import React from "react";

const HeroSection: React.FC<{ onSignup: () => void }> = ({ onSignup }) => (
  <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-8">
    <div className="inline-block">
      <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
        AI-Powered Learning
      </span>
    </div>
    <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight">
      Learn Smarter,
      <br />
      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Not Harder
      </span>
    </h1>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
      Experience personalized education that adapts to your unique learning style.
      Our AI tutor optimizes every lesson for maximum retention.
    </p>
    <button
      onClick={onSignup}
      className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl transform hover:scale-105 transition"
    >
      Start Learning Free
    </button>
  </div>
);

export default HeroSection;
