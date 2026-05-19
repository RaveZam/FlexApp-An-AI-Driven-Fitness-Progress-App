export type StartButtonState = {
  hasActiveSession: boolean;
  isRestDay: boolean;
  hasNoActivePlan: boolean;
};

export type StartButtonView = {
  label: string;
  disabled: boolean;
};

export function deriveStartButton({
  hasActiveSession,
  isRestDay,
  hasNoActivePlan,
}: StartButtonState): StartButtonView {
  const disabled = !hasActiveSession && (isRestDay || hasNoActivePlan);
  const label = hasActiveSession
    ? "Resume Workout"
    : isRestDay
    ? "Rest Day"
    : hasNoActivePlan
    ? "No Active Plan"
    : "Start Workout";
  return { label, disabled };
}
