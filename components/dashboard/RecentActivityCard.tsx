"use client"

import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface RecentActivityCardProps {
  id: number
  type: "payment" | "company" | "overdue"
  title: string
  subtitle: string
  time: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
}

export default function RecentActivityCard({ title, subtitle, time, icon, color }: RecentActivityCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <Text style={styles.time}>{time}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  time: {
    fontSize: 11,
    color: "#9CA3AF",
  },
})
