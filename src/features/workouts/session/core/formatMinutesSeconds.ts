// Turns a raw seconds count into a "M:SS" display string (minutes unpadded,
// seconds zero-padded). Lives in core so any session UI can reuse it.
export default function formatMinutesSeconds(totalSec: number): string {
  const minutes = Math.floor(totalSec / 60);
  const seconds = (totalSec % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
