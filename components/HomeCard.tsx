import { View, Text, StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface HomeCardProps {
  title: string;
  children: string;
	iconName: keyof typeof FontAwesome.glyphMap;
}

export default function HomeCard({ title, children, iconName }: HomeCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <FontAwesome name={iconName} size={16} color="#000" />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.children}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
	title: {
		fontSize: 16,
		fontWeight: "600",
		marginLeft: 8,
	},
	children: {
		fontSize: 16,
		fontWeight: "600",
		marginLeft: 8,
	}
});
