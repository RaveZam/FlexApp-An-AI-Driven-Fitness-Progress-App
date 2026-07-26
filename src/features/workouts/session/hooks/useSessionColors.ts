import { useTheme, usePalette } from "@/src/theme";
import { makeSessionColors } from "../constants/color";

export function useSessionColors() {
  const p = usePalette();
  const { scheme } = useTheme();
  return makeSessionColors(p, scheme);
}
