import { View } from "react-native";
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryTheme,
} from "victory-native";

export default function MyChart() {
  const DATA = [
    { x: 1, y: 10 },
    { x: 2, y: 15 },
    { x: 3, y: 12 },
    { x: 4, y: 25 },
    { x: 5, y: 18 },
    { x: 6, y: 30 },
    { x: 7, y: 22 },
  ];
  return (
    <View>
      <VictoryChart
        height={200}
        padding={{ top: 0, bottom: 40 }}
        theme={VictoryTheme.clean}
        domainPadding={{ y: 20 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: "#BFFA00" }, // axis line
            tickLabels: {
              fill: "white", // tick text color
              fontSize: 16,
              opacity: 0.5,
            },
          }}
        />

        <VictoryArea
          style={{
            data: {
              fill: "#BFFA00",
              stroke: "#BFFA00",
            },
          }}
          data={DATA}
          interpolation="natural"
          animate={{
            duration: 800,
          }}
        />
      </VictoryChart>
    </View>
  );
}
