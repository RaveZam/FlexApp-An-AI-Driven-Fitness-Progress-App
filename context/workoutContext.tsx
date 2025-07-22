import React, { createContext, useEffect, useState } from "react";
import { InitialWorkoutPlan, Workouts } from "@/types/WorkoutTypes";
import {
  getCurrentIndexDay,
  getInitialWorkoutPlan,
} from "@/app/helpers/workoutHelpers";
import { DaysOfTheWeek } from "@/constants/WorkoutConstants";
import { workoutPlanService } from "@/services/workoutPlanService";
import { useAuth } from "@/auth/useAuth";
import { WorkoutContextType } from "@/types/WorkoutContextTypes";
import { navgationHelpers } from "@/app/helpers/navigationHelpers";

export const WorkoutContext = createContext<WorkoutContextType | undefined>(
  undefined
);

export default function workoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = React.useState<string>("Mon");
  const [workoutNumberOfDays, setWorkoutNumberOfDays] = useState<number>(0);
  const [restDays, setRestDays] = useState<string[]>([]);
  const [workoutDaysIndex, setWorkoutDaysIndex] = useState<number>(0);
  const workoutDays = DaysOfTheWeek.filter((day) => !restDays?.includes(day));
  const [shouldSave, setShouldSave] = useState<boolean>(false);
  const [initialWorkoutPlan, setInitialWorkoutPlan] =
    useState<InitialWorkoutPlan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>([]);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedWorkouts, setSelectedWorkouts] = useState<Workouts[]>([]);

  const [repsPerSet, setRepsPerSet] = useState<Workouts[]>([]);
  const [dayInput, setdayInput] = useState<string>("");
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [planName, setPlanName] = useState<string>("");
  const [workoutDayNames, setworkoutDayNames] = useState<string[]>([]);

  const customWorkoutPlan = workoutDayNames?.map((day) => ({
    day: day,
    key: day.toLowerCase().replace(/\s+/g, "-"),
  }));

  useEffect(() => {
    setInitialWorkoutPlan(getInitialWorkoutPlan(customWorkoutPlan));
    console.log("Trigger");
  }, [workoutDayNames]);

  // This Initates The Finish Functionality After Adding Workout Day Names
  useEffect(() => {
    console.log(initialWorkoutPlan?.workoutPlan?.length);
    if (initialWorkoutPlan?.workoutPlan?.length == workoutDays.length) {
      console.log("You are done");
      navgationHelpers.goToWorkoutSelector();
      console.log(initialWorkoutPlan);
    }
  }, [initialWorkoutPlan]);

  useEffect(() => {
    if (shouldSave) {
      workoutPlanService.saveToSupaBase(
        initialWorkoutPlan,
        user?.id,
        planName,
        setShowSuccessPopup,
        setShouldSave
      );
      setShouldSave(false);
    }
  }, [shouldSave]);

  // This Sets the Reps Per Set
  useEffect(() => {
    setRepsPerSet((prev) => {
      const updated = selectedWorkouts.map((workout) => {
        const existing = prev.find((w) => w.id === workout.id);
        return existing ?? { ...workout, sets: 2, reps: "8-10" };
      });
      return updated;
    });
  }, [selectedWorkouts]);

  return (
    <WorkoutContext.Provider
      value={{
        workoutNumberOfDays,
        restDays,
        setRestDays,
        getCurrentIndexDay,
        selectedWorkouts,
        repsPerSet,
        setRepsPerSet,
        selectedDay,
        setSelectedDay,
        showSuccessPopup,
        setWorkoutNumberOfDays,
        setInitialWorkoutPlan,
        initialWorkoutPlan,
        setWorkoutDaysIndex,
        workoutDaysIndex,
        shouldSave,
        setShouldSave,
        planName,
        setPlanName,
        setShowSuccessPopup,
        workoutDays,
        workoutDayNames,
        setworkoutDayNames,
        currentStepIndex,
        setSelectedWorkouts,
        selectedPlan,
        setSelectedPlan,
        customWorkoutPlan,
        setCurrentStepIndex,
        dayInput,
        setdayInput,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}
