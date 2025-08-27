import { Colors } from "@/constants/Colors";
import { Dimensions } from "react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
} from "victory-native";

export default function BarGraph() {
  const liftData = [
    { x: 1, y: 40 },
    { x: 2, y: 45 },
    { x: 3, y: 42 },
    { x: 4, y: 43 },
    { x: 5, y: 45 },
    { x: 6, y: 48 },
  ];

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      height={150}
      width={Dimensions.get("window").width - 140}
      padding={{ bottom: 40, left: 50, right: 50 }}
      domainPadding={{ y: 20 }}
    >
      <VictoryAxis
        dependentAxis
        tickValues={[Math.max(...liftData.map((d) => d.y))]}
        tickFormat={(value) => `${value}lbs`}
      />

      <VictoryBar
        data={liftData}
        labelComponent={<VictoryTooltip />}
        labels={({ datum }) => `${datum.y}lbs`}
        cornerRadius={{
          top: 4,
          bottom: 4,
        }}
        style={{
          data: {
            fill: Colors.light.text,
            stroke: "none",
            width: 20,
          },
        }}
      />
    </VictoryChart>
  );
}
