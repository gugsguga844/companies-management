"use client"

import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Empresa {
  id: number
  name: string
  trade_name: string | null
  cnpj: string
  activity: string | null
  accounting_fee: number
  email: string
  billing_due_day: number
  is_active: boolean
  accounting_firm_id: number
}

interface CompanyCardProps {
  empresa: Empresa
  onEdit: () => void
  onDelete: () => void
  onToggleStatus: () => void
}

export default function CompanyCard({ empresa, onEdit, onDelete, onToggleStatus }: CompanyCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
    } catch {
      return "Data inválida"
    }
  }

  return (
    <View style={[styles.card, !empresa.is_active && styles.inactiveCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{empresa.name}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, empresa.is_active ? styles.activeBadge : styles.inactiveBadge]}>
              <Ionicons
                name={empresa.is_active ? "checkmark-circle" : "pause-circle"}
                size={12}
                color={empresa.is_active ? "#059669" : "#DC2626"}
              />
              <Text style={[styles.statusText, empresa.is_active ? styles.activeText : styles.inactiveText]}>
                {empresa.is_active ? "Ativa" : "Inativa"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton} onPress={onEdit}>
          <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        {empresa.cnpj && (
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={16} color="#6B7280" />
            <Text style={styles.infoText}>{empresa.cnpj}</Text>
          </View>
        )}

        {empresa.email && (
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={16} color="#6B7280" />
            <Text style={styles.infoText}>{empresa.email}</Text>
          </View>
        )}

        {empresa.activity && (
          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={16} color="#6B7280" />
            <Text style={styles.infoText}>{empresa.activity}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={16} color="#6B7280" />
          <Text style={styles.infoText}>R$ {empresa.accounting_fee.toLocaleString("pt-BR")}/mês</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.infoText}>Vencimento: {empresa.billing_due_day}º do mês</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Ionicons name="pencil" size={16} color="#059669" />
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onToggleStatus}>
          <Ionicons
            name={empresa.is_active ? "pause" : "play"}
            size={16}
            color={empresa.is_active ? "#D97706" : "#059669"}
          />
          <Text style={[styles.actionButtonText, { color: empresa.is_active ? "#D97706" : "#059669" }]}>
            {empresa.is_active ? "Desativar" : "Ativar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Ionicons name="trash" size={16} color="#DC2626" />
          <Text style={[styles.actionButtonText, { color: "#DC2626" }]}>Excluir</Text>
        </TouchableOpacity>
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
    borderLeftColor: "#059669",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inactiveCard: {
    borderLeftColor: "#DC2626",
    backgroundColor: "#FEFEFE",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 8,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  activeBadge: {
    backgroundColor: "#ECFDF5",
  },
  inactiveBadge: {
    backgroundColor: "#FEF2F2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  activeText: {
    color: "#059669",
  },
  inactiveText: {
    color: "#DC2626",
  },
  menuButton: {
    padding: 4,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  cardActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },
})
