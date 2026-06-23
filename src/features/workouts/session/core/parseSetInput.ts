type RawSetInput = {
  weight: string;
  reps: string;
  leftReps: string;
  rightReps: string;
};

type LoggedSet = {
  weight: number;
  actualReps: number | null;
  actualRepsLeft: number | null;
  actualRepsRight: number | null;
};

// Parses the modal's raw text fields into the numbers logSet expects, or null
// when anything required is missing/non-numeric. Pure so it can be tested
// without React. Bilateral writes reps; unilateral writes left/right.
export function parseSetInput(
  raw: RawSetInput,
  isUnilateral: boolean,
): LoggedSet | null {
  const weight = parseFloat(raw.weight);
  if (isNaN(weight)) return null;

  if (isUnilateral) {
    const left = parseInt(raw.leftReps, 10);
    const right = parseInt(raw.rightReps, 10);
    if (isNaN(left) || isNaN(right)) return null;
    return {
      weight,
      actualReps: null,
      actualRepsLeft: left,
      actualRepsRight: right,
    };
  }

  const reps = parseInt(raw.reps, 10);
  if (isNaN(reps)) return null;
  return {
    weight,
    actualReps: reps,
    actualRepsLeft: null,
    actualRepsRight: null,
  };
}
