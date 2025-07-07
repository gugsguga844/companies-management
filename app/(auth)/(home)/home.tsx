import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { format, startOfMonth, endOfMonth, isSameMonth, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import DashboardCard from "../../../components/dashboard/DashboardCard"
import QuickActionCard from "../../../components/dashboard/QuickActionCard"
import RecentActivityCard from "../../../components/dashboard/RecentActivityCard"
import MonthlyChart from "../../../components/dashboard/MonthlyChart"
import usePaymentStore from "../../../hooks/usePaymentStore"
import useCompanyStore from "../../../hooks/useCompanyStore"

interface DashboardStats {
  totalCompanies: number
  activeCompanies: number
  monthlyRevenue: number
  pendingFees: number
  receivedFees: number
  overdueFees: number
  receivedPercentage: number
}

interface MonthlyData {
  month: string
  revenue: number
  received: number
}

export default function DashboardScreen() {
  const { paymentsList, fetchPayments, fetchMonthlyRevenue, isLoading: paymentsLoading } = usePaymentStore()
  const { companiesList, fetchCompanies, isLoading: companiesLoading } = useCompanyStore()
  const monthlyRevenue = usePaymentStore((state) => state.monthlyRevenue)

  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    activeCompanies: 0,
    monthlyRevenue: 0,
    pendingFees: 0,
    receivedFees: 0,
    overdueFees: 0,
    receivedPercentage: 0,
  })

  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [currentMonth] = useState(new Date())

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (paymentsList.length > 0 && companiesList.length > 0) {
      calculateStats()
      generateMonthlyData()
    }
  }, [paymentsList, companiesList, monthlyRevenue])

  const loadData = async () => {
    try {
      const currentYear = currentMonth.getFullYear()
      const currentMonthNumber = currentMonth.getMonth() + 1
      await Promise.all([
        fetchPayments(), 
        fetchCompanies(), 
        fetchMonthlyRevenue(currentYear, currentMonthNumber)
      ])
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const calculateStats = () => {
    // Estatísticas de empresas
    const totalCompanies = companiesList.length
    const activeCompanies = companiesList.filter((c) => c.is_active).length

    // Filtrar pagamentos do mês atual
    const currentMonthPayments = paymentsList.filter((payment) => {
      const paymentDate = new Date(payment.reference_month)
      return isSameMonth(paymentDate, currentMonth) && payment.company.is_active
    })

    // Calcular honorários
    const pendingFees = currentMonthPayments
      .filter((p) => p.status === "PENDENTE")
      .reduce((sum, p) => sum + Number(p.value), 0)

    const receivedFees = currentMonthPayments
      .filter((p) => p.status === "PAGO")
      .reduce((sum, p) => sum + Number(p.value), 0)

    // Calcular atrasados (vencimento passou)
    const today = new Date()
    const overdueFees = currentMonthPayments
      .filter((p) => p.status === "PENDENTE" && new Date(p.due_date) < today)
      .reduce((sum, p) => sum + Number(p.value), 0)

    const totalFees = pendingFees + receivedFees
    const receivedPercentage = totalFees > 0 ? (receivedFees / totalFees) * 100 : 0

    setStats({
      totalCompanies,
      activeCompanies,
      monthlyRevenue,
      pendingFees,
      receivedFees,
      overdueFees,
      receivedPercentage,
    })
  }

  const generateMonthlyData = () => {
    const data: MonthlyData[] = []

    // Últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(currentMonth, i)
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)

      const monthPayments = paymentsList.filter((payment) => {
        const paymentDate = new Date(payment.reference_month)
        return paymentDate >= monthStart && paymentDate <= monthEnd && payment.company.is_active
      })

      const revenue = monthPayments.reduce((sum, p) => sum + Number(p.value), 0)
      const received = monthPayments.filter((p) => p.status === "PAGO").reduce((sum, p) => sum + Number(p.value), 0)

      data.push({
        month: format(month, "MMM", { locale: ptBR }),
        revenue,
        received,
      })
    }

    setMonthlyData(data)
  }

  const isLoading = paymentsLoading || companiesLoading

  const quickActions = [
    {
      title: "Registrar Pagamento",
      subtitle: "Marcar honorários como pagos",
      icon: "cash-outline" as const,
      color: "#059669",
      onPress: () => router.push("/(auth)/(fees)/registerFees"),
    },
    {
      title: "Nova Empresa",
      subtitle: "Cadastrar nova empresa",
      icon: "business-outline" as const,
      color: "#3B82F6",
      onPress: () => router.push("/(auth)/(companies)/companies"),
    },
    {
      title: "Ver Relatórios",
      subtitle: "Relatórios detalhados",
      icon: "bar-chart-outline" as const,
      color: "#8B5CF6",
      onPress: () => router.push("/(auth)/reports"),
    },
    {
      title: "Honorários",
      subtitle: "Gerenciar honorários",
      icon: "card-outline" as const,
      color: "#F59E0B",
      onPress: () => router.push("/(auth)/(fees)/fees"),
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "payment" as const,
      title: "Pagamento recebido",
      subtitle: "Tech Solutions Ltda - R$ 1.500,00",
      time: "2 horas atrás",
      icon: "checkmark-circle" as const,
      color: "#059669",
    },
    {
      id: 2,
      type: "company" as const,
      title: "Nova empresa cadastrada",
      subtitle: "Comércio Digital ME",
      time: "1 dia atrás",
      icon: "business" as const,
      color: "#3B82F6",
    },
    {
      id: 3,
      type: "overdue" as const,
      title: "Honorário em atraso",
      subtitle: "Consultoria ABC - Venc: 15/12",
      time: "2 dias atrás",
      icon: "time" as const,
      color: "#DC2626",
    },
    {
      id: 4,
      type: "payment" as const,
      title: "Pagamento recebido",
      subtitle: "Indústria XYZ - R$ 2.000,00",
      time: "3 dias atrás",
      icon: "checkmark-circle" as const,
      color: "#059669",
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Ionicons name="home-outline" size={24} color="#059669" />
            <Text style={styles.title}>Dashboard</Text>
          </View>
          <Text style={styles.subtitle}>
            Resumo de {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR }).replace(/^\w/, c => c.toUpperCase())}
          </Text>
        </View>

        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#6B7280" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Carregando dashboard...</Text>
          </View>
        ) : (
          <>
            {/* Cards Principais */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Visão Geral</Text>
              <View style={styles.statsGrid}>
                <DashboardCard
                  title="Empresas Ativas"
                  value={stats.activeCompanies.toString()}
                  subtitle={`de ${stats.totalCompanies} total`}
                  icon="business"
                  color="#059669"
                  trend={stats.activeCompanies > 0 ? "up" : "neutral"}
                />

                <DashboardCard
                  title="Receita Mensal"
                  value={`R$ ${(stats.monthlyRevenue || 0).toLocaleString("pt-BR")}`}
                  subtitle="Honorários ativos"
                  icon="cash"
                  color="#3B82F6"
                  trend="up"
                />

                <DashboardCard
                  title="Recebido"
                  value={`R$ ${stats.receivedFees.toLocaleString("pt-BR")}`}
                  subtitle={`${stats.receivedPercentage.toFixed(1)}% do total`}
                  icon="checkmark-circle"
                  color="#059669"
                  trend={stats.receivedPercentage > 50 ? "up" : "down"}
                />

                <DashboardCard
                  title="Pendente"
                  value={`R$ ${stats.pendingFees.toLocaleString("pt-BR")}`}
                  subtitle="A receber"
                  icon="time"
                  color="#F59E0B"
                  trend="neutral"
                />
              </View>
            </View>

            {/* Alertas */}
            {stats.overdueFees > 0 && (
              <View style={styles.section}>
                <View style={styles.alertCard}>
                  <View style={styles.alertIcon}>
                    <Ionicons name="warning" size={24} color="#DC2626" />
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>Honorários em Atraso</Text>
                    <Text style={styles.alertSubtitle}>R$ {stats.overdueFees.toLocaleString("pt-BR")} em atraso</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.alertButton}
                    onPress={() => router.push("/(auth)/(fees)/fees")}
                  >
                    <Text style={styles.alertButtonText}>Ver</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Gráfico Mensal */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Evolução Mensal</Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/reports")}>
                  <Text style={styles.sectionLink}>Ver mais</Text>
                </TouchableOpacity>
              </View>
              <MonthlyChart data={monthlyData} />
            </View>

            {/* Ações Rápidas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ações Rápidas</Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action, index) => (
                  <QuickActionCard key={index} {...action} />
                ))}
              </View>
            </View>

            {/* Atividades Recentes */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Atividades Recentes</Text>
                <TouchableOpacity>
                  <Text style={styles.sectionLink}>Ver todas</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.activitiesList}>
                {recentActivities.map((activity) => (
                  <RecentActivityCard key={activity.id} {...activity} />
                ))}
              </View>
            </View>

            {/* Resumo do Mês */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumo de {format(currentMonth, "MMMM", { locale: ptBR }).replace(/^\w/, c => c.toUpperCase())}</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Receita Mensal Total:</Text>
                  <Text style={styles.summaryValue}>
                    R$ {(stats.monthlyRevenue || 0).toLocaleString("pt-BR")}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total a Receber:</Text>
                  <Text style={styles.summaryValue}>
                    R$ {(stats.pendingFees + stats.receivedFees).toLocaleString("pt-BR")}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Já Recebido:</Text>
                  <Text style={[styles.summaryValue, styles.positiveValue]}>
                    R$ {stats.receivedFees.toLocaleString("pt-BR")}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Pendente:</Text>
                  <Text style={[styles.summaryValue, styles.warningValue]}>
                    R$ {stats.pendingFees.toLocaleString("pt-BR")}
                  </Text>
                </View>
                {stats.overdueFees > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Em Atraso:</Text>
                    <Text style={[styles.summaryValue, styles.negativeValue]}>
                      R$ {stats.overdueFees.toLocaleString("pt-BR")}
                    </Text>
                  </View>
                )}
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabelBold}>Taxa de Recebimento:</Text>
                  <Text
                    style={[
                      styles.summaryValueBold,
                      stats.receivedPercentage > 70 ? styles.positiveValue : styles.warningValue,
                    ]}
                  >
                    {stats.receivedPercentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerContent: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#059669",
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#DC2626",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  sectionLink: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  alertCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
  },
  alertIcon: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: 12,
    color: "#7F1D1D",
  },
  alertButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  alertButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  activitiesList: {
    gap: 8,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryLabelBold: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  summaryValueBold: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "bold",
  },
  positiveValue: {
    color: "#059669",
  },
  warningValue: {
    color: "#D97706",
  },
  negativeValue: {
    color: "#DC2626",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
})
