import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface HonorarioItem {
  id: number
  empresa: string
  valor: number
  vencimento?: string
  dataPagamento?: string
  status: "Atrasado" | "Pendente" | "Pago"
  diasAtraso?: number
}

interface HonorariosTableProps {
  data: HonorarioItem[]
  type: "pendentes" | "pagos"
  onRegisterPayment?: () => void
}

export default function HonorariosTable({ data, type, onRegisterPayment }: HonorariosTableProps) {
  const renderItem = ({ item }: { item: HonorarioItem }) => (
    <View style={styles.tableRow}>
      <View style={styles.rowContent}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{item.empresa}</Text>
          <Text style={styles.companyValue}>R$ {item.valor.toLocaleString("pt-BR")}</Text>
        </View>

        <View style={styles.statusInfo}>
          {type === "pendentes" ? (
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <Text style={styles.dateText}>{item.vencimento}</Text>
            </View>
          ) : (
            <View style={styles.dateContainer}>
              <Ionicons name="checkmark-circle" size={14} color="#059669" />
              <Text style={styles.dateText}>{item.dataPagamento}</Text>
            </View>
          )}

          <View
            style={[
              styles.statusBadge,
              item.status === "Pago" && styles.paidBadge,
              item.status === "Pendente" && styles.pendingBadge,
              item.status === "Atrasado" && styles.overdueBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status === "Pago" && styles.paidText,
                item.status === "Pendente" && styles.pendingText,
                item.status === "Atrasado" && styles.overdueText,
              ]}
            >
              {item.status}
              {item.diasAtraso && item.diasAtraso > 0 && ` (${item.diasAtraso} dias)`}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          if (type === "pendentes" && onRegisterPayment) {
            onRegisterPayment()
          }
        }}
      >
        <Text style={styles.actionButtonText}>{type === "pendentes" ? "Registrar" : "Detalhes"}</Text>
      </TouchableOpacity>
    </View>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name={type === "pendentes" ? "time-outline" : "checkmark-circle-outline"} size={48} color="#D1D5DB" />
      <Text style={styles.emptyStateText}>
        {type === "pendentes" ? "Nenhum honorário pendente" : "Nenhum pagamento registrado"}
      </Text>
      <Text style={styles.emptyStateSubtext}>
        {type === "pendentes"
          ? "Todos os honorários deste mês foram pagos"
          : "Nenhum pagamento foi registrado neste mês"}
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableRow: {
    paddingVertical: 12,
  },
  rowContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  companyValue: {
    fontSize: 13,
    color: "#6B7280",
  },
  statusInfo: {
    alignItems: "flex-end",
    gap: 4,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  paidBadge: {
    backgroundColor: "#ECFDF5",
    borderColor: "#059669",
  },
  pendingBadge: {
    backgroundColor: "#FFFBEB",
    borderColor: "#D97706",
  },
  overdueBadge: {
    backgroundColor: "#FEF2F2",
    borderColor: "#DC2626",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  paidText: {
    color: "#059669",
  },
  pendingText: {
    color: "#D97706",
  },
  overdueText: {
    color: "#DC2626",
  },
  actionButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    fontWeight: "600",
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: "#D1D5DB",
    textAlign: "center",
  },
})
