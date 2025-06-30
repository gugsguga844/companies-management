import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import Titles from '../../../components/Titles'
import CompanyCard from '../../../components/CompanyCard'
import useCompanyStore from '../../../hooks/useCompanyStore'

export default function companies() {
  const { companiesList, isLoading, fetchCompanies } = useCompanyStore();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />;
    }

    if (companiesList.length === 0) {
      return <Text style={{ marginTop: 50 }}>Nenhuma empresa encontrada.</Text>;
    }

    return companiesList.map(company => (
      <CompanyCard key={company.id} name={company.name} cnpj={company.cnpj} business_activity={company.activity} payment={company.accounting_fee} />
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Titles 
        icon={{ type: 'FontAwesome', name: 'building', size: 24 }} 
        title="Empresas" 
        subtitle="Gerencie as empresas do seu escritório" 
      />
      <View style={styles.listContainer}>
        {renderContent()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  listContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center', // Centraliza o spinner ou a mensagem de 'nenhuma empresa'
  }
});