"use client";

import { useEffect } from "react";

type VapiPayload = unknown;

interface VapiInstance {
  start: () => void;
  stop: () => void;
  on: (event: string, callback: (payload: VapiPayload) => void) => void;
  off: (event: string, callback: (payload: VapiPayload) => void) => void;
  setMute: (isMuted: boolean) => void;
}

interface AssistantConfig {
  model: {
    provider: string;
    model: string;
    systemPrompt: string;
    [key: string]: unknown;
  };
  voice: {
    provider: string;
    voiceId: string;
    [key: string]: unknown;
  };
  firstMessage: string;
  [key: string]: unknown;
}

type ButtonConfig = Record<string, unknown>;

interface VapiSDK {
  run: (params: {
    apiKey: string;
    assistant: AssistantConfig;
    config?: ButtonConfig;
  }) => VapiInstance;
}

interface VapiMessage {
  role: 'user' | 'assistant';
  content: string;
  transcriptType?: 'partial' | 'final';
  [key: string]: unknown;
}

interface VapiError {
  type: string;
  message: string;
  code?: number;
  [key: string]: unknown;
}

declare global {
  interface Window {
    vapiSDK: VapiSDK | undefined;
    VapiControls: {
      start: () => void;
      stop: () => void;
      isListening: boolean;
      setIsListening: (value: boolean) => void;
    };
  }
}

export default function VoiceAgent() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    script.defer = true;
    script.async = true;

    document.body.appendChild(script);

    script.onload = () => {
      const apiKey = process.env.NEXT_PUBLIC_VAPI_KEY || "";

      if (!apiKey) {
        console.error("❌ Missing NEXT_PUBLIC_VAPI_KEY in .env.local");
        return;
      }

      const assistant: AssistantConfig = {
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          systemPrompt: `
You are the AI tutor for AdaptiLearn, a personalized learning platform.
Provide step-by-step explanations, help with assignments, and guide students.
Admin Panel access requires verification.
          `,
        },

        voice: {
          provider: "11labs",
          voiceId: "paula",
        },

        firstMessage:
          "Hello! 👋 Welcome to AdaptiLearn. What topic would you like help with today?",
      };

      const buttonConfig: ButtonConfig = {
        position: "bottom-right",
        zIndex: 9999,
        offset: "100px",
      };

      if (!window.vapiSDK) {
        console.error("❌ vapiSDK failed to load.");
        return;
      }

      const instance = window.vapiSDK.run({
        apiKey,
        assistant,
        config: buttonConfig,
      });

      instance.on("message", (msg: VapiMessage) => {
        if (msg.transcriptType && msg.transcriptType !== "final") return;
        console.log("🎤 Vapi message:", msg);
      });

      instance.on("error", (e: VapiError) => {
        console.error("❌ Vapi error:", e);
      });
    };

    return () => {
      const el = document.querySelector(
        'script[src="https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js"]'
      );
      if (el && el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);

  return null;
}