export const FontFamilies = {
  // Body — Inter
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  // Display — Outfit
  displayExtraLight: "Outfit_200ExtraLight",
  displayLight: "Outfit_300Light",
  displayRegular: "Outfit_400Regular",
  displayMedium: "Outfit_500Medium",
  displaySemibold: "Outfit_600SemiBold",
};

export const FontSizes = {
  eyebrow: 9,
  micro: 10,
  small: 11,
  body: 13,
  meta: 12,
  subtitle: 15,
  title: 22,
  hero: 38,
};

export const Palette = {
  ink: "#060606",
  inkRaised: "#0c0c0c",
  inkSunken: "#0a0a0a",
  bone: "#f5f3ef",
  accent: "#34d399",
  accentDeep: "#059669",
  accentSoft: "rgba(52,211,153,0.08)",
  accentBorder: "rgba(52,211,153,0.45)",
  accentBorderSoft: "rgba(52,211,153,0.25)",
  muted: "#6b6b6b",
  mutedSoft: "#3a3a3a",
  danger: "#f87171",
  hairline: "rgba(245,243,239,0.07)",
  hairlineStrong: "rgba(245,243,239,0.14)",
};

export const Type = {
  eyebrow: {
    fontFamily: FontFamilies.medium,
    fontSize: FontSizes.eyebrow,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  label: {
    fontFamily: FontFamilies.regular,
    fontSize: FontSizes.meta,
    letterSpacing: 1.4,
    textTransform: "uppercase" as const,
  },
  display: {
    fontFamily: FontFamilies.displayMedium,
    fontSize: FontSizes.title,
    letterSpacing: -0.4,
  },
};
