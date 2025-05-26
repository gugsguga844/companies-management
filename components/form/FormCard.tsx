import { View, StyleSheet, Text } from 'react-native'
import React, { useState } from 'react'
import FormInput from './form-components/FormInput'
import FormButton from './form-components/FormButton'
import { router } from 'expo-router'

export default function FormCard() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // const handleLogin = () => {
  //   console.log(email, password)
  // }

  const handleLoginTemp = () => {
    router.push('/(auth)/(home)/home')
  }
return (
    <View style={styles.container}>
      <FormInput 
        value={email}
        onChangeText={setEmail}
        placeholder="E-mail" 
        keyboardType="email-address" 
        iconName="email" />
      <FormInput 
        value={password}
        onChangeText={setPassword}
        placeholder="Senha" 
        secureTextEntry 
        iconName="lock" />
      <Text style={styles.text}>Esqueceu a senha?</Text>
      <FormButton text="Entrar" onPress={handleLoginTemp} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      padding: 25,
      width: '90%',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: '#000',
      fontSize: 16,
      fontWeight: '600',
      marginTop: 10
    }
  })
