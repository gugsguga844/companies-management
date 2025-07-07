"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

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

interface CompanyModalProps {
  visible: boolean
  empresa: Company | null
  onSave: (empresaData: Partial<Company>) => void
  onClose: () => void
}

export default function CompanyModal({ visible, empresa, onSave, onClose }: CompanyModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    trade_name: "",
    cnpj: "",
    activity: "",
    accounting_fee: "",
    email: "",
    billing_due_day: "10",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (empresa) {
      // Modo edição
      setFormData({
        name: empresa.name || "",
        trade_name: empresa.trade_name || "",
        cnpj: empresa.cnpj || "",
        activity: empresa.activity || "",
        email: empresa.email || "",
        accounting_fee: empresa.accounting_fee?.toString() || "",
        billing_due_day: empresa.billing_due_day.toString(),
      })
    } else {
      // Modo criação
      setFormData({
        name: "",
        trade_name: "",
        cnpj: "",
        activity: "",
        email: "",
        accounting_fee: "",
        billing_due_day: "10",
      })
    }
    setErrors({})
  }, [empresa, visible])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome da empresa é obrigatório"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    }

    if (!formData.accounting_fee.trim()) {
      newErrors.accounting_fee = "Honorário mensal é obrigatório"
    } else if (isNaN(Number(formData.accounting_fee)) || Number(formData.accounting_fee) <= 0) {
      newErrors.accounting_fee = "Honorário deve ser um valor válido maior que zero"
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = "CNPJ é obrigatório"
    }

    if (formData.cnpj && !isValidCNPJ(formData.cnpj)) {
      newErrors.cnpj = "CNPJ inválido"
    }

    if (!formData.billing_due_day.trim()) {
      newErrors.billing_due_day = "Dia de vencimento é obrigatório"
    } else if (isNaN(Number(formData.billing_due_day)) || Number(formData.billing_due_day) < 1 || Number(formData.billing_due_day) > 31) {
      newErrors.billing_due_day = "Dia de vencimento deve ser entre 1 e 31"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidCNPJ = (cnpj: string) => {
    // Validação básica de CNPJ (formato)
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
    return cnpjRegex.test(cnpj)
  }

  const formatCNPJ = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "")

    // Aplica a máscara
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
    }

    return value
  }



  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert("Erro", "Por favor, corrija os erros no formulário.")
      return
    }

    const empresaData = {
      name: formData.name.trim(),
      trade_name: formData.trade_name.trim() || null,
      cnpj: formData.cnpj.trim(),
      activity: formData.activity.trim() || null,
      email: formData.email.trim(),
      accounting_fee: Number(formData.accounting_fee),
      billing_due_day: Number(formData.billing_due_day),
    }

    console.log('📤 Dados sendo enviados para a API:', JSON.stringify(empresaData, null, 2))
    onSave(empresaData)
  }

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value

    if (field === "cnpj") {
      formattedValue = formatCNPJ(value)
    }

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }))

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>

          <Text style={styles.title}>{empresa ? "Editar Empresa" : "Nova Empresa"}</Text>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Nome da Empresa */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nome da Empresa <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="Digite o nome da empresa"
              placeholderTextColor="#9CA3AF"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* CNPJ */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              CNPJ <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.cnpj && styles.inputError]}
              value={formData.cnpj}
              onChangeText={(value) => handleInputChange("cnpj", value)}
              placeholder="00.000.000/0000-00"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={18}
            />
            {errors.cnpj && <Text style={styles.errorText}>{errors.cnpj}</Text>}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              placeholder="empresa@exemplo.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Nome Fantasia */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Fantasia</Text>
            <TextInput
              style={styles.input}
              value={formData.trade_name}
              onChangeText={(value) => handleInputChange("trade_name", value)}
              placeholder="Nome fantasia da empresa"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Atividade */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Atividade</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.activity}
              onChangeText={(value) => handleInputChange("activity", value)}
              placeholder="Atividade principal da empresa"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Honorário Mensal */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Honorário Mensal <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.currencyInputContainer}>
              <Text style={styles.currencySymbol}>R$</Text>
              <TextInput
                style={[styles.currencyInput, errors.accounting_fee && styles.inputError]}
                value={formData.accounting_fee}
                onChangeText={(value) => handleInputChange("accounting_fee", value)}
                placeholder="0,00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
            {errors.accounting_fee && <Text style={styles.errorText}>{errors.accounting_fee}</Text>}
          </View>

          {/* Dia de Vencimento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Dia de Vencimento <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.billing_due_day && styles.inputError]}
              value={formData.billing_due_day}
              onChangeText={(value) => handleInputChange("billing_due_day", value)}
              placeholder="10"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={2}
            />
            {errors.billing_due_day && <Text style={styles.errorText}>{errors.billing_due_day}</Text>}
          </View>


        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  saveButton: {
    backgroundColor: "#059669",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#DC2626",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "white",
    color: "#111827",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  currencyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "white",
  },
  currencySymbol: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  currencyInput: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
    color: "#111827",
  },
  statusContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statusOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "white",
    gap: 8,
  },
  activeStatus: {
    borderColor: "#059669",
    backgroundColor: "#F0FDF4",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeStatusText: {
    color: "#059669",
  },
  inactiveStatusText: {
    color: "#DC2626",
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 4,
  },
})
