import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

const YT_EMBEDS: Record<string, string> = {
  "Unit 1: Introduction to Operating Systems": "https://www.youtube.com/embed/vBURTt97EkA",
  "Unit 2: Process Management": "https://www.youtube.com/embed/OrM7nZcxXZU",
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

type NotesResponse = Unit[];

const OperatingSystemsNotes: React.FC = () => {
  const { userId, learningStyles, updateLearningStyles } = useAuth();

  const [notes, setNotes] = useState<NotesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [savedExists, setSavedExists] = useState<boolean>(false);
  const [currentUnit, setCurrentUnit] = useState<number>(0);

  const [openVideoUnit, setOpenVideoUnit] = useState<number | null>(null);
  const [openVideoUrl, setOpenVideoUrl] = useState<string | null>(null);

  const [showStylesModal, setShowStylesModal] = useState<boolean>(false);
  const [updatedStyles, setUpdatedStyles] = useState<{
    active_reflective?: string;
    sensing_intuitive?: string;
    visual_verbal?: string;
    sequential_global?: string;
  } | null>(null);

  const readingSecondsRef = useRef<number>(0);
  const visualSecondsRef = useRef<number>(0);
  const readingIntervalRef = useRef<number | null>(null);
  const visualIntervalRef = useRef<number | null>(null);

  const navigationJumpsRef = useRef<number>(0);
  const openedTopicsRef = useRef<Set<string>>(new Set());
  const revisitCountRef = useRef<number>(0);
  const lastOpenedUnitRef = useRef<number | null>(null);

  const readingActiveRef = useRef<boolean>(false);

  // ------------------ FETCH EXISTING LEARNING STYLE ------------------
  useEffect(() => {
    if (!userId) return;
    fetchCurrentLearningStyle();
    // setup visibilitychange listener to pause/resume reading timer
    const handleVisibility = () => {
      if (document.hidden) {
        stopReadingTimer();
      } else {
        // resume only if notes are present and video modal is not open
        if (notes && openVideoUnit === null) startReadingTimer();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchCurrentLearningStyle = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/profile/current-parameters/${userId}`);
      const data = await res.json();
      if (res.ok && data) {
        const serverParams = data.parameters?.parameters || {};
        updateLearningStyles({
          active_reflective: data.active_reflective,
          sensing_intuitive: data.sensing_intuitive,
          visual_verbal: data.visual_verbal,
          sequential_global: data.sequential_global,
          parameters: serverParams,
        });
      }
    } catch (e) {
      console.error("Failed to fetch current learning style:", e);
    }
  };

  // ------------------ FETCH / GENERATE NOTES ------------------
  useEffect(() => {
    if (!userId) return;
    fetchSavedNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchSavedNotes = async () => {
    try {
      const subjectTitle = encodeURIComponent("Operating Systems");
      const res = await fetch(`http://127.0.0.1:8000/notes/${userId}/${subjectTitle}`);
      const data = await res.json();
      if (data.notes && data.notes.length > 0) {
        setNotes(data.notes[0].content);
        setSavedExists(true);
        // start reading timer when notes loaded and tab visible and no video open
        if (!document.hidden && openVideoUnit === null) startReadingTimer();
      } else {
        setNotes(null);
        setSavedExists(false);
      }
    } catch (e) {
      console.error("fetchSavedNotes error:", e);
    }
  };

  const generateNotes = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/notes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, subject_id: 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "generate failed");
      setNotes(data.generated_notes.units);
      setSavedExists(true);
      if (!document.hidden && openVideoUnit === null) startReadingTimer();
    } catch (e) {
      console.error("generateNotes error:", e);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ TIMERS ------------------
  const startReadingTimer = () => {
    if (readingActiveRef.current) return;
    readingActiveRef.current = true;
    readingIntervalRef.current = window.setInterval(() => {
      readingSecondsRef.current += 1;
    }, 1000);
  };

  const stopReadingTimer = () => {
    readingActiveRef.current = false;
    if (readingIntervalRef.current) {
      clearInterval(readingIntervalRef.current);
      readingIntervalRef.current = null;
    }
  };

  const startVisualTimer = () => {
    if (visualIntervalRef.current) return;
    visualIntervalRef.current = window.setInterval(() => {
      visualSecondsRef.current += 1;
    }, 1000);
  };

  const stopVisualTimer = () => {
    if (visualIntervalRef.current) {
      clearInterval(visualIntervalRef.current);
      visualIntervalRef.current = null;
    }
  };

  // ------------------ TOPIC OPEN HANDLER ------------------
  const handleTopicOpen = (unitIndex: number, topic: Topic) => {
    const key = `${unitIndex}::${topic.title}`;
    if (openedTopicsRef.current.has(key)) {
      revisitCountRef.current += 1;
    } else {
      openedTopicsRef.current.add(key);
    }

    if (lastOpenedUnitRef.current !== null && lastOpenedUnitRef.current !== unitIndex) {
      navigationJumpsRef.current += 1;
    }
    lastOpenedUnitRef.current = unitIndex;
  };

  // ------------------ VIDEO OPEN / CLOSE ------------------
  const openUnitVideo = (unitIndex: number) => {
    if (!notes) return;
    const url = YT_EMBEDS[notes[unitIndex].unit] || null;
    setOpenVideoUnit(unitIndex);
    setOpenVideoUrl(url);
    // stop reading timer and start visual timer
    stopReadingTimer();
    startVisualTimer();
  };

  const closeUnitVideo = () => {
    stopVisualTimer();
    setOpenVideoUnit(null);
    setOpenVideoUrl(null);
    // resume reading timer if tab visible
    if (!document.hidden) startReadingTimer();
  };

  // ------------------ BUILD & MERGE PARAMETERS ------------------
  const buildSessionParams = () => {
    return {
      interaction_count: 0,
      avg_session_length: Math.floor(readingSecondsRef.current + visualSecondsRef.current),
      time_visual_content: Math.floor(visualSecondsRef.current),
      time_text_content: Math.floor(readingSecondsRef.current),
      visual_text_ratio:
        readingSecondsRef.current > 0
          ? +(visualSecondsRef.current / readingSecondsRef.current).toFixed(2)
          : 0,
      quiz_score_visual: 0,
      quiz_score_text: 0,
      navigation_jump_count: navigationJumpsRef.current,
      reflection_time_avg: 0,
      content_revisit_rate:
        openedTopicsRef.current.size > 0
          ? +(revisitCountRef.current / openedTopicsRef.current.size).toFixed(2)
          : 0,
      theory_practice_ratio: 0,
    };
  };

    const mergeWithPreviousParams = (prev: Record<string, unknown> | undefined, session: Record<string, unknown>) => {
    const sum = (a: unknown, b: unknown): number => {
      const an = Number(a) || 0;
      const bn = Number(b) || 0;
      return an + bn;
    };


    return {
      interaction_count: sum(prev?.interaction_count, session.interaction_count),
      avg_session_length: sum(prev?.avg_session_length, session.avg_session_length),
      time_visual_content: sum(prev?.time_visual_content, session.time_visual_content),
      time_text_content: sum(prev?.time_text_content, session.time_text_content),
      visual_text_ratio:
        // compute new ratio as weighted by time (if prev has values)
        (function () {
          const prev_tv = Number(prev?.time_visual_content || 0);
          const prev_tt = Number(prev?.time_text_content || 0);
          const new_tv = Number(session.time_visual_content || 0);
          const new_tt = Number(session.time_text_content || 0);
          const totalVisual = prev_tv + new_tv;
          const totalText = prev_tt + new_tt;
          return totalText > 0 ? +(totalVisual / totalText).toFixed(2) : 0;
        })(),
      quiz_score_visual: sum(prev?.quiz_score_visual, session.quiz_score_visual),
      quiz_score_text: sum(prev?.quiz_score_text, session.quiz_score_text),
      navigation_jump_count: sum(prev?.navigation_jump_count, session.navigation_jump_count),
      reflection_time_avg: session.reflection_time_avg || prev?.reflection_time_avg || 0,
      content_revisit_rate:
        (function () {
          // simple merge: average of previous and session-derived (if available)
          const prevCR = Number(prev?.content_revisit_rate || 0);
          const sessCR = Number(session.content_revisit_rate || 0);
          return prevCR || sessCR ? +(((prevCR + sessCR) / (prevCR ? 2 : 1)) || 0).toFixed(2) : 0;
        })(),
      theory_practice_ratio: prev?.theory_practice_ratio || session.theory_practice_ratio || 0,
    };
  };

  // ------------------ RECALCULATE (MANUAL) ------------------
  const recalcLearningStyle = async () => {
    if (!userId || !learningStyles) return;
    const session = buildSessionParams();
    const prevParams = learningStyles.parameters || {};

    const merged = mergeWithPreviousParams(prevParams, session);

    try {
      const res = await fetch(`http://127.0.0.1:8000/ml/predict-update/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          active_reflective: learningStyles.active_reflective,
          sensing_intuitive: learningStyles.sensing_intuitive,
          visual_verbal: learningStyles.visual_verbal,
          sequential_global: learningStyles.sequential_global,
          parameters: merged,
        }),
      });

      const data = await res.json();
      if (res.ok && data.updated_profile) {
        // update only styles in AuthContext (user requested)
        updateLearningStyles({
          ...learningStyles,
          active_reflective: data.updated_profile.active_reflective,
          sensing_intuitive: data.updated_profile.sensing_intuitive,
          visual_verbal: data.updated_profile.visual_verbal,
          sequential_global: data.updated_profile.sequential_global,
          parameters: data.updated_profile.parameters || merged,
        });

        setUpdatedStyles({
          active_reflective: data.updated_profile.active_reflective,
          sensing_intuitive: data.updated_profile.sensing_intuitive,
          visual_verbal: data.updated_profile.visual_verbal,
          sequential_global: data.updated_profile.sequential_global,
        });
        setShowStylesModal(true);
        // reset session trackers after successful merge (so next recalc is incremental)
        readingSecondsRef.current = 0;
        visualSecondsRef.current = 0;
        navigationJumpsRef.current = 0;
        openedTopicsRef.current.clear();
        revisitCountRef.current = 0;
      } else {
        console.error("Recalc failed:", data);
        alert("Failed to recalculate learning style.");
      }
    } catch (e) {
      console.error("recalcLearningStyle error:", e);
      alert("Error when recalculating learning style.");
    }
  };

  // ------------------ UNIT COMPLETE ------------------
  const handleUnitComplete = () => {
    if (!notes) return;
    if (currentUnit < notes.length - 1) setCurrentUnit((p) => p + 1);
  };

  // ------------------ UI ------------------
  const isSequential = learningStyles?.sequential_global === "Sequential";

  return (
    <div className="max-w-5xl mx-auto px-6 pt-2 pb-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
        Operating Systems Notes
      </h1>

      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={generateNotes}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : savedExists ? "Regenerate Notes" : "Generate Notes"}
        </button>

        <button
          onClick={recalcLearningStyle}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Recalculate Learning Style
        </button>
      </div>

      {notes ? (
        <div className="space-y-6">
          {notes.map((unit, index) => {
            const unlocked = !isSequential || index <= currentUnit;
            return (
              <div
                key={index}
                className={`border rounded-xl shadow-sm p-4 ${unlocked ? "bg-white" : "bg-gray-100 opacity-60"}`}
              >
                <h2 className="text-xl font-semibold text-indigo-600">{unit.unit}</h2>

                {unlocked ? (
                  <div className="mt-3 space-y-4">
                    {unit.topics.map((topic, tIndex) => (
                      <details key={tIndex} className="border rounded-lg p-3" onClick={() => handleTopicOpen(index, topic)}>
                        <summary className="font-medium text-gray-800 cursor-pointer">{topic.title}</summary>

                        <div className="mt-2 text-sm text-gray-700 space-y-2">
                          <p><strong>Overview:</strong> {topic.overview}</p>
                          <p><strong>Theory:</strong> {topic.theory}</p>

                          {topic.example_or_analogy && <p><strong>Example / Analogy:</strong> {topic.example_or_analogy}</p>}

                          {topic.key_points && (
                            <div>
                              <strong>Key Points:</strong>
                              <ul className="list-disc ml-6">
                                {topic.key_points.map((p, i) => <li key={i}>{p}</li>)}
                              </ul>
                            </div>
                          )}

                          {topic.real_world_examples && (
                            <div>
                              <strong>Real-World Examples:</strong>
                              <ul className="list-disc ml-6">
                                {topic.real_world_examples.map((ex, i) => <li key={i}>{ex}</li>)}
                              </ul>
                            </div>
                          )}

                          {topic.step_by_step_summary && (
                            <div>
                              <strong>Step-by-Step Summary:</strong>
                              <ol className="list-decimal ml-6">
                                {topic.step_by_step_summary.map((s, i) => <li key={i}>{s}</li>)}
                              </ol>
                            </div>
                          )}

                          {topic.conceptual_focus && (
                            <div>
                              <strong>Conceptual Focus:</strong>
                              <ul className="list-disc ml-6">
                                {topic.conceptual_focus.map((c, i) => <li key={i}>{c}</li>)}
                              </ul>
                            </div>
                          )}

                          {topic.connections && (
                            <div>
                              <strong>Connections:</strong>
                              <ul className="list-disc ml-6">
                                {topic.connections.map((cn, i) => <li key={i}>{cn}</li>)}
                              </ul>
                            </div>
                          )}

                          {topic.engagement_task && <p><strong>Engagement Task:</strong> {topic.engagement_task}</p>}
                          {topic.scenario && <p><strong>Scenario:</strong> {topic.scenario}</p>}
                          {topic.self_reflection && <p><strong>Self-Reflection:</strong> {topic.self_reflection}</p>}
                          {topic.summary_note && <p><strong>Summary Note:</strong> {topic.summary_note}</p>}
                        </div>
                      </details>
                    ))}

                    <div className="my-4">
                      <h3 className="text-indigo-600 font-semibold text-lg mb-2">🎥 Visual Learning Aid:</h3>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => openUnitVideo(index)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Show Unit Video
                        </button>
                        <div className="text-sm text-gray-600">
                          Visual time (current session): {Math.floor(visualSecondsRef.current)}s
                        </div>
                      </div>

                      {openVideoUnit === index && openVideoUrl && (
                        <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                          <div className="relative pb-[56.25%] h-0">
                            <iframe
                              className="absolute left-0 top-0 w-full h-full rounded-lg shadow-md border"
                              src={openVideoUrl}
                              title={`${unit.unit} video`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>

                          <div className="mt-3 flex justify-center">
                            <button
                              onClick={() => closeUnitVideo()}
                              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                            >
                              Close Video
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

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
                  <p className="text-gray-500 italic mt-2">🔒 Complete the previous unit to unlock this section.</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500">No notes yet. Click Generate Notes to create.</div>
      )}

      {/* STYLES MODAL (shows updated styles after recalculation) */}
      {showStylesModal && updatedStyles && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80">
            <h3 className="text-lg font-semibold text-indigo-600 mb-3">Updated Learning Styles</h3>
            <div className="text-sm space-y-2">
              <p><strong>Active / Reflective:</strong> {updatedStyles.active_reflective}</p>
              <p><strong>Sensing / Intuitive:</strong> {updatedStyles.sensing_intuitive}</p>
              <p><strong>Visual / Verbal:</strong> {updatedStyles.visual_verbal}</p>
              <p><strong>Sequential / Global:</strong> {updatedStyles.sequential_global}</p>
            </div>

            <button
              onClick={() => setShowStylesModal(false)}
              className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatingSystemsNotes;
