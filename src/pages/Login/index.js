import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import {
  signInWithEmailAndPassword
} from 'firebase/auth';

import {
  doc,
  getDoc
} from 'firebase/firestore';

import {
  auth,
  db
} from '../../services/firebaseConfig';


export default function Login({ navigation }) {

      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');



async function handleLogin() {

  if (!email || !password) {

    alert('Preencha todos os campos.');
    return;

  }

  try {

    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      function handleWishlist(item){

      Alert.alert(
        "Lista de desejos",
        `${item.name} adicionado à lista ❤️`
      );

    }

    const uid = userCredential.user.uid;

    const userDoc =
      await getDoc(doc(db, "users", uid));

    const userData = userDoc.data();

    console.log(userData);

    if(userData.role === 'admin') {

      alert('Login ADM realizado!');

      navigation.navigate('Home');

    } else {

      alert('Login de usuário realizado!');

      navigation.navigate('Home');

    }

  } catch(error) {

    console.log(error);

    alert('Email ou senha inválidos.');

  }

}


  return (
    

    <View style={styles.container}>

      <Text style={styles.title}>
        Faça login ou{'\n'}
        crie uma conta
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#777"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#777"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />


  <TouchableOpacity
    onPress={() => navigation.navigate('ForgotPassword')}
  >

    <Text style={styles.forgot}>
      Esqueceu sua senha?
    </Text>

  </TouchableOpacity>

      <View>

      <View style={styles.registerContainer}>

        <Text style={styles.register}>
            Não tem conta?
        </Text>

        <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
        >

            <Text style={styles.registerHighlight}>
            Crie uma!
            </Text>

        </TouchableOpacity>

        </View>

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >

        <Text style={styles.buttonText}>
          Continuar
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    lineHeight: 40
  },

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
  },

  forgot: {
    color: '#9A9A9A',
    alignSelf: 'flex-start',
    marginBottom: 24
  },

  register: {
    color: '#8A8A8A',
    fontSize: 14,
    lineHeight: 20
  },

  registerHighlight: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 4
  },

  button: {
    width: '100%',
    height: 58,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3
  },

  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  },

  registerContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 32,
}

});