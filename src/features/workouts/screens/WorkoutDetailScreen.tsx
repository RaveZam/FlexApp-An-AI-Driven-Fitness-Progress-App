import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUpdateWorkoutDays } from "../hooks/useUpdateWorkoutDays";
import { useWorkouts } from "../hooks/useWorkouts";
import type { Exercise } from "../types";
import "@/global.css";

const DAY_LABELS = ["S", "M", "T", "W", "TH", "F", "S"];

const EXERCISE_IMAGES: Record<string, any> = {
  "lat pulldown": require("@/assets/images/WorkoutImages/latpulldownimage.webp"),
};

function imageForExercise(name: string) {
  return EXERCISE_IMAGES[name.trim().toLowerCase()] ?? null;
}

function DayChipsEditor({
  workoutId,
  initialDays,
  onSaved,
}: {
  workoutId: string;
  initialDays: number[];
  onSaved: () => void;
}) {
  const [days, setDays] = useState<number[]>(initialDays);
  const { saveDays } = useUpdateWorkoutDays();

  useEffect(() => {
    setDays(initialDays);
  }, [workoutId]);

  function toggleDay(day: number) {
    const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    setDays(next);
    saveDays(workoutId, next);
    onSaved();
  }

  return (
    <View>
      <Text
        style={{
          color: "#666",
          fontSize: 11,
          fontFamily: "Inter_500Medium",
          letterSpacing: 0.8,
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Days
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {DAY_LABELS.map((label, i) => {
          const selected = days.includes(i);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => toggleDay(i)}
              activeOpacity={0.7}
              style={{
                flex: 1,
                aspectRatio: 1,
                borderRadius: 10,
                backgroundColor: selected ? "rgba(16,185,129,0.15)" : "#191919",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: selected ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.06)",
              }}
            >
              <Text
                style={{
                  color: selected ? "#10b981" : "#555",
                  fontSize: 12,
                  fontFamily: selected ? "Inter_600SemiBold" : "Inter_400Regular",
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function ExerciseRow({ exercise, index }: { exercise: Exercise; index: number }) {
  const image = imageForExercise(exercise.name);
  return (
    <Animated.View entering={FadeInRight.delay(100 + index * 60).duration(400)}>
      <View
        style={{
          backgroundColor: "#191919",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.04)",
          flexDirection: "row",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: 3,
            alignSelf: "stretch",
            backgroundColor: "#10b981",
            opacity: 0.5,
          }}
        />
        <View
          style={{
            width: 56,
            height: 56,
            margin: 10,
            borderRadius: 8,
            backgroundColor: "#0f0f0f",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {image ? (
            <Image
              source={image}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <Ionicons name="barbell-outline" size={22} color="#333" />
          )}
        </View>
        <View
          style={{
            flex: 1,
            paddingVertical: 14,
            paddingRight: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: "#e0e0e0",
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              flex: 1,
            }}
          >
            {exercise.name}
          </Text>
          <Text
            style={{
              color: "#10b981",
              fontSize: 13,
              fontFamily: "Inter_500Medium",
              marginLeft: 12,
            }}
          >
            {exercise.targetSets} × {exercise.targetReps}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workouts, refresh } = useWorkouts();

  const workout = workouts.find((w) => w.id === id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }} edges={["top"]}>
      <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: "#191919",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <Ionicons name="chevron-back" size={20} color="#aaa" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                color: "#ffffff",
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                letterSpacing: -0.3,
              }}
              numberOfLines={1}
            >
              {workout?.name ?? "Workout"}
            </Text>
          </View>

          <View style={{ width: 36 }} />
        </View>

        {!workout ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Ionicons name="barbell-outline" size={32} color="#333" />
            <Text style={{ color: "#444", fontSize: 13, fontFamily: "Inter_400Regular" }}>
              Workout not found.
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 20 }}
          >
            <Animated.View entering={FadeInDown.delay(40).duration(400)}>
              <DayChipsEditor
                workoutId={workout.id}
                initialDays={workout.daysOfWeek}
                onSaved={refresh}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(80).duration(400)}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <View
                  style={{ width: 4, height: 18, borderRadius: 2, backgroundColor: "#10b981" }}
                />
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 13,
                    fontFamily: "Inter_500Medium",
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                  }}
                >
                  Exercises
                </Text>
                <Text
                  style={{
                    color: "#444",
                    fontSize: 11,
                    fontFamily: "Inter_400Regular",
                    marginLeft: "auto",
                  }}
                >
                  {workout.exercises.length} total
                </Text>
              </View>

              {workout.exercises.length === 0 ? (
                <Animated.View
                  entering={FadeInDown.delay(120).duration(400)}
                  style={{ paddingTop: 40, alignItems: "center", gap: 8 }}
                >
                  <Ionicons name="barbell-outline" size={28} color="#333" />
                  <Text
                    style={{
                      color: "#444",
                      fontSize: 13,
                      fontFamily: "Inter_400Regular",
                      textAlign: "center",
                    }}
                  >
                    No exercises in this workout.
                  </Text>
                </Animated.View>
              ) : (
                <View style={{ gap: 8 }}>
                  {workout.exercises
                    .slice()
                    .sort((a, b) => a.position - b.position)
                    .map((exercise, index) => (
                      <ExerciseRow key={exercise.id} exercise={exercise} index={index} />
                    ))}
                </View>
              )}
            </Animated.View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
