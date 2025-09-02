// A pleasant set of distinct colors for fingers
export const PALETTE = [
  "#ff6b6b", // red
  "#4dd4ac", // teal
  "#6c8cff", // blue
  "#ffd166", // amber
  "#a78bfa", // violet
  "#f472b6", // pink
  "#34d399", // green
  "#f59e0b", // orange
];

export function pickUniqueColor(used: Set<string>): string {
  const available = PALETTE.filter(c => !used.has(c));
  if (available.length > 0) return available[Math.floor(Math.random() * available.length)];
  // Fallback: generate random HSL if palette exhausted
  const h = Math.floor(Math.random() * 360);
  return `hsl(${h} 80% 60%)`;
}