import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import useCounter from './states/useCounter';

export default function App() {
  const { count, increment, reset } = useCounter();

  return (
    <View style={styles.container}>
      <Text>{count}</Text> 
      
      <Button onPress={increment} title="Increment" />
      <Button onPress={reset} title="Reset" />
      <StatusBar style="auto" />
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
