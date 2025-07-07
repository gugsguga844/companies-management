"use client"

import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface DashboardCardProps {
  title: string
  value: string
  subtitle: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
  trend?: "up" | "down" | "neutral"
}

export default function DashboardCard({ title, value, subtitle, icon, color, trend = "neutral" }: DashboardCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "trending-up"
      case "down":
        return "trending-down"
      default:
        return "remove"
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "#059669"
      case "down":
        return "#DC2626"
      default:
        return "#6B7280"
    }
  }

  return (
    <View style={[styles.card, { width: "48%" }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Ionicons name={getTrendIcon()} size={16} color={getTrendColor()} />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    gap: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  subtitle: {
    fontSize: 11,
    color: "#9CA3AF",
  },
})
