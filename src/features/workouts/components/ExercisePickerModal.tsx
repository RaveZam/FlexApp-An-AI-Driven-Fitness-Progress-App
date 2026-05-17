import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchExerciseCatalog } from "../services/workoutSupabaseService";
import type { CatalogExercise } from "../types";

type Props = {
  visible: boolean;
  onSelect: (exercise: CatalogExercise) => void;
  onClose: () => void;
};

export function ExercisePickerModal({ visible, onSelect, onClose }: Props) {
  const [catalog, setCatalog] = useState<CatalogExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    setSearch("");
    setActiveFilter(null);
    fetchExerciseCatalog()
      .then(setCatalog)
      .finally(() => setLoading(false));
  }, [visible]);

  const muscleGroups = useMemo(() => {
    const seen = new Set<string>();
    const groups: string[] = [];
    for (const e of catalog) {
      if (e.muscleGroup) {
        const normalized = e.muscleGroup.toLowerCase();
        if (!seen.has(normalized)) {
          seen.add(normalized);
          groups.push(normalized);
        }
      }
    }
    return groups.sort();
  }, [catalog]);

  const filtered = useMemo(() => {
    return catalog.filter((e) => {
      const matchesSearch =
        !search.trim() ||
        e.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        !activeFilter ||
        (e.muscleGroup ?? "").toLowerCase() === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [catalog, search, activeFilter]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }} edges={["top"]}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 12,
          }}
        >
          <Text
            style={{
              flex: 1,
              color: "#fff",
              fontSize: 18,
              fontFamily: "Inter_600SemiBold",
              letterSpacing: -0.3,
            }}
          >
            Select Exercise
          </Text>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={22} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#191919",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.06)",
              paddingHorizontal: 12,
              gap: 8,
            }}
          >
            <Ionicons name="search" size={16} color="#444" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search exercises..."
              placeholderTextColor="#444"
              style={{
                flex: 1,
                color: "#fff",
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                paddingVertical: 12,
              }}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")} hitSlop={8}>
                <Ionicons name="close-circle" size={16} color="#444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Muscle group filter chips */}
        {!loading && muscleGroups.length > 0 && (
          <View style={{ height: 44, marginBottom: 8 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: "center", height: 44 }}
          >
            <TouchableOpacity
              onPress={() => setActiveFilter(null)}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 20,
                backgroundColor: activeFilter === null ? "#10b981" : "#191919",
                borderWidth: 1,
                borderColor: activeFilter === null ? "#10b981" : "rgba(255,255,255,0.08)",
              }}
            >
              <Text
                style={{
                  color: activeFilter === null ? "#000" : "#888",
                  fontSize: 12,
                  fontFamily: "Inter_500Medium",
                  letterSpacing: 0.3,
                }}
              >
                All
              </Text>
            </TouchableOpacity>

            {muscleGroups.map((group) => {
              const active = activeFilter === group;
              return (
                <TouchableOpacity
                  key={group}
                  onPress={() => setActiveFilter(active ? null : group)}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 20,
                    backgroundColor: active ? "#10b981" : "#191919",
                    borderWidth: 1,
                    borderColor: active ? "#10b981" : "rgba(255,255,255,0.08)",
                  }}
                >
                  <Text
                    style={{
                      color: active ? "#000" : "#888",
                      fontSize: 12,
                      fontFamily: "Inter_500Medium",
                      letterSpacing: 0.3,
                      textTransform: "capitalize",
                    }}
                  >
                    {group}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          </View>
        )}

        {loading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color="#10b981" />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.04)" }} />
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                activeOpacity={0.7}
                style={{
                  paddingVertical: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 14,
                      fontFamily: "Inter_500Medium",
                      marginBottom: item.muscleGroup ? 3 : 0,
                    }}
                  >
                    {item.name}
                  </Text>
                  {item.muscleGroup && (
                    <Text
                      style={{
                        color: "#555",
                        fontSize: 11,
                        fontFamily: "Inter_400Regular",
                        letterSpacing: 0.3,
                        textTransform: "capitalize",
                      }}
                    >
                      {item.muscleGroup}
                    </Text>
                  )}
                </View>
                <Ionicons name="add-circle-outline" size={20} color="#10b981" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={{ paddingTop: 40, alignItems: "center" }}>
                <Text style={{ color: "#444", fontSize: 13, fontFamily: "Inter_400Regular" }}>
                  No exercises found
                </Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}
