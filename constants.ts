import { ModelConfig, Suggestion } from "./types";

export const DEFAULT_MODEL = 'gemini-3-flash-preview';

export const MODELS: ModelConfig[] = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3.0 Flash', description: 'Fastest reasoning model' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro', description: 'Best for complex tasks' },
];

export const SUGGESTIONS: Suggestion[] = [
  {
    title: "Design a database schema",
    subtitle: "for an online merch store",
    prompt: "Design a robust database schema for a modern online merchandise store, including tables for users, products, orders, and inventory. Output as SQL or a diagram description."
  },
  {
    title: "Explain quantum physics",
    subtitle: "to a 5-year-old",
    prompt: "Explain the basic concepts of quantum physics as if you were teaching a smart 5-year-old using simple analogies."
  },
  {
    title: "Write a React component",
    subtitle: "for a sticky header",
    prompt: "Write a clean, TypeScript React component for a responsive sticky header that changes appearance on scroll using Tailwind CSS."
  },
  {
    title: "Plan a trip",
    subtitle: "to Kyoto for 3 days",
    prompt: "Create a detailed 3-day travel itinerary for Kyoto, Japan, focusing on cultural heritage sites and local food spots."
  }
];
