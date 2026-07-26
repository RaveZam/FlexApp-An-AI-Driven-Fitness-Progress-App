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
