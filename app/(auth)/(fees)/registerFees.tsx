import { useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { format, parse, addMonths, subMonths, isSameMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import EmpresaCard from "../../../components/fees/CompanyCard"
import MonthSelector from "../../../components/fees/MonthSelector"
import usePaymentStore from "../../../hooks/usePaymentStore"

interface EmpresaProcessada {
  id: number
  nome: string
  cnpj: string
  honorarioBase: number
  status: "Pendente" | "Pago"
  vencimento: string
  dataPagamento?: string
  paymentId: number
  companyId: number
}

export default function RegisterFeesScreen() {
  const { paymentsList, fetchPayments, updatePaymentStatus, removePaymentStatus, isLoading } = usePaymentStore()

  // Estado para controle do mês selecionado
  const [mesAtual, setMesAtual] = useState(new Date())
  const [mesFormatado, setMesFormatado] = useState(format(new Date(), "MM/yyyy"))

  // Estados para empresas e pagamentos
  const [empresas, setEmpresas] = useState<EmpresaProcessada[]>([])
  const [filteredEmpresas, setFilteredEmpresas] = useState<EmpresaProcessada[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmpresas, setSelectedEmpresas] = useState<{ [key: number]: boolean }>({})
  const [honorariosAjustados, setHonorariosAjustados] = useState<{ [key: number]: number }>({})
  const [dataPagamento, setDataPagamento] = useState(new Date().toISOString())
  const [showMonthSelector, setShowMonthSelector] = useState(false)

  // Carregar dados da API ao montar o componente
  useEffect(() => {
    fetchPayments().catch((error) => {
      Alert.alert("Erro", "Não foi possível carregar os dados dos honorários.")
      console.error("Erro ao carregar pagamentos:", error)
    })
  }, [])

  // Efeito para processar dados quando paymentsList ou mês mudar
  useEffect(() => {
    if (paymentsList.length > 0) {
      processarDadosDoMes(mesFormatado)
    }
  }, [paymentsList, mesFormatado])

  useEffect(() => {
    handleSearch(searchTerm)
  }, [empresas, searchTerm])

  // Função para processar e filtrar dados do mês selecionado
  const processarDadosDoMes = (mes: string) => {
    const [mesNum, ano] = mes.split("/")
    const dataReferencia = new Date(Number.parseInt(ano), Number.parseInt(mesNum) - 1, 1)

    // Filtrar pagamentos do mês selecionado
    const pagamentosMes = paymentsList.filter((payment) => {
      const dataReferenciaPagamento = new Date(payment.reference_month)
      return isSameMonth(dataReferenciaPagamento, dataReferencia)
    })

    // Converter para formato esperado pelos componentes
    const empresasProcessadas: EmpresaProcessada[] = pagamentosMes
      .filter((payment) => payment.company.is_active) // Apenas empresas ativas
      .map((payment) => ({
        id: payment.id, // Usando o ID do pagamento como ID único
        nome: payment.company.name,
        cnpj: `${payment.company_id.toString().padStart(2, "0")}.000.000/0001-00`, // CNPJ fictício baseado no company_id
        honorarioBase: Number.parseFloat(payment.value),
        status: payment.status === "PAGO" ? "Pago" : "Pendente",
        vencimento: format(new Date(payment.due_date), "dd/MM/yyyy"),
        dataPagamento: payment.payment_date ? format(new Date(payment.payment_date), "dd/MM/yyyy") : undefined,
        paymentId: payment.id,
        companyId: payment.company_id,
      }))

    setEmpresas(empresasProcessadas)

    // Inicializar honorários ajustados com valores base
    const honorariosIniciais: { [key: number]: number } = {}
    empresasProcessadas.forEach((empresa) => {
      honorariosIniciais[empresa.id] = empresa.honorarioBase
    })
    setHonorariosAjustados(honorariosIniciais)

    // Limpar seleções
    setSelectedEmpresas({})
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
    setMesFormatado(valor)
    setMesAtual(parse(valor, "MM/yyyy", new Date()))
    setShowMonthSelector(false)
  }

  // Calcular totais
  const totalEmpresas = filteredEmpresas.length
  const totalSelecionado = Object.keys(selectedEmpresas).filter((id) => selectedEmpresas[Number.parseInt(id)]).length
  const valorSelecionado = filteredEmpresas
    .filter((empresa) => selectedEmpresas[empresa.id])
    .reduce((sum, empresa) => {
      const valor = honorariosAjustados[empresa.id] || empresa.honorarioBase
      return sum + Number(valor)
    }, 0)

  const handleSearch = (term: string) => {
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredEmpresas(empresas)
    } else {
      setFilteredEmpresas(
        empresas.filter(
          (empresa) => empresa.nome.toLowerCase().includes(term.toLowerCase()) || empresa.cnpj.includes(term),
        ),
      )
    }
  }

  const handleSelectAll = () => {
    const empresasPendentes = filteredEmpresas.filter((empresa) => empresa.status === "Pendente")
    const allSelected = empresasPendentes.every((empresa) => selectedEmpresas[empresa.id])

    const newSelected = { ...selectedEmpresas }
    empresasPendentes.forEach((empresa) => {
      newSelected[empresa.id] = !allSelected
    })

    setSelectedEmpresas(newSelected)
  }

  const handleSelectEmpresa = (id: number) => {
    setSelectedEmpresas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleHonorarioChange = (id: number, valor: string) => {
    setHonorariosAjustados((prev) => ({
      ...prev,
      [id]: Number.parseFloat(valor) || 0,
    }))
  }

  const handleRemovePayment = (empresa: EmpresaProcessada) => {
    Alert.alert(
      "Remover Pagamento",
      `Deseja remover o pagamento de ${empresa.nome}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await removePaymentStatus(empresa.paymentId)
              Alert.alert("Sucesso!", "Pagamento removido com sucesso!")
            } catch (error) {
              console.error("Erro ao remover pagamento:", error)
              Alert.alert("Erro", "Não foi possível remover o pagamento. Tente novamente.")
            }
          },
        },
      ]
    )
  }

  const handleRegistrarPagamentos = () => {
    if (totalSelecionado === 0) {
      Alert.alert("Atenção", "Selecione pelo menos uma empresa para registrar o pagamento.")
      return
    }

    Alert.alert(
      "Confirmar Pagamentos",
      `Registrar ${totalSelecionado} pagamentos no valor total de R$ ${valorSelecionado.toLocaleString("pt-BR")}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              // Obter empresas selecionadas
              const empresasSelecionadas = filteredEmpresas.filter((empresa) => selectedEmpresas[empresa.id])
              
              // Atualizar status de cada pagamento selecionado
              const promises = empresasSelecionadas.map((empresa) => 
                updatePaymentStatus(empresa.paymentId, "PAGO", dataPagamento)
              )
              
              await Promise.all(promises)

              Alert.alert("Sucesso!", `${totalSelecionado} pagamentos registrados com sucesso!`, [
                {
                  text: "OK",
                  onPress: () => {
                    router.back()
                  },
                },
              ])
            } catch (error) {
              console.error("Erro ao registrar pagamentos:", error)
              Alert.alert("Erro", "Não foi possível registrar os pagamentos. Tente novamente.")
            }
          },
        },
      ],
    )
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

    // 12 meses para frente (excluindo o mês atual que já foi adicionado)
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

  // Mostrar loading se estiver carregando dados
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Carregando honorários...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#059669" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Ionicons name="cash-outline" size={24} color="#059669" />
            <Text style={styles.title}>Registrar Honorários</Text>
          </View>
          <Text style={styles.subtitle}>Registre os pagamentos de honorários mensais</Text>
        </View>
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
        </View>
      </View>

      {/* Resumo de Seleção */}
      <View style={styles.selectionSummary}>
        <Text style={styles.summaryText}>
          <Text style={styles.summaryBold}>{totalSelecionado}</Text> de {totalEmpresas} empresas selecionadas
        </Text>
        {filteredEmpresas.filter((e) => e.status === "Pendente").length > 0 && (
          <TouchableOpacity style={styles.selectAllButton} onPress={handleSelectAll}>
            <Text style={styles.selectAllText}>
              {filteredEmpresas.filter((e) => e.status === "Pendente").every((empresa) => selectedEmpresas[empresa.id])
                ? "Desmarcar todos"
                : "Marcar todos"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de Empresas */}
      <FlatList
        style={styles.empresasList}
        data={filteredEmpresas}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>
              {empresas.length === 0 ? "Nenhum honorário encontrado para este mês" : "Nenhuma empresa encontrada"}
            </Text>
            {empresas.length === 0 && (
              <Text style={styles.emptyStateSubtext}>
                Verifique se existem empresas cadastradas ou selecione outro mês
              </Text>
            )}
          </View>
        )}
        renderItem={({ item: empresa }) => (
          <EmpresaCard
            empresa={empresa}
            isSelected={selectedEmpresas[empresa.id] || false}
            honorarioAjustado={honorariosAjustados[empresa.id]}
            onSelect={() => handleSelectEmpresa(empresa.id)}
            onHonorarioChange={(valor: string) => handleHonorarioChange(empresa.id, valor)}
            onRemovePayment={empresa.status === "Pago" ? () => handleRemovePayment(empresa) : undefined}
          />
        )}
      />

      {/* Footer com Resumo e Botão */}
      {totalSelecionado > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.totalInfo}>
              <Text style={styles.totalLabel}>Total selecionado:</Text>
              <Text style={styles.totalValue}>
                {totalSelecionado} empresas - R$ {valorSelecionado.toLocaleString("pt-BR")}
              </Text>
            </View>

            {/* Data do Pagamento */}
            <View style={styles.dateSelector}>
              <Text style={styles.dateLabel}>Data do Pagamento:</Text>
              <View style={styles.dateDisplay}>
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text style={styles.dateText}>
                  {format(new Date(dataPagamento), "dd/MM/yyyy HH:mm")}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegistrarPagamentos}>
              <Text style={styles.registerButtonText}>Registrar {totalSelecionado} Pagamentos</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
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
  searchContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  selectionSummary: {
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryText: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryBold: {
    fontWeight: "600",
    color: "#111827",
  },
  selectAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "white",
  },
  selectAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  empresasList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#D1D5DB",
    textAlign: "center",
    marginTop: 4,
  },
  footer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  footerContent: {
    gap: 12,
  },
  totalInfo: {
    alignItems: "center",
    gap: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  dateSelector: {
    alignItems: "center",
    gap: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "white",
  },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "white",
  },
  dateText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  registerButton: {
    backgroundColor: "#059669",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 300,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  datePickerContent: {
    marginBottom: 20,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    marginBottom: 8,
  },
  datePickerHint: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  datePickerButton: {
    backgroundColor: "#059669",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  datePickerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
