import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import React from 'react'

type FormButtonProps = {
    text: string;
    onPress?: () => void;
}

export default function FormButton({ text, onPress }: FormButtonProps) {
  return (
    <View style={styles.container}>
        <TouchableHighlight style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 10,
    },
    button: {
        width: '100%',
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    }
})