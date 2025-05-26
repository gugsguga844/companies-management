import { View, Text, StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface CompanyCardProps {
  name: string;
  cnpj: string;
  business_activity: string;
}

export default function CompanyCard({ name, cnpj, business_activity }: CompanyCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <FontAwesome name="building" size={16} color="#000" />
        <Text style={styles.title}>{name}</Text>
      </View>
      <Text style={styles.children}>{cnpj}</Text>
      <Text style={styles.children}>{business_activity}</Text>
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
