import { View, Text, StyleSheet } from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface CompanyCardProps {
  name: string;
  cnpj: string;
  business_activity: string | null;
  payment: string;
}

function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

// function formatPayment(payment: number): string {
//   return payment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
// }

export default function CompanyCard({
  name,
  cnpj,
  business_activity,
  payment,
}: CompanyCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.companyHeader}>
        <View style={styles.titleContainer}>
          <FontAwesome name="building" size={16} color="#000" />
          <Text style={styles.title}>{name}</Text>
        </View>
        <Text style={styles.children}>{formatCNPJ(cnpj)}</Text>
      </View>
      <View style={styles.companyBody}>
        <View style={styles.bodyTitleContainer}>
          <FontAwesome name="briefcase" size={16} color="#000" />
          <Text style={styles.title}>Atividade: <Text style={styles.children}>{business_activity}</Text></Text>
        </View>
        <View style={styles.bodyTitleContainer}>
          <FontAwesome name="dollar" size={16} color="#000" />
          {/* <Text style={styles.title}>Honorários: <Text style={styles.children}>{formatPayment(payment)}</Text></Text> */}
          <Text style={styles.title}>Honorários: <Text style={styles.children}>{payment}</Text></Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    fontWeight: "bold",
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
    color: "#666",
  },
  companyHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  companyBody: {
    padding: 20,
  },
  bodyTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  }
});
