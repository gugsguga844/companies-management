import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface MonthOption {
  valor: string
  label: string
}

interface MonthSelectorProps {
  visible: boolean
  meses: MonthOption[]
  mesAtual: string
  onSelect: (valor: string) => void
  onClose: () => void
}

export default function MonthSelector({ visible, meses, mesAtual, onSelect, onClose }: MonthSelectorProps) {
  const renderMonth = ({ item }: { item: MonthOption }) => (
    <TouchableOpacity
      style={[styles.monthItem, item.valor === mesAtual && styles.selectedMonth]}
      onPress={() => onSelect(item.valor)}
    >
      <Text style={[styles.monthText, item.valor === mesAtual && styles.selectedMonthText]}>{item.label}</Text>
      {item.valor === mesAtual && <Ionicons name="checkmark" size={20} color="#059669" />}
    </TouchableOpacity>
  )

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecionar Mês</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={meses}
            renderItem={renderMonth}
            keyExtractor={(item) => item.valor}
            showsVerticalScrollIndicator={false}
            style={styles.list}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  list: {
    paddingHorizontal: 20,
  },
  monthItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  selectedMonth: {
    backgroundColor: "#F0FDF4",
  },
  monthText: {
    fontSize: 16,
    color: "#111827",
  },
  selectedMonthText: {
    fontWeight: "600",
    color: "#059669",
  },
})
