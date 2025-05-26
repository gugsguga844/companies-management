import { View, StyleSheet, Text, ScrollView } from 'react-native'
import React from 'react'
import Titles from '../../../components/Titles'
import { companies_list } from '../../../mocks/companies'
import CompanyCard from '../../../components/CompanyCard'

export default function companies() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Titles 
        icon={{ type: 'FontAwesome', name: 'building', size: 24 }} 
        title="Empresas" 
        subtitle="Gerencie as empresas do seu escritório" 
      />
      {companies_list.map(company => (
        <CompanyCard 
          key={company.id}
          name={company.name}
          cnpj={company.cnpj}
          business_activity={company.business_activity}
          payment={company.payment}
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }
})