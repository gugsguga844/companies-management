import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

type SearchBarProps = {
    placeholder: string;
}

export default function SearchBar({ placeholder }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput 
        placeholder={placeholder}
        
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    }
})
