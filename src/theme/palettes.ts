export type Palette = {
  ink: string;
  inkRaised: string;
  inkSunken: string;
  bone: string;
  muted: string;
  mutedSoft: string;
  /**
   * The load ladder — one green hue family climbing in brightness.
   * Brightness encodes recency and intensity: pine is the oldest/faintest
   * session, lime is reserved for a personal best. Never reach past `accent`
   * for decoration; the top two stops have to be earned by the data.
   */
  accentPine: string;
  accentForest: string;
  accent: string;
  accentBright: string;
  accentLime: string;

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

/** The ladder in order, so charts can index into it by position. */
export function loadLadder(p: Palette): string[] {
  return [p.accentPine, p.accentForest, p.accent, p.accentBright, p.accentLime];
}

export const Palettes: { light: Palette; dark: Palette } = {
  dark: {
    // Warm charcoal with a faint green bias — panels read as the accent's
    // own family instead of sitting on neutral black.
    ink: "#0E100E",
    inkRaised: "#191C19",
    inkSunken: "#131613",
    bone: "#F2F5F1",
    muted: "#8A918A",
    mutedSoft: "#4A504A",

    accentPine: "#14532D",
    accentForest: "#1E7A4A",
    accent: "#56D07A",
    accentBright: "#7FE39B",
    accentLime: "#9BEE6A",

    accentDeep: "#1E7A4A",
    accentSoft: "rgba(86,208,122,0.10)",
    accentBorder: "rgba(86,208,122,0.42)",
    accentBorderSoft: "rgba(86,208,122,0.20)",
    danger: "#F0806B",
    dangerSoft: "rgba(240,128,107,0.10)",
    dangerBorder: "rgba(240,128,107,0.40)",
    hairline: "rgba(242,245,241,0.06)",
    hairlineStrong: "rgba(242,245,241,0.12)",
    onAccent: "#0E100E",
  },
  light: {
    ink: "#F4F6F2",
    inkRaised: "#FFFFFF",
    inkSunken: "#E9EDE7",
    bone: "#141813",
    muted: "#67705F",
    mutedSoft: "#AFB6A9",

    accentPine: "#0F3D22",
    accentForest: "#17663D",
    accent: "#1E8B4E",
    accentBright: "#37B36B",
    accentLime: "#5FA31C",

    accentDeep: "#0F3D22",
    accentSoft: "rgba(30,139,78,0.10)",
    accentBorder: "rgba(30,139,78,0.34)",
    accentBorderSoft: "rgba(30,139,78,0.18)",
    danger: "#C24A2E",
    dangerSoft: "rgba(194,74,46,0.10)",
    dangerBorder: "rgba(194,74,46,0.34)",
    hairline: "rgba(20,24,19,0.07)",
    hairlineStrong: "rgba(20,24,19,0.13)",
    onAccent: "#FFFFFF",
  },
};
