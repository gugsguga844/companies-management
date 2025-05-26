import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import Titles from '../../../components/Titles'
import { companies_list } from '../../../mocks/companies'
import CompanyCard from '../../../components/CompanyCard'

export default function companies() {
  return (
    <View style={styles.container}>
      <Titles icon={{ type: 'FontAwesome', name: 'dashboard', size: 24 }} title="Dashboard" subtitle="Visão geral do seu escritório" />
      {companies_list.map(company => (
        <CompanyCard 
            key={company.id}
            name={company.name}
            cnpj={company.cnpj}
            business_activity={company.business_activity}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
})