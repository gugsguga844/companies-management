import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { format, addMonths, subMonths, isSameMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import HonorariosMensais from "../../../components/MonthlyFees"
import HonorariosTable from "../../../components/FeesTable"
import MonthSelector from "../../../components/fees/MonthSelector"
import usePaymentStore from "../../../hooks/usePaymentStore"

interface HonorarioItem {
  id: number
  empresa: string
  valor: number
  vencimento?: string
  dataPagamento?: string
  status: "Atrasado" | "Pendente" | "Pago"
  diasAtraso?: number
  paymentId: number
  companyId: number
}

interface DadosMensais {
  total: number
  recebido: number
  pendente: number
  atrasado: number
  percentualRecebido: number
}

export default function FeesScreen() {
  const { paymentsList, fetchPayments, isLoading } = usePaymentStore()

  // Estado para controle do mês selecionado
  const [mesAtual, setMesAtual] = useState(new Date())
  const [mesFormatado, setMesFormatado] = useState(format(new Date(), "MM/yyyy"))

  // Estados para dados processados
  const [dadosMensais, setDadosMensais] = useState<DadosMensais>({
    total: 0,
    recebido: 0,
    pendente: 0,
    atrasado: 0,
    percentualRecebido: 0,
  })
  const [honorariosPendentes, setHonorariosPendentes] = useState<HonorarioItem[]>([])
  const [honorariosPagos, setHonorariosPagos] = useState<HonorarioItem[]>([])
  const [filteredPendentes, setFilteredPendentes] = useState<HonorarioItem[]>([])
  const [filteredPagos, setFilteredPagos] = useState<HonorarioItem[]>([])

  // Estados de controle
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"pendentes" | "pagos">("pendentes")
  const [showMonthSelector, setShowMonthSelector] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Carregar dados da API ao montar o componente
  useEffect(() => {
    loadData()
  }, [])

  // Efeito para processar dados quando paymentsList ou mês mudar
  useEffect(() => {
    if (paymentsList.length > 0) {
      processarDadosDoMes(mesFormatado)
    }
  }, [paymentsList, mesFormatado])

  // Efeito para filtrar dados quando termo de busca mudar
  useEffect(() => {
    handleSearch(searchTerm)
  }, [honorariosPendentes, honorariosPagos, searchTerm])

  const loadData = async () => {
    try {
      await fetchPayments()
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  // Função para calcular dias de atraso
  const calcularDiasAtraso = (dataVencimento: string): number => {
    const hoje = new Date()
    const vencimento = new Date(dataVencimento)
    const diffTime = hoje.getTime() - vencimento.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  // Função para determinar status baseado na data de vencimento
  const determinarStatus = (payment: any): "Atrasado" | "Pendente" | "Pago" => {
    if (payment.status === "PAGO") return "Pago"

    const diasAtraso = calcularDiasAtraso(payment.due_date)
    return diasAtraso > 0 ? "Atrasado" : "Pendente"
  }

  // Função para processar e filtrar dados do mês selecionado
  const processarDadosDoMes = (mes: string) => {
    const [mesNum, ano] = mes.split("/")
    const dataReferencia = new Date(Number.parseInt(ano), Number.parseInt(mesNum) - 1, 1)

    // Filtrar pagamentos do mês selecionado
    const pagamentosMes = paymentsList.filter((payment) => {
      const dataReferenciaPagamento = new Date(payment.reference_month)
      return isSameMonth(dataReferenciaPagamento, dataReferencia) && payment.company.is_active
    })

    // Converter para formato esperado pelos componentes
    const honorariosProcessados: HonorarioItem[] = pagamentosMes.map((payment) => {
      const status = determinarStatus(payment)
      const diasAtraso = status === "Atrasado" ? calcularDiasAtraso(payment.due_date) : undefined

      return {
        id: payment.id,
        empresa: payment.company.name,
        valor: Number.parseFloat(payment.value),
        vencimento: format(new Date(payment.due_date), "dd/MM/yyyy"),
        dataPagamento: payment.payment_date ? format(new Date(payment.payment_date), "dd/MM/yyyy") : undefined,
        status,
        diasAtraso,
        paymentId: payment.id,
        companyId: payment.company_id,
      }
    })

    // Separar por status
    const pendentes = honorariosProcessados.filter((h) => h.status === "Pendente" || h.status === "Atrasado")
    const pagos = honorariosProcessados.filter((h) => h.status === "Pago")

    setHonorariosPendentes(pendentes)
    setHonorariosPagos(pagos)

    // Calcular dados mensais
    const total = honorariosProcessados.reduce((sum, h) => sum + h.valor, 0)
    const recebido = pagos.reduce((sum, h) => sum + h.valor, 0)
    const pendente = pendentes.filter((h) => h.status === "Pendente").reduce((sum, h) => sum + h.valor, 0)
    const atrasado = pendentes.filter((h) => h.status === "Atrasado").reduce((sum, h) => sum + h.valor, 0)
    const percentualRecebido = total > 0 ? (recebido / total) * 100 : 0

    setDadosMensais({
      total,
      recebido,
      pendente,
      atrasado,
      percentualRecebido,
    })
  }

  // Funções para navegação entre meses
  const irParaMesAnterior = () => {
    const novoMes = subMonths(mesAtual, 1)
    setMesAtual(novoMes)
    setMesFormatado(format(novoMes, "MM/yyyy"))
  }

  const irParaProximoMes = () => {
    const novoMes = addMonths(mesAtual, 1)
    setMesAtual(novoMes)
    setMesFormatado(format(novoMes, "MM/yyyy"))
  }

  const selecionarMesAno = (valor: string) => {
    const [mesNum, ano] = valor.split("/")
    const novaData = new Date(Number.parseInt(ano), Number.parseInt(mesNum) - 1, 1)
    setMesFormatado(valor)
    setMesAtual(novaData)
    setShowMonthSelector(false)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredPendentes(honorariosPendentes)
      setFilteredPagos(honorariosPagos)
    } else {
      const termLower = term.toLowerCase()
      setFilteredPendentes(honorariosPendentes.filter((h) => h.empresa.toLowerCase().includes(termLower)))
      setFilteredPagos(honorariosPagos.filter((h) => h.empresa.toLowerCase().includes(termLower)))
    }
  }

  // Gerar opções de meses (12 meses para trás e 12 para frente)
  const gerarOpcoesMeses = () => {
    const opcoes = []
    const hoje = new Date()

    // 12 meses para trás
    for (let i = 12; i >= 0; i--) {
      const data = subMonths(hoje, i)
      const valor = format(data, "MM/yyyy")
      const label = format(data, "MMMM/yyyy", { locale: ptBR })
      opcoes.push({ valor, label })
    }

    // 12 meses para frente
    for (let i = 1; i <= 12; i++) {
      const data = addMonths(hoje, i)
      const valor = format(data, "MM/yyyy")
      const label = format(data, "MMMM/yyyy", { locale: ptBR })
      opcoes.push({ valor, label })
    }

    return opcoes
  }

  const mesesDisponiveis = gerarOpcoesMeses()
  const nomeMesAtual = format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR })

  // Dados para as abas
  const currentData = activeTab === "pendentes" ? filteredPendentes : filteredPagos
  const totalPendentes = filteredPendentes.length
  const totalPagos = filteredPagos.length

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Ionicons name="cash-outline" size={24} color="#059669" />
            <Text style={styles.title}>Honorários</Text>
          </View>
          <Text style={styles.subtitle}>Gerencie os honorários mensais das empresas</Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(auth)/(fees)/registerFees")}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Seletor de Mês */}
      <View style={styles.monthSelector}>
        <TouchableOpacity style={styles.monthNavButton} onPress={irParaMesAnterior}>
          <Ionicons name="chevron-back" size={20} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.monthDisplay} onPress={() => setShowMonthSelector(true)}>
          <Text style={styles.monthText}>{nomeMesAtual}</Text>
          <Ionicons name="chevron-down" size={16} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.monthNavButton} onPress={irParaProximoMes}>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Cards de Resumo Mensal */}
        <View style={styles.summarySection}>
          <HonorariosMensais
            dadosMensais={dadosMensais}
            mesAtual={mesAtual}
            onPreviousMonth={irParaMesAnterior}
            onNextMonth={irParaProximoMes}
          />
        </View>

        {/* Barra de Busca */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar empresas..."
              value={searchTerm}
              onChangeText={handleSearch}
              placeholderTextColor="#9CA3AF"
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tabs de Navegação */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "pendentes" && styles.activeTab]}
            onPress={() => setActiveTab("pendentes")}
          >
            <Text style={[styles.tabText, activeTab === "pendentes" && styles.activeTabText]}>
              Pendentes ({totalPendentes})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "pagos" && styles.activeTab]}
            onPress={() => setActiveTab("pagos")}
          >
            <Text style={[styles.tabText, activeTab === "pagos" && styles.activeTabText]}>Pagos ({totalPagos})</Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo das Tabs */}
        <View style={styles.tableContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#059669" />
              <Text style={styles.loadingText}>Carregando honorários...</Text>
            </View>
          ) : (
            <HonorariosTable
              data={currentData}
              type={activeTab}
              onRegisterPayment={() => router.push("/(auth)/(fees)/registerFees")}
            />
          )}
        </View>
      </ScrollView>

      {/* Botão Flutuante para Registrar Pagamentos */}
      {totalPendentes > 0 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => router.push("/(auth)/(fees)/registerFees")}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.floatingButtonText}>Registrar</Text>
        </TouchableOpacity>
      )}

      {/* Modal de Seleção de Mês */}
      <MonthSelector
        visible={showMonthSelector}
        meses={mesesDisponiveis}
        mesAtual={mesFormatado}
        onSelect={selecionarMesAno}
        onClose={() => setShowMonthSelector(false)}
      />
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
  addButton: {
    backgroundColor: "#059669",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  monthSelector: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  monthNavButton: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  monthDisplay: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "white",
    gap: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  content: {
    flex: 1,
  },
  summarySection: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#059669",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "white",
  },
  tableContainer: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#059669",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  floatingButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
})
