import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";

export default function AddPants({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  async function handleAdd() {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      await addDoc(collection(db, "pants"), {
        name: name.trim(),
        price: Number(price),
        createdAt: new Date()
      });

      Alert.alert('Sucesso', 'Calça adicionada!');
      navigation.goBack();

    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar no banco');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Calça</Text>

      <TextInput
        placeholder="Nome da calça"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Preço"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
  title: { 
    fontSize: 22, 
    marginBottom: 20,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderColor: '#ccc'
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});