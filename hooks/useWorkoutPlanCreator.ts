export const useWorkoutPlanCreator = () => {
  // This Grabs the Initial WorkoutPlan ever time workoutDayNames are added

  // Custom Workout Logic

  // This Adds the workout

  // This function adds the selectedWorkouts to that said day and then moves on to the next day.
  // function handleNextDay() {
  //   let key = "";
  //   if (selectedPlan.length > 0) {
  //     console.log("SelectedPlan Detected ");
  //     key = selectedPlan[currentStepIndex]?.key;
  //   }

  //   if (customWorkoutPlan.length > 0) {
  //     console.log("Custom workout Detected ");
  //     key = customWorkoutPlan[currentStepIndex]?.key;
  //   }

  //   if (!key) {
  //     console.log("No key found");
  //     return;
  //   }

  //   setInitialWorkoutPlan((prev: any) => {
  //     const updatedWorkoutPlan = [...prev.workoutPlan];
  //     updatedWorkoutPlan[currentStepIndex] = {
  //       ...updatedWorkoutPlan[currentStepIndex],
  //       workouts: repsPerSet,
  //     };
  //     return { ...prev, workoutPlan: updatedWorkoutPlan };
  //   });

  //   if (currentStepIndex < customWorkoutPlan?.length - 1) {
  //     setCurrentStepIndex(currentStepIndex + 1);
  //     clearWorkouts();
  //     router.push("/Workouts/WorkoutSelector");
  //   } else {
  //     setShouldSave(true);
  //     return;
  //   }
  // }

  // function clearWorkouts() {
  //   setSelectedWorkouts([]);
  //   setRepsPerSet([]);
  // }

  // useEffect(() => {
  //   setRepsPerSet((prev) => {
  //     const updated = selectedWorkouts.map((workout) => {
  //       const existing = prev.find((w) => w.id === workout.id);
  //       return existing ?? { ...workout, sets: 2, reps: "8-10" };
  //     });
  //     return updated;
  //   });
  // }, [selectedWorkouts]);

  // const handleSuccessPopupClose = () => {
  //   setShowSuccessPopup(false);
  //   clearWorkouts();
  //   router.push("/Workouts");
  // };

  return {};
};
