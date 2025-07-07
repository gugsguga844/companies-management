import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Dimensions } from 'react-native';
import { Appbar, Card, Button, Divider, ProgressBar, DataTable, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const initialLayout = { width: Dimensions.get('window').width };

const PendentesRoute = () => (
  <Card style={styles.tableCard}>
    <Card.Content>
      <View style={styles.tableHeaderRow}>
        <Text style={styles.tableTitle}>Honorários Pendentes</Text>
        <Button icon="filter-variant" mode="outlined" compact style={styles.filterBtn}>Filtrar</Button>
        <Button icon="plus" mode="contained" compact style={styles.registerBtn}>Registrar</Button>
      </View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Empresa</DataTable.Title>
          <DataTable.Title>Valor</DataTable.Title>
          <DataTable.Title>Vencimento</DataTable.Title>
          <DataTable.Title>Status</DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          <DataTable.Cell>Tech Solutions Ltda</DataTable.Cell>
          <DataTable.Cell>R$ 1.500</DataTable.Cell>
          <DataTable.Cell>15/05/2023</DataTable.Cell>
          <DataTable.Cell><Text style={styles.statusAtrasado}>Atrasado</Text></DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Comércio Geral S.A.</DataTable.Cell>
          <DataTable.Cell>R$ 1.200</DataTable.Cell>
          <DataTable.Cell>20/05/2023</DataTable.Cell>
          <DataTable.Cell><Text style={styles.statusPendente}>Pendente</Text></DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Consultoria Financeira ME</DataTable.Cell>
          <DataTable.Cell>R$ 2.000</DataTable.Cell>
          <DataTable.Cell>25/05/2023</DataTable.Cell>
          <DataTable.Cell><Text style={styles.statusPendente}>Pendente</Text></DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </Card.Content>
  </Card>
);

const PagosRoute = () => (
  <Card style={styles.tableCard}>
    <Card.Content>
      <View style={styles.tableHeaderRow}>
        <Text style={styles.tableTitle}>Honorários Pagos</Text>
        <Button icon="download" mode="outlined" compact style={styles.exportBtn}>Exportar</Button>
      </View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Empresa</DataTable.Title>
          <DataTable.Title>Valor</DataTable.Title>
          <DataTable.Title>Data Pagamento</DataTable.Title>
          <DataTable.Title>Status</DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          <DataTable.Cell>Indústria Nacional Ltda</DataTable.Cell>
          <DataTable.Cell>R$ 3.000</DataTable.Cell>
          <DataTable.Cell>05/05/2023</DataTable.Cell>
          <DataTable.Cell><Text style={styles.statusPago}>Pago</Text></DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Serviços Digitais ME</DataTable.Cell>
          <DataTable.Cell>R$ 1.800</DataTable.Cell>
          <DataTable.Cell>10/05/2023</DataTable.Cell>
          <DataTable.Cell><Text style={styles.statusPago}>Pago</Text></DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </Card.Content>
  </Card>
);

export default function FeesScreen() {
  const [month, setMonth] = useState('Maio de 2023');
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'pendentes', title: 'Pendentes' },
    { key: 'pagos', title: 'Pagos' },
  ]);

  const renderScene = SceneMap({
    pendentes: PendentesRoute,
    pagos: PagosRoute,
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Cabeçalho */}
      <Appbar.Header style={{ backgroundColor: '#fff', elevation: 0 }}>
        <Icon name="credit-card-outline" size={28} color="#16A34A" style={{ marginLeft: 8, marginRight: 8 }} />
        <Appbar.Content title={<Text style={styles.headerTitle}>ContabSys</Text>} />
        <Appbar.Action icon="menu" onPress={() => {}} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {/* Título e botão */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Icon name="currency-usd" size={28} color="#16A34A" style={{ marginRight: 4 }} />
          <Text style={styles.pageTitle}>Honorários</Text>
        </View>
        <Text style={styles.pageSubtitle}>Gerencie os pagamentos de honorários das empresas</Text>
        <Button mode="contained" style={styles.registerButton} icon="plus" onPress={() => {}}>
          Registrar Pagamentos
        </Button>
        {/* Cards de resumo */}
        <View style={styles.summaryCardsRow}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text style={styles.cardLabel}>Total Recebido (Mês)</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text style={styles.cardCurrency}>R$</Text>
                <Text style={styles.cardValue}>4.800</Text>
              </View>
              <Text style={styles.cardSubLabel}>2 pagamentos</Text>
            </Card.Content>
          </Card>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text style={styles.cardLabel}>Pendente</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Icon name="calendar" size={18} color="#f59e42" style={{ marginRight: 2 }} />
                <Text style={[styles.cardCurrency, { color: '#f59e42' }]}>R$</Text>
                <Text style={[styles.cardValue, { color: '#f59e42' }]}>3.200</Text>
              </View>
              <Text style={[styles.cardSubLabel, { color: '#f59e42' }]}>2 pagamentos pendentes</Text>
            </Card.Content>
          </Card>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text style={styles.cardLabel}>Atrasado</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Icon name="arrow-top-right" size={18} color="#ef4444" style={{ marginRight: 2 }} />
                <Text style={[styles.cardCurrency, { color: '#ef4444' }]}>R$</Text>
                <Text style={[styles.cardValue, { color: '#ef4444' }]}>1.500</Text>
              </View>
              <Text style={[styles.cardSubLabel, { color: '#ef4444' }]}>1 pagamento atrasado</Text>
            </Card.Content>
          </Card>
        </View>
        {/* Card Honorários Mensais */}
        <Card style={styles.monthlyCard}>
          <Card.Content>
            <Text style={styles.monthlyTitle}>Honorários Mensais</Text>
            <Text style={styles.monthlySubtitle}>Visão geral dos honorários por mês</Text>
            <View style={styles.monthNavRow}>
              <IconButton icon="chevron-left" size={24} onPress={() => {}} />
              <Text style={styles.monthText}>{month}</Text>
              <IconButton icon="chevron-right" size={24} onPress={() => {}} />
            </View>
            <View style={styles.monthlyValuesRow}>
              <View style={styles.monthlyValueBox}>
                <Text style={styles.monthlyValueLabel}>Total</Text>
                <Text style={styles.monthlyValue}>R$ 9.500</Text>
              </View>
              <View style={[styles.monthlyValueBox, { backgroundColor: '#e6f9f0' }]}> 
                <Text style={[styles.monthlyValueLabel, { color: '#16A34A' }]}>Recebido</Text>
                <Text style={[styles.monthlyValue, { color: '#16A34A' }]}>R$ 4.800</Text>
              </View>
              <View style={[styles.monthlyValueBox, { backgroundColor: '#fffbe6' }]}> 
                <Text style={[styles.monthlyValueLabel, { color: '#f59e42' }]}>Pendente</Text>
                <Text style={[styles.monthlyValue, { color: '#f59e42' }]}>R$ 3.200</Text>
              </View>
              <View style={[styles.monthlyValueBox, { backgroundColor: '#fff0f0' }]}> 
                <Text style={[styles.monthlyValueLabel, { color: '#ef4444' }]}>Atrasado</Text>
                <Text style={[styles.monthlyValue, { color: '#ef4444' }]}>R$ 1.500</Text>
              </View>
            </View>
            <View style={styles.progressRow}>
              <Text style={styles.percentLabel}>Percentual Recebido</Text>
              <Text style={styles.percentValue}>50.5%</Text>
            </View>
            <ProgressBar progress={0.505} color="#16A34A" style={styles.progressBar} />
          </Card.Content>
        </Card>
        {/* Abas Pendentes/Pagos */}
        <View style={{ marginTop: 16, flex: 1 }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={props => (
              // @ts-ignore
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: '#16A34A', height: 3, borderRadius: 2 }}
                style={{ backgroundColor: '#f4f4f5', borderRadius: 8, marginBottom: 8 }}
                activeColor="#16A34A"
                inactiveColor="#6b7280"
                renderLabel={({ route, focused }: { route: { title: string }, focused: boolean }) => (
                  <Text style={{
                    color: focused ? '#16A34A' : '#6b7280',
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}>
                    {route.title}
                  </Text>
                )}
              />
            )}
          />
        </View>
      </ScrollView>
      {/* Barra de navegação inferior */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Icon name="home-outline" size={24} color="#6b7280" />
          <Text style={styles.navLabel}>Início</Text>
        </View>
        <View style={styles.navItem}>
          <Icon name="file-chart-outline" size={24} color="#6b7280" />
          <Text style={styles.navLabel}>Relatórios</Text>
        </View>
        <View style={[styles.navItem, styles.navItemActive]}>
          <Icon name="office-building-outline" size={24} color="#6b7280" />
          <Text style={styles.navLabel}>Empresas</Text>
        </View>
        <View style={[styles.navItem, styles.navItemActive]}> 
          <Icon name="currency-usd" size={24} color="#16A34A" />
          <Text style={[styles.navLabel, { color: '#16A34A' }]}>Honorários</Text>
        </View>
        <View style={styles.navItem}>
          <Icon name="cog-outline" size={24} color="#6b7280" />
          <Text style={styles.navLabel}>Ajustes</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontWeight: 'bold', fontSize: 20, color: '#16A34A' },
  pageTitle: { fontWeight: 'bold', fontSize: 24, color: '#16A34A' },
  pageSubtitle: { color: '#6b7280', marginBottom: 12 },
  registerButton: { alignSelf: 'flex-end', marginBottom: 16, backgroundColor: '#16A34A' },
  summaryCardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  summaryCard: { flex: 1, marginHorizontal: 4, padding: 0 },
  cardLabel: { color: '#6b7280', fontSize: 14 },
  cardCurrency: { color: '#16A34A', fontWeight: 'bold', fontSize: 18, marginRight: 2 },
  cardValue: { fontWeight: 'bold', fontSize: 28 },
  cardSubLabel: { color: '#16A34A', fontSize: 12 },
  monthlyCard: { marginBottom: 16, marginTop: 8 },
  monthlyTitle: { fontWeight: 'bold', fontSize: 18 },
  monthlySubtitle: { color: '#6b7280', marginBottom: 8 },
  monthNavRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  monthText: { fontWeight: 'bold', fontSize: 16, marginHorizontal: 16 },
  monthlyValuesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  monthlyValueBox: { flex: 1, alignItems: 'center', padding: 4, borderRadius: 8, marginHorizontal: 2 },
  monthlyValueLabel: { color: '#6b7280', fontSize: 13 },
  monthlyValue: { fontWeight: 'bold', fontSize: 16 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  percentLabel: { color: '#6b7280', fontSize: 13 },
  percentValue: { fontWeight: 'bold', fontSize: 13 },
  progressBar: { height: 8, borderRadius: 8, backgroundColor: '#e5e7eb' },
  tableCard: { marginTop: 12 },
  tableHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  tableTitle: { fontWeight: 'bold', fontSize: 16, flex: 1 },
  filterBtn: { marginRight: 8, borderColor: '#16A34A', color: '#16A34A' },
  registerBtn: { backgroundColor: '#16A34A' },
  exportBtn: { borderColor: '#16A34A', color: '#16A34A' },
  statusAtrasado: { color: '#ef4444', fontWeight: 'bold' },
  statusPendente: { color: '#f59e42', fontWeight: 'bold' },
  statusPago: { color: '#16A34A', fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 64, borderTopWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff', position: 'absolute', left: 0, right: 0, bottom: 0 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navItemActive: {},
  navLabel: { fontSize: 12, color: '#6b7280', marginTop: 2 },
});
