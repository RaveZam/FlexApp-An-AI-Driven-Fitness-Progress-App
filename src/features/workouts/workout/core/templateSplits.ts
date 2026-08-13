import type { Ionicons } from "@expo/vector-icons";

export type TemplateSplit = {
  id: string;
  name: string;
  days: number;
  accent: string;
  accentBgRgb: string;
  icon: keyof typeof Ionicons.glyphMap;
  muscles: string;
};

// Per-category brand hue stays constant across themes; the badge/icon
// background is derived from it at an alpha matching accentSoft's convention.
export const TEMPLATE_SPLITS: TemplateSplit[] = [
  {
    id: "ppl",
    name: "Push Pull Legs",
    days: 6,
    accent: "#10b981",
    accentBgRgb: "16,185,129",
    icon: "fitness",
    muscles: "Chest, Back, Legs",
  },
  {
    id: "upper-lower",
    name: "Upper / Lower",
    days: 4,
    accent: "#3b82f6",
    accentBgRgb: "59,130,246",
    icon: "body",
    muscles: "Upper & Lower Body",
  },
  {
    id: "bro-split",
    name: "Bro Split",
    days: 5,
    accent: "#f59e0b",
    accentBgRgb: "245,158,11",
    icon: "barbell",
    muscles: "One muscle per day",
  },
  {
    id: "full-body",
    name: "Full Body",
    days: 3,
    accent: "#ef4444",
    accentBgRgb: "239,68,68",
    icon: "flame",
    muscles: "All major groups",
  },
  {
    id: "arnold",
    name: "Arnold Split",
    days: 6,
    accent: "#a855f7",
    accentBgRgb: "168,85,247",
    icon: "trophy",
    muscles: "Chest/Back, Shoulders/Arms, Legs",
  },
  {
    id: "phul",
    name: "PHUL",
    days: 4,
    accent: "#06b6d4",
    accentBgRgb: "6,182,212",
    icon: "flash",
    muscles: "Power + Hypertrophy",
  },
];
