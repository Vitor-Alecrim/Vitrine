import React from 'react';

import {
  TextInput,
  StyleSheet
} from 'react-native';

export default function Input({
  placeholder,
  secureTextEntry,
  value,
  onChangeText
}) {

  return (

    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#777"
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      style={styles.input}
    />

  );
}

const styles = StyleSheet.create({

  input: {
    height: 58,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingHorizontal: 18,
    color: '#FFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    fontSize: 15
  }

});