import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import Titles from '../../../components/Titles'
import { companies_list } from '../../../mocks/companies'
import HomeCard from '../../../components/HomeCard'

export default function home() {
  return (
    <View style={styles.container}>
      <Titles icon={{ type: 'FontAwesome', name: 'dashboard', size: 24 }} title="Dashboard" subtitle="Visão geral do seu escritório" />
      <HomeCard title="Total de Empresas" iconName="building" children={companies_list.length.toString()} />

      <HomeCard title="Receita Mensal" iconName="dollar" children={`R$ ${companies_list.length.toString()}`} />

      <HomeCard title="Honorários Pendentes" iconName="hourglass-start" children={`R$ ${companies_list.length.toString()}`} />

      <HomeCard title="Taxa de Recebimento" iconName="percent" children={`${companies_list.length.toString()}%`} />
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