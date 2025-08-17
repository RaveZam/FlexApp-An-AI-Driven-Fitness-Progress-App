import { View } from "react-native";
import { VictoryArea, VictoryChart } from "victory-native";

export default function LineChart() {
  const DATA = [
    { x: 1, y: 40 },
    { x: 2, y: 45 },
    { x: 3, y: 42 },
    { x: 4, y: 43 },
    { x: 5, y: 45 },
    { x: 6, y: 48 },
  ];

  return (
    <View>
      <VictoryChart
        height={140}
        width={200}
        padding={{ top: 20, bottom: 40 }}
        domainPadding={{ y: 20 }}
      >
        {/* <VictoryAxis
          style={{
            tickLabels: {
              fill: "white",
              fontSize: 16,
              opacity: 0.5,
            },
            grid: {
              stroke: "#ffffff",
              opacity: 0.07,
              strokeDasharray: "4, 4",
            },
          }}
        /> */}
        {/* <VictoryAxis
          dependentAxis
          style={{
            tickLabels: {
              fill: "white",
              fontSize: 12,
              opacity: 0.3,
            },
            grid: {
              opacity: 0.07,
              strokeDasharray: "4, 4",
            },
          }}
        /> */}
        <VictoryArea
          data={DATA}
          interpolation="natural"
          style={{
            data: {
              fill: "#065f46", // Emerald green fill

              strokeWidth: 2,
            },
          }}
        />
      </VictoryChart>
    </View>
  );
}
