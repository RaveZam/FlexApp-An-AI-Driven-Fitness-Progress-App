import { Palettes, type Palette } from "@/src/theme/palettes";
import { useTheme } from "@/src/theme/ThemeContext";

export function usePalette(): Palette {
  const { scheme } = useTheme();
  return Palettes[scheme];
}
