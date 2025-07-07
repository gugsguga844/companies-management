"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import CompanyCard from "../../../components/companies/CompanyCard"
import CompanyModal from "../../../components/companies/CompanyModal"
import useCompanyStore from "../../../hooks/useCompanyStore"

interface Company {
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

export default function CompaniesScreen() {
  const { companiesList, fetchCompanies, createCompany, updateCompany, deleteCompany, isLoading } = useCompanyStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEmpresas, setFilteredEmpresas] = useState<Company[]>([])
  const [activeFilter, setActiveFilter] = useState<"todas" | "ativas" | "inativas">("todas")
  const [refreshing, setRefreshing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingEmpresa, setEditingEmpresa] = useState<Company | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [companiesList, searchTerm, activeFilter])

  const loadData = async () => {
    try {
      await fetchCompanies()
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as empresas.")
      console.error("Erro ao carregar empresas:", error)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const applyFilters = () => {
    let filtered = companiesList

    if (searchTerm.trim() !== "") {
      const termLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (empresa) =>
          empresa.name.toLowerCase().includes(termLower) ||
          empresa.cnpj?.toLowerCase().includes(termLower) ||
          empresa.email?.toLowerCase().includes(termLower),
      )
    }

    // Filtro por status
    if (activeFilter === "ativas") {
      filtered = filtered.filter((empresa) => empresa.is_active)
    } else if (activeFilter === "inativas") {
      filtered = filtered.filter((empresa) => !empresa.is_active)
    }

    setFilteredEmpresas(filtered)
  }

  const handleAddEmpresa = () => {
    setEditingEmpresa(null)
    setShowModal(true)
  }

  const handleEditEmpresa = (empresa: Company) => {
    setEditingEmpresa(empresa)
    setShowModal(true)
  }

  const handleSaveEmpresa = async (empresaData: Partial<Company>) => {
    try {
      if (editingEmpresa) {
        // Editar empresa existente
        await updateCompany(editingEmpresa.id, empresaData)
        Alert.alert("Sucesso!", "Empresa atualizada com sucesso!")
      } else {
        // Criar nova empresa
        await createCompany(empresaData)
        Alert.alert("Sucesso!", "Empresa cadastrada com sucesso!")
      }
      setShowModal(false)
      setEditingEmpresa(null)
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a empresa. Tente novamente.")
      console.error("Erro ao salvar empresa:", error)
    }
  }

  const handleDeleteEmpresa = (empresa: Company) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a empresa "${empresa.name}"?\n\nEsta ação não pode ser desfeita.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCompany(empresa.id)
              Alert.alert("Sucesso!", "Empresa excluída com sucesso!")
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a empresa. Tente novamente.")
              console.error("Erro ao excluir empresa:", error)
            }
          },
        },
      ],
    )
  }

  const handleToggleStatus = async (empresa: Company) => {
    const newStatus = !empresa.is_active
    const action = newStatus ? "ativar" : "desativar"

    Alert.alert(
      `Confirmar ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      `Tem certeza que deseja ${action} a empresa "${empresa.name}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              await updateCompany(empresa.id, { is_active: newStatus })
              Alert.alert("Sucesso!", `Empresa ${newStatus ? "ativada" : "desativada"} com sucesso!`)
            } catch (error) {
              Alert.alert("Erro", `Não foi possível ${action} a empresa. Tente novamente.`)
              console.error(`Erro ao ${action} empresa:`, error)
            }
          },
        },
      ],
    )
  }

  // Estatísticas
  const totalEmpresas = companiesList.length
  const empresasAtivas = companiesList.filter((e) => e.is_active).length
  const empresasInativas = totalEmpresas - empresasAtivas
  const receitaMensal = companiesList.filter((e) => e.is_active).reduce((sum, e) => sum + e.accounting_fee, 0)

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Ionicons name="business-outline" size={24} color="#059669" />
            <Text style={styles.title}>Empresas</Text>
          </View>
          <Text style={styles.subtitle}>Gerencie as empresas cadastradas</Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddEmpresa}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Cards de Estatísticas */}
      <View style={styles.statsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
          <View style={[styles.statCard, styles.totalCard]}>
            <View style={styles.statIcon}>
              <Ionicons name="business" size={20} color="#059669" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{totalEmpresas}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>

          <View style={[styles.statCard, styles.activeCard]}>
            <View style={styles.statIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{empresasAtivas}</Text>
              <Text style={styles.statLabel}>Ativas</Text>
            </View>
          </View>

          <View style={[styles.statCard, styles.inactiveCard]}>
            <View style={styles.statIcon}>
              <Ionicons name="pause-circle" size={20} color="#DC2626" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{empresasInativas}</Text>
              <Text style={styles.statLabel}>Inativas</Text>
            </View>
          </View>

          <View style={[styles.statCard, styles.revenueCard]}>
            <View style={styles.statIcon}>
              <Ionicons name="cash" size={20} color="#059669" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>R$ {receitaMensal.toLocaleString("pt-BR")}</Text>
              <Text style={styles.statLabel}>Receita Mensal</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Barra de Busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome, CNPJ ou email..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#9CA3AF"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === "todas" && styles.activeFilter]}
          onPress={() => setActiveFilter("todas")}
        >
          <Text style={[styles.filterText, activeFilter === "todas" && styles.activeFilterText]}>
            Todas ({totalEmpresas})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, activeFilter === "ativas" && styles.activeFilter]}
          onPress={() => setActiveFilter("ativas")}
        >
          <Text style={[styles.filterText, activeFilter === "ativas" && styles.activeFilterText]}>
            Ativas ({empresasAtivas})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, activeFilter === "inativas" && styles.activeFilter]}
          onPress={() => setActiveFilter("inativas")}
        >
          <Text style={[styles.filterText, activeFilter === "inativas" && styles.activeFilterText]}>
            Inativas ({empresasInativas})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Empresas */}
      <ScrollView
        style={styles.empresasList}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Carregando empresas...</Text>
          </View>
        ) : filteredEmpresas.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>
              {companiesList.length === 0 ? "Nenhuma empresa cadastrada" : "Nenhuma empresa encontrada"}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {companiesList.length === 0
                ? "Comece cadastrando sua primeira empresa"
                : "Tente ajustar os filtros ou termo de busca"}
            </Text>
            {companiesList.length === 0 && (
              <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddEmpresa}>
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.emptyStateButtonText}>Cadastrar Empresa</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredEmpresas.map((empresa) => (
            <CompanyCard
              key={empresa.id}
              empresa={empresa}
              onEdit={() => handleEditEmpresa(empresa)}
              onDelete={() => handleDeleteEmpresa(empresa)}
              onToggleStatus={() => handleToggleStatus(empresa)}
            />
          ))
        )}
      </ScrollView>

      {/* Botão Flutuante */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleAddEmpresa}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.floatingButtonText}>Nova Empresa</Text>
      </TouchableOpacity>

      {/* Modal de Cadastro/Edição */}
      <CompanyModal
        visible={showModal}
        empresa={editingEmpresa}
        onSave={handleSaveEmpresa}
        onClose={() => {
          setShowModal(false)
          setEditingEmpresa(null)
        }}
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
  statsContainer: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  statsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 140,
    gap: 12,
  },
  totalCard: {
    backgroundColor: "#F0FDF4",
  },
  activeCard: {
    backgroundColor: "#ECFDF5",
  },
  inactiveCard: {
    backgroundColor: "#FEF2F2",
  },
  revenueCard: {
    backgroundColor: "#F0FDF4",
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
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
  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "white",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activeFilter: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeFilterText: {
    color: "white",
  },
  empresasList: {
    flex: 1,
    paddingHorizontal: 16,
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    fontWeight: "600",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#D1D5DB",
    textAlign: "center",
  },
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#059669",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  emptyStateButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
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
