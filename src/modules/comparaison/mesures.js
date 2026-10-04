// Measured with tools/token_estimate.py in workflow-skills, 2026-09-12: the 6 CADRER skills, EN vs draft FR.
export const MEASURED = [
  { name: "OpenAI o200k", note: "GPT-4o, GPT-5", en: 4201, fr: 5313 },
  { name: "Mistral Nemo", note: "Tekken", en: 4244, fr: 5355 },
  { name: "Google Gemma 3", note: "", en: 4304, fr: 5515 },
  { name: "DeepSeek V3", note: "", en: 4221, fr: 5913 },
  { name: "Qwen 3", note: "", en: 4208, fr: 5930 },
  { name: "Meta Llama 3", note: "", en: 4207, fr: 5977 },
  { name: "OpenAI cl100k", note: "GPT-4", en: 4208, fr: 5982 },
  { name: "Claude 1 et 2", noteEn: "old, not Claude 3+", noteFr: "ancien, pas Claude 3+", en: 4364, fr: 6707, legacy: true },
];
