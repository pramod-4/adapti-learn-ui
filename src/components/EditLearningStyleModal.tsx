import React, { useState } from "react";
import { X } from "lucide-react";
import { LearningStyle } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";


interface Props {
  userId: number;
  currentStyle: LearningStyle;
  onClose: () => void;
}

const EditLearningStyleModal: React.FC<Props> = ({ userId, currentStyle, onClose }) => {
  const [formData, setFormData] = useState<LearningStyle>(currentStyle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {updateLearningStyles} = useAuth();
  

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value as LearningStyle[keyof LearningStyle] });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`http://127.0.0.1:8000/profile/update-style/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      updateLearningStyles(formData);
      if (!response.ok) throw new Error(data.detail || "Failed to update learning style");

      alert("Learning style updated successfully!");
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Edit Learning Style
        </h2>

        <div className="space-y-3">
          <select
            name="active_reflective"
            value={formData.active_reflective}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Active">Active Learner</option>
            <option value="Reflective">Reflective Learner</option>
          </select>

          <select
            name="sensing_intuitive"
            value={formData.sensing_intuitive}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Sensing">Sensing Learner</option>
            <option value="Intuitive">Intuitive Learner</option>
          </select>

          <select
            name="visual_verbal"
            value={formData.visual_verbal}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Visual">Visual Learner</option>
            <option value="Verbal">Verbal Learner</option>
          </select>

          <select
            name="sequential_global"
            value={formData.sequential_global}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Sequential">Sequential Learner</option>
            <option value="Global">Global Learner</option>
          </select>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLearningStyleModal;
