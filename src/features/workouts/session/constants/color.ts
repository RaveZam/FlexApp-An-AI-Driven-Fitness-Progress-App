import type { Palette } from "@/src/theme";

// Tokens with no equivalent in the core Palette (session-specific accent hue
// and label/readable gray steps that sit between muted and bone).
const SESSION_ONLY = {
  dark: {
    HIGHLIGHT: "#fbbf24",
    HIGHLIGHT_DEEP: "#f59e0b",
    LABEL: "#9b9b9b",
    READABLE: "#b8b6b1",
  },
  light: {
    HIGHLIGHT: "#B45309",
    HIGHLIGHT_DEEP: "#92400E",
    LABEL: "#4F4B44",
    READABLE: "#3A3730",
  },
};

export function makeSessionColors(p: Palette, scheme: "light" | "dark") {
  const only = SESSION_ONLY[scheme];
  return {
    ACCENT: p.accent,
    ACCENT_DEEP: p.accentDeep,
    HIGHLIGHT: only.HIGHLIGHT,
    HIGHLIGHT_DEEP: only.HIGHLIGHT_DEEP,
    BONE: p.bone,
    HAIRLINE: p.hairline,
    HAIRLINE_STRONG: p.hairlineStrong,
    MUTED: p.muted,
    MUTED_SOFT: p.mutedSoft,
    LABEL: only.LABEL,
    READABLE: only.READABLE,
  };
}

export type SessionColors = ReturnType<typeof makeSessionColors>;
