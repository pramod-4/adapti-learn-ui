import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const YT_VIDEOS: Record<string, string> = {
  "Unit 1: Introduction to Operating Systems": "https://www.youtube.com/embed/vBURTt97EkA",
  "Unit 2: Process Management": "https://www.youtube.com/embed/aQCrn1JPwjs",
  "Unit 3: Memory Management": "https://www.youtube.com/embed/puobwv1xjqc",
  "Unit 4: File Systems and Storage Management": "https://www.youtube.com/embed/gNy2UdMQUJU",
  "Unit 5: Deadlocks and Synchronization": "https://www.youtube.com/embed/rq-AtNXPHbM",
};

interface Topic {
  title: string;
  overview: string;
  theory: string;
  example_or_analogy?: string;
  key_points?: string[];
  real_world_examples?: string[];
  step_by_step_summary?: string[];
  conceptual_focus?: string[];
  connections?: string[];
  engagement_task?: string;
  scenario?: string;
  self_reflection?: string;
  summary_note?: string;
}

interface Unit {
  unit: string;
  topics: Topic[];
}

interface NotesResponse {
  units: Unit[];
}

const OperatingSystemsNotes: React.FC = () => {
  const { userId, learningStyles } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [notes, setNotes] = useState<NotesResponse | null>(null);
  const [currentUnit, setCurrentUnit] = useState<number>(0);

  const generateNotes = async () => {
    if (!userId) {
      alert("Please log in first.");
      return;
    }

    setLoading(true);
    setNotes(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/notes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, subject: "Operating Systems" }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to generate notes");

      setNotes(data.generated_notes as NotesResponse);
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnitComplete = () => {
    if (currentUnit < 4) setCurrentUnit(currentUnit + 1);
  };

  const isSequential = learningStyles?.sequential_global === "Sequential";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
        Operating Systems Notes
      </h1>

      {!notes ? (
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={generateNotes}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Notes"}
          </button>

          {loading && (
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Generating notes, please wait...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 mt-6">
          {notes.units?.map((unit, index) => {
            const unlocked = !isSequential || index <= currentUnit;

            return (
              <div
                key={index}
                className={`border rounded-xl shadow-sm p-4 ${
                  unlocked ? "bg-white" : "bg-gray-100 opacity-60"
                }`}
              >
                <h2 className="text-xl font-semibold text-indigo-600">
                  {unit.unit}
                </h2>

                {unlocked ? (
                  <div className="mt-3 space-y-4">
                    {unit.topics.map((topic, tIndex) => (
                      <details key={tIndex} className="border rounded-lg p-3">
                        <summary className="font-medium text-gray-800 cursor-pointer">
                          {topic.title}
                        </summary>

                        <div className="mt-2 text-sm text-gray-700 space-y-2">
                          <p><strong>Overview:</strong> {topic.overview}</p>
                          <p><strong>Theory:</strong> {topic.theory}</p>

                          {topic.example_or_analogy && (
                            <p><strong>Example:</strong> {topic.example_or_analogy}</p>
                          )}

                          {topic.key_points && (
                            <div>
                              <strong>Key Points:</strong>
                              <ul className="list-disc ml-6">
                                {topic.key_points.map((point, i) => (
                                  <li key={i}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {topic.real_world_examples && (
                            <div>
                              <strong>Real-World Examples:</strong>
                              <ul className="list-disc ml-6">
                                {topic.real_world_examples.map((ex, i) => (
                                  <li key={i}>{ex}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {topic.step_by_step_summary && (
                            <div>
                              <strong>Step-by-Step Summary:</strong>
                              <ol className="list-decimal ml-6">
                                {topic.step_by_step_summary.map((step, i) => (
                                  <li key={i}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {topic.conceptual_focus && (
                            <div>
                              <strong>Conceptual Focus:</strong>
                              <ul className="list-disc ml-6">
                                {topic.conceptual_focus.map((idea, i) => (
                                  <li key={i}>{idea}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {topic.connections && (
                            <div>
                              <strong>Connections:</strong>
                              <ul className="list-disc ml-6">
                                {topic.connections.map((conn, i) => (
                                  <li key={i}>{conn}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {topic.engagement_task && (
                            <p><strong>Engagement Task:</strong> {topic.engagement_task}</p>
                          )}
                          {topic.scenario && (
                            <p><strong>Scenario:</strong> {topic.scenario}</p>
                          )}

                          {topic.self_reflection && (
                            <p><strong>Self-Reflection:</strong> {topic.self_reflection}</p>
                          )}
                          {topic.summary_note && (
                            <p><strong>Summary Note:</strong> {topic.summary_note}</p>
                          )}
                        </div>
                      </details>
                    ))}

                    {learningStyles?.visual_verbal === "Visual" && YT_VIDEOS[unit.unit] && (
                      <div className="my-4">
                        <h3 className="text-indigo-600 font-semibold text-lg mb-2">
                          🎥 Visual Learning Aid:
                        </h3>
                        <div className="flex justify-center">
                          <iframe
                            width="560"
                            height="315"
                            src={YT_VIDEOS[unit.unit]}
                            title={unit.unit}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-xl shadow-md border"
                          ></iframe>
                        </div>
                      </div>
                    )}

                    {isSequential && index === currentUnit && (
                      <button
                        onClick={handleUnitComplete}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Mark Unit as Completed
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 italic mt-2">
                    🔒 Complete the previous unit to unlock this section.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OperatingSystemsNotes;
