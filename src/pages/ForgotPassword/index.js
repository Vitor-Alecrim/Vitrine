import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import {
  sendPasswordResetEmail
} from 'firebase/auth';

import { auth } from '../../services/firebaseConfig';

export default function ForgotPassword({ navigation }) {

  const [email, setEmail] = useState('');

  async function handleRecoverPassword() {

    if (!email) {
      alert('Digite seu email.');
      return;
    }

    try {

      await sendPasswordResetEmail(auth, email);

      alert(
        'Enviamos um link de recuperação para seu email.'
      );

      navigation.goBack();

    } catch(error) {

      console.log(error);

      alert('Erro ao enviar email de recuperação.');

    }

  }

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Recuperar senha
      </Text>

      <Text style={styles.description}>
        Digite seu email para receber o link de recuperação.
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#777"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRecoverPassword}
      >

        <Text style={styles.buttonText}>
          Enviar link
        </Text>

      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: 24,
    justifyContent: 'center'
  },

  title: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 12
  },

  description: {
    color: '#AAA',
    fontSize: 14,
    marginBottom: 30,
    lineHeight: 22
  },

  input: {
    height: 58,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingHorizontal: 18,
    color: '#FFF',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    fontSize: 15
  },

  button: {
    width: '100%',
    height: 58,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  }

});