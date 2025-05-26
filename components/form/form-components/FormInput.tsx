import { View, Text, TextInput, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons, Feather } from '@expo/vector-icons'

type FormInputProps = {
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'url';
  iconName: keyof typeof MaterialIcons.glyphMap;
} & TextInputProps;

export default function FormInput({
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  iconName,
  ...rest
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = secureTextEntry
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{placeholder}</Text>
      <View style={styles.inputWrapper}>
        <MaterialIcons name={iconName} size={18} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize="none"
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={18}
              color="#888"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#e3e3e3',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15
  },
  icon: {
    marginRight: 10
  },
  input: {
    flex: 1,
    paddingVertical: 12
  },
  eyeIcon: {
    marginLeft: 10
  }
})
