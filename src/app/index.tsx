import React from "react";
import { ScrollView, View, Text, TextInput, Button, StatusBar, StyleSheet } from "react-native";
import useCounter from '../states/useCounter';

export default function Home() {
  const { count, increment, reset } = useCounter();

  return (
    <View style={styles.container}>
      <Text>{count}</Text>

      <Button onPress={increment} title="Increment" />
      <Button onPress={reset} title="Reset" />
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
});
