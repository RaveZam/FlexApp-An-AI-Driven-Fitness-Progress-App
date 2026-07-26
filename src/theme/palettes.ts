export type Palette = {
  ink: string;
  inkRaised: string;
  inkSunken: string;
  bone: string;
  muted: string;
  mutedSoft: string;
  accent: string;
  accentDeep: string;
  accentSoft: string;
  accentBorder: string;
  accentBorderSoft: string;
  danger: string;
  dangerSoft: string;
  dangerBorder: string;
  hairline: string;
  hairlineStrong: string;
  onAccent: string;
};

export const Palettes: { light: Palette; dark: Palette } = {
  dark: {
    ink: "#060606",
    inkRaised: "#0c0c0c",
    inkSunken: "#0a0a0a",
    bone: "#f5f3ef",
    muted: "#6b6b6b",
    mutedSoft: "#3a3a3a",
    accent: "#34d399",
    accentDeep: "#059669",
    accentSoft: "rgba(52,211,153,0.08)",
    accentBorder: "rgba(52,211,153,0.45)",
    accentBorderSoft: "rgba(52,211,153,0.25)",
    danger: "#f87171",
    dangerSoft: "rgba(248,113,113,0.08)",
    dangerBorder: "rgba(248,113,113,0.45)",
    hairline: "rgba(245,243,239,0.07)",
    hairlineStrong: "rgba(245,243,239,0.14)",
    onAccent: "#060606",
  },
  light: {
    ink: "#F5F3EF",
    inkRaised: "#FFFFFF",
    inkSunken: "#ECEAE4",
    bone: "#1A1917",
    muted: "#6E6B64",
    mutedSoft: "#B4B0A8",
    accent: "#059669",
    accentDeep: "#047857",
    accentSoft: "rgba(5,150,105,0.10)",
    accentBorder: "rgba(5,150,105,0.35)",
    accentBorderSoft: "rgba(5,150,105,0.20)",
    danger: "#DC2626",
    dangerSoft: "rgba(220,38,38,0.10)",
    dangerBorder: "rgba(220,38,38,0.35)",
    hairline: "rgba(26,25,23,0.08)",
    hairlineStrong: "rgba(26,25,23,0.14)",
    onAccent: "#FFFFFF",
  },
};
