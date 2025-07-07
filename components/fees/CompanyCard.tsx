import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface Empresa {
  id: number
  nome: string
  cnpj: string
  honorarioBase: number
  status: "Pendente" | "Pago"
  vencimento: string
  dataPagamento?: string
}

interface EmpresaCardProps {
  empresa: Empresa
  isSelected: boolean
  honorarioAjustado: number
  onSelect: () => void
  onHonorarioChange: (valor: string) => void
}

export default function EmpresaCard({
  empresa,
  isSelected,
  honorarioAjustado,
  onSelect,
  onHonorarioChange,
}: EmpresaCardProps) {
  const [editandoHonorario, setEditandoHonorario] = useState(false)
  const [valorTemp, setValorTemp] = useState(honorarioAjustado?.toString() || empresa.honorarioBase.toString())

  const handleSalvarHonorario = () => {
    onHonorarioChange(valorTemp)
    setEditandoHonorario(false)
  }

  const handleCancelarEdicao = () => {
    setValorTemp(honorarioAjustado?.toString() || empresa.honorarioBase.toString())
    setEditandoHonorario(false)
  }

  return (
    <View style={[styles.card, empresa.status === "Pago" && styles.paidCard, isSelected && styles.selectedCard]}>
      <View style={styles.cardContent}>
        {/* Checkbox e Informações da Empresa */}
        <View style={styles.mainContent}>
          {empresa.status === "Pendente" ? (
            <TouchableOpacity style={styles.checkboxContainer} onPress={onSelect}>
              <View style={[styles.checkbox, isSelected && styles.checkedCheckbox]}>
                {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.checkboxContainer}>
              <View style={styles.paidIcon}>
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
              </View>
            </View>
          )}

          <View style={styles.empresaInfo}>
            <Text style={styles.empresaNome}>{empresa.nome}</Text>
            <Text style={styles.empresaCnpj}>{empresa.cnpj}</Text>

            {/* Informações de Valor e Vencimento */}
            <View style={styles.detailsRow}>
              <View style={styles.valorContainer}>
                <Ionicons name="cash-outline" size={14} color="#6B7280" />
                {editandoHonorario ? (
                  <View style={styles.editContainer}>
                    <Text style={styles.currencySymbol}>R$</Text>
                    <TextInput
                      style={styles.valorInput}
                      value={valorTemp}
                      onChangeText={setValorTemp}
                      keyboardType="numeric"
                      autoFocus
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={handleSalvarHonorario}>
                      <Ionicons name="checkmark" size={14} color="#059669" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancelarEdicao}>
                      <Ionicons name="close" size={14} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.valorDisplay}>
                    <Text style={styles.valorText}>
                      R$ {(honorarioAjustado || empresa.honorarioBase).toLocaleString("pt-BR")}
                    </Text>
                    {empresa.status === "Pendente" && (
                      <TouchableOpacity style={styles.editButton} onPress={() => setEditandoHonorario(true)}>
                        <Ionicons name="pencil" size={12} color="#6B7280" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.vencimentoContainer}>
                <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                <Text style={styles.vencimentoText}>Venc: {empresa.vencimento}</Text>
              </View>
            </View>

            {/* Status Badge */}
            {empresa.status === "Pago" && (
              <View style={styles.statusContainer}>
                <View style={styles.paidBadge}>
                  <Ionicons name="checkmark" size={12} color="#059669" />
                  <Text style={styles.paidBadgeText}>Pago em {empresa.dataPagamento}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginVertical: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    borderLeftColor: "#059669",
    backgroundColor: "#F0FDF4",
  },
  paidCard: {
    borderLeftColor: "#059669",
    backgroundColor: "#F0FDF4",
  },
  cardContent: {
    padding: 16,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkboxContainer: {
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  checkedCheckbox: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  paidIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  empresaInfo: {
    flex: 1,
    gap: 8,
  },
  empresaNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  empresaCnpj: {
    fontSize: 14,
    color: "#6B7280",
  },
  detailsRow: {
    gap: 12,
  },
  valorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  currencySymbol: {
    fontSize: 14,
    color: "#6B7280",
  },
  valorInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    minWidth: 80,
    backgroundColor: "white",
  },
  saveButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: "#ECFDF5",
  },
  cancelButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: "#FEF2F2",
  },
  valorDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  valorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  editButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: "#F9FAFB",
  },
  vencimentoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  vencimentoText: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusContainer: {
    marginTop: 4,
  },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    gap: 4,
  },
  paidBadgeText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
  },
})
