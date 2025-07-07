"use client"

import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface QuickActionCardProps {
  title: string
  subtitle: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
  onPress: () => void
}

export default function QuickActionCard({ title, subtitle, icon, color, onPress }: QuickActionCardProps) {
  return (
    <TouchableOpacity style={[styles.card, { width: "48%" }]} onPress={onPress}>
      <Ionicons name={icon} size={24} color={color} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
})
