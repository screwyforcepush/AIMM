export const ATTRIBUTES = {
  Neutral: { color: "#8884d8", emoji: "😐" },
  Positive: { color: "#82ca9d", emoji: "😊" },
  Negative: { color: "#ff6361", emoji: "😞" },
  Mixed: { color: "#ffa600", emoji: "😕" },
  Engaged: { color: "#4caf50", emoji: "🔥" },
  Disengaged: { color: "#f44336", emoji: "❄️" },
  Passive: { color: "#ffeb3b", emoji: "🌙" },
  Low: { color: "#8bc34a", emoji: "🧘" },
  Medium: { color: "#ff9800", emoji: "🧠" },
  High: { color: "#f44336", emoji: "🤯" },
  Progressive: { color: "#2196f3", emoji: "📈" },
  Stationary: { color: "#9e9e9e", emoji: "⏸️" },
} as const;

export type AttributeKeys = keyof typeof ATTRIBUTES;