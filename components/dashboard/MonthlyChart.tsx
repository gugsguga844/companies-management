"use client"

import { View, Text, StyleSheet, Dimensions } from "react-native"

interface MonthlyData {
  month: string
  revenue: number
  received: number
}

interface MonthlyChartProps {
  data: MonthlyData[]
}

const { width } = Dimensions.get("window")
const chartWidth = width - 64 // 32px padding on each side

export default function MonthlyChart({ data }: MonthlyChartProps) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyChart}>
        <Text style={styles.emptyText}>Dados insuficientes para o gráfico</Text>
      </View>
    )
  }

  const maxValue = Math.max(...data.map((d) => Math.max(d.revenue, d.received)))
  const barWidth = (chartWidth - data.length * 8) / (data.length * 2) // 2 bars per month

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const revenueHeight = maxValue > 0 ? (item.revenue / maxValue) * 120 : 0
            const receivedHeight = maxValue > 0 ? (item.received / maxValue) * 120 : 0

            return (
              <View key={index} style={styles.monthGroup}>
                <View style={styles.barsGroup}>
                  <View style={[styles.bar, styles.revenueBar, { height: revenueHeight, width: barWidth }]} />
                  <View style={[styles.bar, styles.receivedBar, { height: receivedHeight, width: barWidth }]} />
                </View>
                <Text style={styles.monthLabel}>{item.month}</Text>
              </View>
            )
          })}
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.revenueColor]} />
          <Text style={styles.legendText}>Receita</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.receivedColor]} />
          <Text style={styles.legendText}>Recebido</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chart: {
    height: 160,
    justifyContent: "flex-end",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 140,
  },
  monthGroup: {
    alignItems: "center",
    flex: 1,
  },
  barsGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    marginBottom: 8,
  },
  bar: {
    borderRadius: 2,
    minHeight: 4,
  },
  revenueBar: {
    backgroundColor: "#3B82F6",
  },
  receivedBar: {
    backgroundColor: "#059669",
  },
  monthLabel: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  revenueColor: {
    backgroundColor: "#3B82F6",
  },
  receivedColor: {
    backgroundColor: "#059669",
  },
  legendText: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyChart: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
})
