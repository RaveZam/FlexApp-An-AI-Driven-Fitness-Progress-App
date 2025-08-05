// import { navgationHelpers } from "@/app/helpers/navigationHelpers";
import { useAuth } from "@/auth/useAuth";
import { DaysOfTheWeek } from "@/constants/WorkoutConstants";
import { workoutPlanService } from "@/services/workoutPlanService";
import { WorkoutContextType } from "@/types/WorkoutContextTypes";
import { InitialWorkoutPlan, Workouts } from "@/types/WorkoutTypes";
import React, { createContext, useEffect, useState } from "react";
import { navgationHelpers } from "../helpers/navigationHelpers";
import {
  getCurrentIndexDay,
  getInitialWorkoutPlan,
} from "../helpers/workoutHelpers";

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
  const [dayOfTheWeek, setDayOfTheWeek] = useState<string[]>([]);
  const [currentDayWorkout, setCurrentDayWorkout] = useState<Workouts[]>([]);
  const [activeWorkoutID, setActiveWorkoutID] = useState<number | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<any>(null);

  const [activeWorkoutSession, setActiveWorkoutSession] = useState<
    number | null
  >(null);

  const customWorkoutPlan = workoutDayNames?.map((day, index) => ({
    day: day,
    key: day.toLowerCase().replace(/\s+/g, "-"),
    dayOfTheWeek: workoutDays[index],
  }));

  useEffect(() => {
    setInitialWorkoutPlan(getInitialWorkoutPlan(customWorkoutPlan));
  }, [workoutDayNames]);

  // This Initates The Finish Functionality After Adding Workout Day Names
  useEffect(() => {
    if (initialWorkoutPlan?.workoutPlan?.length == workoutDays.length) {
      navgationHelpers.goToWorkoutSelector();
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
        dayOfTheWeek,
        setDayOfTheWeek,
        currentDayWorkout,
        setCurrentDayWorkout,
        currentWorkout,
        setCurrentWorkout,
        activeWorkoutID,
        setActiveWorkoutID,
        activeWorkoutSession,
        setActiveWorkoutSession,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}
