import React from "react";
import { Brain, Zap, TrendingUp } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-7 h-7 text-white" />,
    title: "Adaptive Intelligence",
    text: "AI learns your pace, preferences, and patterns to create a personalized path.",
  },
  {
    icon: <Zap className="w-7 h-7 text-white" />,
    title: "Instant Feedback",
    text: "Get real-time explanations and guidance tailored to your understanding.",
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-white" />,
    title: "Track Progress",
    text: "Monitor growth with detailed analytics and celebrate your milestones.",
  },
];

const FeaturesSection = () => (
  <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-7xl mx-auto px-6">
    {features.map((f, i) => (
      <div
        key={i}
        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition"
      >
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
          {f.icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
        <p className="text-gray-600">{f.text}</p>
      </div>
    ))}
  </div>
);

export default FeaturesSection;
