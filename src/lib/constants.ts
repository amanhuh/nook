export const LIST_COLOR_NAMES = [
  "Slate",
  "Butter",
  "Blush",
  "Sky",
  "Mint",
  "Lilac",
] as const;

export const LIST_COLORS: Record<string, { name: string; hex: string }> = {
  Slate: { name: "Slate", hex: "#C7CED9" },
  Butter: { name: "Butter", hex: "#FFD97A" },
  Blush: { name: "Blush", hex: "#F7C9D7" },
  Sky: { name: "Sky", hex: "#B7D7FF" },
  Mint: { name: "Mint", hex: "#CDEDD8" },
  Lilac: { name: "Lilac", hex: "#D9C6F7" },
};

export const LIST_LIMITS = {
  MAX_NAME_LENGTH: 35,
};
