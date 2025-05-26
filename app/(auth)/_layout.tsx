import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
        <Tabs.Screen 
            name="(home)" 
            options={{
                title: 'Home',
                tabBarIcon: ({ color }) => (
                    <FontAwesome name="home" size={28} color={color} />
                )
            }} />
        <Tabs.Screen 
            name="reports" 
            options={{
                title: 'Relatórios',
                tabBarIcon: ({ color }) => (
                    <FontAwesome name="file-text" size={20} color={color} />
                )
            }} />
        <Tabs.Screen 
            name="(companies)" 
            options={{
                title: 'Empresas',
                tabBarIcon: ({ color }) => (
                    <FontAwesome name="building" size={20} color={color} />
                )
            }} />
        <Tabs.Screen 
            name="(fees)" 
            options={{
                title: 'Honorários',
                tabBarIcon: ({ color }) => (
                    <FontAwesome name="dollar" size={20} color={color} />
                )
            }} />
        <Tabs.Screen 
            name="(settings)" 
            options={{
                title: 'Configurações',
                tabBarIcon: ({ color }) => (
                    <FontAwesome name="cog" size={20} color={color} />
                )
            }} />
    </Tabs>
)
}