import { DaysOfTheWeek } from "@/constants/WorkoutConstants";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useWorkoutContext } from "./useWorkoutPlanContext";

export const useAddWorkoutDayNames = () => {
  const {
    workoutDays,
    workoutDaysIndex,
    setWorkoutDaysIndex,
    workoutDayNames,
    setworkoutDayNames,
  } = useWorkoutContext();

  useEffect(() => {
    console.log("Workout Day Names", workoutDayNames);
  }, [workoutDayNames]);

  const addDayNameHandler = (dayInput: string) => {
    console.log("Day Input", dayInput, workoutDaysIndex);
    if (!dayInput) {
      return;
    }
    if (workoutDays?.length - 1 > workoutDaysIndex) {
      setworkoutDayNames((prev: string[]) => [...prev, dayInput]);
      // setdayInput("");
      setWorkoutDaysIndex((prev) => prev + 1);
      return;
    } else {
      setworkoutDayNames((prev) => [...prev, dayInput]);
    }
  };

  return {
    workoutDayNames,
    setworkoutDayNames,
    workoutDaysIndex,
    setWorkoutDaysIndex,
    addDayNameHandler,
  };
};
