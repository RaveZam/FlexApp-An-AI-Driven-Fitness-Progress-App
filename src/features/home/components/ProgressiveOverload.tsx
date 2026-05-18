import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ReAnimated, { FadeInDown } from "react-native-reanimated";
import * as Progress from "react-native-progress";

// ─── Types ────────────────────────────────────────────────────────────────────

type BodyPart = "All" | "Chest" | "Back" | "Shoulders" | "Biceps" | "Triceps" | "Legs";

interface ExerciseProgress {
  name: string;
  bodyPart: Exclude<BodyPart, "All">;
  currentWeight: number;
  currentReps: number;
  unit: "kg" | "lbs";
  deltaWeight: number;
  deltaReps: number;
  progress: number; // 0–1, relative to personal best
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const EXERCISES: ExerciseProgress[] = [
  { name: "Bench Press",      bodyPart: "Chest",     currentWeight: 95,    currentReps: 8,  unit: "kg", deltaWeight: 7.5, deltaReps: 1,  progress: 0.72 },
  { name: "Incline Dumbbell", bodyPart: "Chest",     currentWeight: 34,    currentReps: 10, unit: "kg", deltaWeight: 4,   deltaReps: 2,  progress: 0.61 },
  { name: "Squat",            bodyPart: "Legs",      currentWeight: 120,   currentReps: 5,  unit: "kg", deltaWeight: 5,   deltaReps: 0,  progress: 0.80 },
  { name: "Leg Press",        bodyPart: "Legs",      currentWeight: 200,   currentReps: 12, unit: "kg", deltaWeight: 10,  deltaReps: 2,  progress: 0.68 },
  { name: "Deadlift",         bodyPart: "Back",      currentWeight: 152.5, currentReps: 5,  unit: "kg", deltaWeight: 10,  deltaReps: 0,  progress: 0.85 },
  { name: "Barbell Row",      bodyPart: "Back",      currentWeight: 80,    currentReps: 8,  unit: "kg", deltaWeight: 5,   deltaReps: 1,  progress: 0.70 },
  { name: "Lat Pulldown",     bodyPart: "Back",      currentWeight: 72.5,  currentReps: 10, unit: "kg", deltaWeight: 2.5, deltaReps: 2,  progress: 0.58 },
  { name: "Overhead Press",   bodyPart: "Shoulders", currentWeight: 60,    currentReps: 6,  unit: "kg", deltaWeight: 2.5, deltaReps: 1,  progress: 0.65 },
  { name: "Lateral Raise",    bodyPart: "Shoulders", currentWeight: 14,    currentReps: 15, unit: "kg", deltaWeight: 2,   deltaReps: 3,  progress: 0.55 },
  { name: "Face Pull",        bodyPart: "Shoulders", currentWeight: 37.5,  currentReps: 12, unit: "kg", deltaWeight: 5,   deltaReps: 0,  progress: 0.60 },
  { name: "Barbell Curl",     bodyPart: "Biceps",    currentWeight: 40,    currentReps: 10, unit: "kg", deltaWeight: 5,   deltaReps: 2,  progress: 0.74 },
  { name: "Hammer Curl",      bodyPart: "Biceps",    currentWeight: 18,    currentReps: 12, unit: "kg", deltaWeight: 2,   deltaReps: 2,  progress: 0.62 },
  { name: "Tricep Pushdown",  bodyPart: "Triceps",   currentWeight: 50,    currentReps: 12, unit: "kg", deltaWeight: 5,   deltaReps: 2,  progress: 0.69 },
  { name: "Skull Crushers",   bodyPart: "Triceps",   currentWeight: 30,    currentReps: 10, unit: "kg", deltaWeight: 2.5, deltaReps: 1,  progress: 0.57 },
];

const FILTERS: BodyPart[] = ["All", "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: selected ? "#10b981" : "#242424",
        borderWidth: 1,
        borderColor: selected ? "#10b981" : "rgba(255,255,255,0.06)",
        marginRight: 8,
      }}
    >
      <Text
        style={{
          color: selected ? "#ffffff" : "#888",
          fontSize: 12,
          fontFamily: selected ? "Inter_700Bold" : "Inter_500Medium",
          letterSpacing: 0.2,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function ExerciseRow({
  item,
  delay,
}: {
  item: ExerciseProgress;
  delay: number;
}) {
  return (
    <ReAnimated.View entering={FadeInDown.delay(delay).duration(400)}>
      <View
        style={{
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.04)",
        }}
      >
        {/* Top row: name + weight */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          {/* Left: exercise info */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#ffffff",
                fontSize: 15,
                fontFamily: "Inter_600SemiBold",
                marginBottom: 2,
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                color: "#555",
                fontSize: 12,
                fontFamily: "Inter_400Regular",
              }}
            >
              last 4 weeks
            </Text>
          </View>

          {/* Right: weight + reps + deltas */}
          <View style={{ alignItems: "flex-end", gap: 5 }}>
            {/* Current stats */}
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 17,
                  fontFamily: "Inter_700Bold",
                  letterSpacing: -0.3,
                }}
              >
                {item.currentWeight} {item.unit}
              </Text>
              <Text
                style={{
                  color: "#666",
                  fontSize: 12,
                  fontFamily: "Inter_500Medium",
                }}
              >
                × {item.currentReps}
              </Text>
            </View>

            {/* Delta badges */}
            <View style={{ flexDirection: "row", gap: 5 }}>
              <View
                style={{
                  backgroundColor: "#0d2e1a",
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: "rgba(16,185,129,0.2)",
                }}
              >
                <Text
                  style={{
                    color: "#10b981",
                    fontSize: 11,
                    fontFamily: "Inter_700Bold",
                  }}
                >
                  +{item.deltaWeight} {item.unit}
                </Text>
              </View>
              {item.deltaReps > 0 && (
                <View
                  style={{
                    backgroundColor: "#0d2e1a",
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "rgba(16,185,129,0.2)",
                  }}
                >
                  <Text
                    style={{
                      color: "#10b981",
                      fontSize: 11,
                      fontFamily: "Inter_700Bold",
                    }}
                  >
                    +{item.deltaReps} rep{item.deltaReps > 1 ? "s" : ""}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Progress bar */}
        <Progress.Bar
          progress={item.progress}
          width={null}
          height={5}
          color="#10b981"
          unfilledColor="rgba(16,185,129,0.08)"
          borderColor="transparent"
          borderRadius={3}
          animationConfig={{ bounciness: 0 }}
        />
      </View>
    </ReAnimated.View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const PAGE_SIZE = 5;

export function ProgressiveOverload() {
  const [activeFilter, setActiveFilter] = useState<BodyPart>("All");
  const [page, setPage] = useState(0);

  const filtered =
    activeFilter === "All"
      ? EXERCISES
      : EXERCISES.filter((e) => e.bodyPart === activeFilter);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handleFilterChange = (f: BodyPart) => {
    setActiveFilter(f);
    setPage(0);
  };

  return (
    <ReAnimated.View
      entering={FadeInDown.delay(390).duration(400)}
      style={{
        marginHorizontal: 16,
        borderRadius: 16,
        backgroundColor: "#191919",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.04)",
      }}
    >
      {/* Top accent strip */}
      <View style={{ height: 3, backgroundColor: "#10b981", opacity: 0.7 }} />

      <View style={{ paddingTop: 16 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 15,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Progressive Overload
          </Text>

          <View
            style={{
              backgroundColor: "#0d2e1a",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderWidth: 1,
              borderColor: "rgba(16,185,129,0.2)",
            }}
          >
            <Feather name="trending-up" size={11} color="#10b981" />
            <Text
              style={{
                color: "#10b981",
                fontSize: 11,
                fontFamily: "Inter_700Bold",
              }}
            >
              trending up
            </Text>
          </View>
        </View>

        {/* Subtitle */}
        <Text
          style={{
            color: "#444",
            fontSize: 11,
            fontFamily: "Inter_400Regular",
            paddingHorizontal: 16,
            marginBottom: 14,
          }}
        >
          Compared to your last session
        </Text>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 14,
          }}
        >
          {FILTERS.map((f) => (
            <FilterChip
              key={f}
              label={f}
              selected={activeFilter === f}
              onPress={() => handleFilterChange(f)}
            />
          ))}
        </ScrollView>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: "rgba(255,255,255,0.04)",
            marginHorizontal: 16,
          }}
        />

        {/* Exercise list */}
        <View style={{ paddingHorizontal: 16 }}>
          {paginated.map((item, index) => (
            <ExerciseRow
              key={item.name}
              item={item}
              delay={index * 40}
            />
          ))}
        </View>

        {/* Pagination */}
        {totalPages > 1 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 4,
            }}
          >
            <TouchableOpacity
              onPress={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                opacity: page === 0 ? 0.3 : 1,
              }}
            >
              <Feather name="chevron-left" size={14} color="#10b981" />
              <Text
                style={{
                  color: "#10b981",
                  fontSize: 12,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Prev
              </Text>
            </TouchableOpacity>

            {/* Dots */}
            <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <TouchableOpacity key={i} onPress={() => setPage(i)} activeOpacity={0.7}>
                  <View
                    style={{
                      width: i === page ? 16 : 5,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: i === page ? "#10b981" : "rgba(16,185,129,0.25)",
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                opacity: page === totalPages - 1 ? 0.3 : 1,
              }}
            >
              <Text
                style={{
                  color: "#10b981",
                  fontSize: 12,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Next
              </Text>
              <Feather name="chevron-right" size={14} color="#10b981" />
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: 8 }} />
      </View>
    </ReAnimated.View>
  );
}
