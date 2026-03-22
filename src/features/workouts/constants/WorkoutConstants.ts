export const DaysOfTheWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const WORKOUT_STEPS_BY_PLAN = {
  "Push Pull Legs": [
    { day: "Push", key: "push" },
    { day: "Pull", key: "pull" },
    { day: "Leg", key: "legs" },
  ],
  "Upper Lower": [
    { day: "Upper Body", key: "upper" },
    { day: "Lower Body", key: "lower" },
  ],
};

export const PLAN_NAMES = Object.keys(WORKOUT_STEPS_BY_PLAN);
