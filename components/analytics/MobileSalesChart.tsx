import React from "react";
import { View } from "react-native";
import { LineChart } from "react-native-charts-wrapper";

function MobileSalesChart() {
  return (
    <View style={{ height: 300, paddingTop: 25 }}>
      <LineChart
        style={{
          flex: 1,
        }}
        data={{
          dataSets: [{ label: "demo", values: [{ y: 1 }, { y: 2 }, { y: 1 }] }],
        }}
      />
    </View>
  );
}

export default MobileSalesChart;
