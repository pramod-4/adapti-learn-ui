import React from "react";

const Dashboard: React.FC<{ username: string }> = ({ username }) => (
  <div className="max-w-7xl mx-auto px-6 py-20 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">
      Welcome back,{" "}
      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {username}
      </span>
      !
    </h1>
    <p className="text-lg text-gray-600">
      Continue your adaptive learning journey with personalized content.
    </p>
  </div>
);

export default Dashboard;
