export default function computeElapsed(startISO: string): number {
  return Math.floor((Date.now() - new Date(startISO).getTime()) / 1000);
}
