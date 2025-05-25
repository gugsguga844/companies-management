import React from "react";
import { ScrollView, View, Text, TextInput, Button, StatusBar, StyleSheet, Image } from "react-native";
import useCounter from '../states/useCounter';
import FormCard from '../components/form/FormCard';

export default function Home() {

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../assets/logo-bg.png')} />
      </View>
      <FormCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '80%'
  },
  logo: {
    width: '100%',
    height: 100
  }
});
