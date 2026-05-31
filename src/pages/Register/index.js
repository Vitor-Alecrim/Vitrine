import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

import {
  doc,
  setDoc
} from 'firebase/firestore';

import {
  db
} from '../../services/firebaseConfig';

import Input from '../../component/Input';
import Button2 from '../../component/Button2';

import {
  createUserWithEmailAndPassword
} from 'firebase/auth';

import { auth } from '../../services/firebaseConfig';



export default function Register({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

async function handleRegister() {

  if (!email || !password) {

    alert('Preencha todos os campos.');
    return;

  }

  try {

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {

      email: email,
      role: "user",
      createdAt: new Date()

    });

    alert('Usuário criado com sucesso!');

    navigation.navigate('Login');

  } catch(error) {

    console.log(error);

    if(error.code === 'auth/invalid-email') {

      alert('E-mail inválido.');

    } else if(error.code === 'auth/weak-password') {

      alert('A senha deve possuir pelo menos 6 caracteres.');

    } else if(error.code === 'auth/email-already-in-use') {

      alert('Este e-mail já está em uso.');

    } else {

      alert('Não foi possível criar a conta.');

    }

  }

}

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Crie sua{'\n'}
        conta
      </Text>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <Input
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.loginContainer}>

        <Text style={styles.loginText}>
          Já possui conta?
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
        >

          <Text style={styles.loginHighlight}>
            Entrar
          </Text>

        </TouchableOpacity>

      </View>

      <Button2
        title="Criar conta"
        onPress={handleRegister}
      />

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

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32
  },

  loginText: {
    color: '#8A8A8A',
    fontSize: 14,
    lineHeight: 20
  },

  loginHighlight: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 4
  }

});