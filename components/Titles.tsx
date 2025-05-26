import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Definindo os nomes válidos dos ícones do FontAwesome
const FontAwesomeIcons = {
  dashboard: 'dashboard',
  home: 'home',
  building: 'building',
  dollar: 'dollar',
  fileText: 'file-text'
} as const;

type IconName = keyof typeof FontAwesomeIcons;

type IconProps = {
  type: 'FontAwesome';
  name: IconName;
  size?: number;
  color?: string;
};

type TitlesProps = {
    title: string;
    subtitle: string;
    icon?: IconProps;
}

export default function Titles({ title, subtitle, icon }: TitlesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {icon && (
          <FontAwesome 
            name={FontAwesomeIcons[icon.name]} 
            size={icon.size || 24} 
            color={icon.color || '#000'} 
          />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    }
})