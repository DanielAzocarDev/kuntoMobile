import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import PeriodSelector, {
  PeriodType,
} from "@/components/analytics/PeriodSelector"; // Asegúrate que la ruta sea correcta

const screenWidth = Dimensions.get("window").width;

// --- 1. DATOS SIMULADOS (MOCK DATA) ---
// Aquí definimos los datos que simulan la respuesta de tu API.

const mockDailyData = {
  labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  data: [20, 45, 28, 80, 99, 43, 60],
};

const mockWeeklyData = {
  labels: ["S1", "S2", "S3", "S4"],
  data: [150, 230, 180, 300],
};

const mockMonthlyData = {
  labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  data: [800, 950, 1200, 980, 1500, 1300],
};

// --- 2. EL COMPONENTE ---

const MobileSalesChart = () => {
  const [period, setPeriod] = useState<PeriodType>("daily");

  // useMemo seleccionará el conjunto de datos correcto según el período.
  // Es eficiente porque solo se vuelve a calcular si 'period' cambia.
  const chartData = useMemo(() => {
    let labels: string[] = [];
    let data: number[] = [];

    if (period === "daily") {
      labels = mockDailyData.labels;
      data = mockDailyData.data;
    } else if (period === "weekly") {
      labels = mockWeeklyData.labels;
      data = mockWeeklyData.data;
    } else {
      // 'monthly'
      labels = mockMonthlyData.labels;
      data = mockMonthlyData.data;
    }

    // Devolvemos el objeto que LineChart espera.
    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Verde
          strokeWidth: 3,
        },
      ],
    };
  }, [period]); // La dependencia es solo 'period'

  // Configuración visual de la gráfica
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    propsForDots: { r: "4", strokeWidth: "2", stroke: "#10b981" },
    propsForBackgroundLines: { stroke: "#e5e7eb" },
  };

  return (
    <View style={styles.wrapper}>
      {/* --- Título y Selector de Período --- */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Ventas (Ejemplo)</Text>
      </View>

      <PeriodSelector
        selectedPeriod={period}
        onPeriodChange={setPeriod} // Cambia el estado 'period'
        style={styles.selector}
      />

      {/* --- Contenedor de la Gráfica --- */}
      <View style={styles.chartCard}>
        <LineChart
          data={{
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                ],
              },
            ],
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </View>
  );
};

// --- 3. ESTILOS ---

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerRow: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  selector: {
    marginBottom: 8,
  },
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default MobileSalesChart;

// import React, { useMemo, useState } from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { useQuery } from "@tanstack/react-query";
// import {
//   getDailyAnalytics,
//   getWeeklyAnalytics,
//   getMonthlyAnalytics,
//   DailyAnalytics,
//   WeeklyAnalytics,
//   MonthlyAnalytics,
//   safeMobileNumber,
// } from "@/api/analytics";
// import PeriodSelector, {
//   PeriodType,
// } from "@/components/analytics/PeriodSelector";
// import { LineChart } from "react-native-chart-kit";

// const screenWidth = Dimensions.get("window").width;

// interface MobileSalesChartProps {
//   style?: any;
//   height?: number;
// }

// const MobileSalesChart: React.FC<MobileSalesChartProps> = ({
//   style,
//   height = 220,
// }) => {
//   const [period, setPeriod] = useState<PeriodType>("daily");

//   const daily = useQuery({
//     queryKey: ["analytics", "daily", 7],
//     queryFn: () => getDailyAnalytics(7),
//     enabled: period === "daily",

//   });

//   const weekly = useQuery({
//     queryKey: ["analytics", "weekly", 4],
//     queryFn: () => getWeeklyAnalytics(4),
//     enabled: period === "weekly",
//   });

//   const monthly = useQuery({
//     queryKey: ["analytics", "monthly", 6],
//     queryFn: () => getMonthlyAnalytics(6),
//     enabled: period === "monthly",
//   });

//   // Hook useMemo simplificado y corregido
//   const { labels, data, isLoading } = useMemo(() => {
//     let rawData: any[] = [];
//     let labels: string[] = [];
//     let data: number[] = [];
//     let loading = false;

//     if (period === "daily") {
//       rawData = (daily.data?.data || []) as DailyAnalytics[];
//       const sliced = rawData.slice(-7);
//       labels = sliced.map((d) =>
//         new Date(d.date)
//           .toLocaleDateString("es-ES", { day: "2-digit", month: "short" })
//           .replace(" ", "\n")
//       );
//       data = sliced.map((d) => safeMobileNumber(d.totalAmount));
//       loading = daily.isLoading || daily.isFetching;
//     } else if (period === "weekly") {
//       rawData = (weekly.data?.data || []) as WeeklyAnalytics[];
//       const sliced = rawData.slice(-4);
//       labels = sliced.map((_, i) => `S${i + 1}`);
//       data = sliced.map((d) => safeMobileNumber(d.totalAmount));
//       loading = weekly.isLoading || weekly.isFetching;
//     } else {
//       // Mensual
//       rawData = (monthly.data?.data || []) as MonthlyAnalytics[];
//       const sliced = rawData.slice(-6);
//       labels = sliced.map((d) =>
//         new Date(`${d.month}-02`).toLocaleDateString("es-ES", {
//           month: "short",
//         })
//       );
//       data = sliced.map((d) => safeMobileNumber(d.totalAmount));
//       loading = monthly.isLoading || monthly.isFetching;
//     }

//     // *** LA CORRECCIÓN CLAVE ***
//     // Si solo hay un punto, duplícalo para que la gráfica pueda renderizar una línea.
//     if (data.length === 1) {
//       labels.push(""); // Agrega una etiqueta vacía para el segundo punto
//       data.push(data[0]); // Duplica el valor del dato
//     }

//     return { labels, data, isLoading: loading };
//   }, [
//     period,
//     daily.data,
//     daily.isLoading,
//     daily.isFetching,
//     weekly.data,
//     weekly.isLoading,
//     weekly.isFetching,
//     monthly.data,
//     monthly.isLoading,
//     monthly.isFetching,
//   ]);

//   const hasData = data && data.length > 0 && data.some((val) => val > 0);

//   const chartData = {
//     labels,
//     datasets: [
//       {
//         data: hasData ? data : [0], // Asegura que 'data' nunca esté vacío
//         color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
//         strokeWidth: 3,
//       },
//     ],
//   };

//   const chartConfig = {
//     backgroundColor: "#ffffff",
//     backgroundGradientFrom: "#ffffff",
//     backgroundGradientTo: "#ffffff",
//     decimalPlaces: 0,
//     color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
//     labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
//     style: {
//       borderRadius: 16,
//     },
//     propsForDots: {
//       r: "4",
//       strokeWidth: "2",
//       stroke: "#10b981",
//     },
//     propsForBackgroundLines: {
//       strokeDasharray: "",
//       stroke: "#e5e7eb",
//       strokeWidth: 1,
//     },
//   };

//   console.log({ chartData });
//   console.log(labels);
//   console.log(data);

//   return (
//     <View>
//       <Text>Hola</Text>
//     </View>
//   );

//   return (
//     <View style={[styles.wrapper, style]}>
//       <View style={styles.headerRow}>
//         <Text style={styles.title}>Ventas</Text>
//       </View>

//       <PeriodSelector
//         selectedPeriod={period}
//         onPeriodChange={setPeriod}
//         style={styles.selector}
//       />

//       <View style={styles.chartCard}>
//         {isLoading ? (
//           <View style={styles.loadingBox}>
//             <Text style={styles.loadingText}>Cargando gráfico...</Text>
//           </View>
//         ) : !hasData ? (
//           <View style={styles.emptyBox}>
//             <Text style={styles.emptyTitle}>Sin datos</Text>
//             <Text style={styles.emptyDesc}>
//               Realiza ventas para ver la tendencia
//             </Text>
//           </View>
//         ) : (
//           <LineChart
//             data={chartData}
//             width={screenWidth - 40}
//             height={height}
//             chartConfig={chartConfig}
//             bezier
//             style={styles.chart}
//             withDots={true}
//             withInnerLines={true}
//             withOuterLines={false}
//             withVerticalLines={false}
//             withHorizontalLines={true}
//             fromZero={true}
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// // ... (tus estilos permanecen igual)
// const styles = StyleSheet.create({
//   wrapper: {
//     paddingHorizontal: 20,
//     marginBottom: 12,
//   },
//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#1f2937",
//   },
//   selector: {
//     marginBottom: 8,
//   },
//   chartCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: 12,
//     paddingVertical: 8,
//     paddingHorizontal: 6,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 3.84,
//     elevation: 4,
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
//   loadingBox: {
//     height: 220,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#f9fafb",
//     borderRadius: 8,
//   },
//   loadingText: {
//     color: "#6b7280",
//   },
//   emptyBox: {
//     height: 220,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#f9fafb",
//     borderRadius: 8,
//   },
//   emptyTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#6b7280",
//   },
//   emptyDesc: {
//     color: "#9ca3af",
//     marginTop: 4,
//   },
// });

// export default MobileSalesChart;
