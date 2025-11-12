"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

/** Matches backend's ParameterData model */
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

/** Represents learner profile (backend: LearnerProfileBase) */
export interface LearningStyle {
  active_reflective: string;
  sensing_intuitive: string;
  visual_verbal: string;
  sequential_global: string;
  parameters: ParameterData;
}

/** Context API types */
interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  userId: number | null;
  learningStyles: LearningStyle | null;
  login: (username: string, userId: number, learningStyles?: LearningStyle) => void;
  logout: () => void;
  updateLearningStyles: (newStyles: LearningStyle) => void;
}

/** Create the context */
const AuthContext = createContext<AuthContextType | null>(null);

/** Default values for parameters — helps prevent undefined errors */
const defaultParameters: ParameterData = {
  interaction_count: 0,
  avg_session_length: 0,
  time_visual_content: 0,
  time_text_content: 0,
  visual_text_ratio: 0,
  quiz_score_visual: 0,
  quiz_score_text: 0,
  navigation_jump_count: 0,
  reflection_time_avg: 0,
  content_revisit_rate: 0,
  theory_practice_ratio: 0,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [learningStyles, setLearningStyles] = useState<LearningStyle | null>(null);

  const login = (username: string, userId: number, learningStyles?: LearningStyle) => {
    setIsLoggedIn(true);
    setUsername(username);
    setUserId(userId);
    if (learningStyles)
      setLearningStyles({
        ...learningStyles,
        parameters: learningStyles.parameters || defaultParameters, // ✅ ensure structure
      });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setUserId(null);
    setLearningStyles(null);
  };

  const updateLearningStyles = (newStyles: LearningStyle) => {
    setLearningStyles((prev) => ({
      ...prev,
      ...newStyles,
      parameters: newStyles.parameters || prev?.parameters || defaultParameters, // ✅ preserve old params
    }) as LearningStyle);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        username,
        userId,
        learningStyles,
        login,
        logout,
        updateLearningStyles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
