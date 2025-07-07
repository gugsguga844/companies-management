import { View, Text, StyleSheet } from "react-native"

interface DadosMensais {
  total: number
  recebido: number
  pendente: number
  atrasado: number
  percentualRecebido: number
}

interface HonorariosMensaisProps {
  dadosMensais: DadosMensais
  mesAtual: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
}

export default function HonorariosMensais({ dadosMensais }: HonorariosMensaisProps) {
  return (
    <View style={styles.container}>
      {/* Cards de Valores */}
      <View style={styles.valuesContainer}>
        <View style={styles.valuesRow}>
          <View style={[styles.valueCard, styles.totalCard]}>
            <Text style={styles.valueLabel}>Total</Text>
            <Text style={styles.valueAmount}>R$ {dadosMensais.total.toLocaleString("pt-BR")}</Text>
          </View>

          <View style={[styles.valueCard, styles.receivedCard]}>
            <Text style={styles.valueLabel}>Recebido</Text>
            <Text style={[styles.valueAmount, styles.receivedAmount]}>
              R$ {dadosMensais.recebido.toLocaleString("pt-BR")}
            </Text>
          </View>
        </View>

        <View style={styles.valuesRow}>
          <View style={[styles.valueCard, styles.pendingCard]}>
            <Text style={styles.valueLabel}>Pendente</Text>
            <Text style={[styles.valueAmount, styles.pendingAmount]}>
              R$ {dadosMensais.pendente.toLocaleString("pt-BR")}
            </Text>
          </View>

          <View style={[styles.valueCard, styles.overdueCard]}>
            <Text style={styles.valueLabel}>Atrasado</Text>
            <Text style={[styles.valueAmount, styles.overdueAmount]}>
              R$ {dadosMensais.atrasado.toLocaleString("pt-BR")}
            </Text>
          </View>
        </View>
      </View>

      {/* Barra de Progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Percentual Recebido</Text>
          <Text style={styles.progressPercentage}>{dadosMensais.percentualRecebido.toFixed(1)}%</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(dadosMensais.percentualRecebido, 100)}%` }]} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  valuesContainer: {
    gap: 12,
  },
  valuesRow: {
    flexDirection: "row",
    gap: 12,
  },
  valueCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
  },
  totalCard: {
    backgroundColor: "#F9FAFB",
  },
  receivedCard: {
    backgroundColor: "#ECFDF5",
  },
  pendingCard: {
    backgroundColor: "#FFFBEB",
  },
  overdueCard: {
    backgroundColor: "#FEF2F2",
  },
  valueLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  valueAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  receivedAmount: {
    color: "#059669",
  },
  pendingAmount: {
    color: "#D97706",
  },
  overdueAmount: {
    color: "#DC2626",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#059669",
    borderRadius: 4,
  },
})
