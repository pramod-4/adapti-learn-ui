import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface ParameterData {
  interaction_count: number;
  avg_session_length: number;
  time_visual_content: number;
  time_text_content: number;
  visual_text_ratio: number;
  quiz_score_visual: number;
  quiz_score_text: number;
  navigation_jump_count: number;
  reflection_time_avg: number;
  content_revisit_rate: number;
  theory_practice_ratio: number;
}

interface Props {
  userId: number;
  currentStyle: {
    active_reflective: string;
    sensing_intuitive: string;
    visual_verbal: string;
    sequential_global: string;
    parameters: ParameterData; 
  };
  onClose: () => void;
}

export default function EditLearningStyleModal({ userId, currentStyle, onClose }: Props) {
  const [form, setForm] = useState(currentStyle);
  const [loading, setLoading] = useState(false);
  const { updateLearningStyles } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/profile/update-style/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          active_reflective: form.active_reflective,
          sensing_intuitive: form.sensing_intuitive,
          visual_verbal: form.visual_verbal,
          sequential_global: form.sequential_global,
          parameters: form.parameters, 
        }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (!response.ok) throw new Error(data.detail || "Failed to update learning style");

      updateLearningStyles({
        active_reflective: data.updated_profile.active_reflective,
        sensing_intuitive: data.updated_profile.sensing_intuitive,
        visual_verbal: data.updated_profile.visual_verbal,
        sequential_global: data.updated_profile.sequential_global,
        parameters: data.updated_profile.parameters, 
      });

      alert("✅ Learning style updated successfully!");
      onClose();
    } catch (err: any) {
      console.error("Error updating learning style:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Learning Style</h2>

        {/* Style dropdowns */}
        <div className="space-y-3">
          {["active_reflective", "sensing_intuitive", "visual_verbal", "sequential_global"].map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace("_", " ")}
              </label>
              <select
                name={key}
                value={(form as any)[key]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {key === "active_reflective" && (
                  <>
                    <option value="Active">Active</option>
                    <option value="Reflective">Reflective</option>
                  </>
                )}
                {key === "sensing_intuitive" && (
                  <>
                    <option value="Sensing">Sensing</option>
                    <option value="Intuitive">Intuitive</option>
                  </>
                )}
                {key === "visual_verbal" && (
                  <>
                    <option value="Visual">Visual</option>
                    <option value="Verbal">Verbal</option>
                  </>
                )}
                {key === "sequential_global" && (
                  <>
                    <option value="Sequential">Sequential</option>
                    <option value="Global">Global</option>
                  </>
                )}
              </select>
            </div>
          ))}
        </div>

        {/* Footer buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
