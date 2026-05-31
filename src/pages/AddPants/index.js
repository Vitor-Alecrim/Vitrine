import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image
} from 'react-native';

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { BASE_URL } from '../../services/api';
import * as ImagePicker from 'expo-image-picker';

export default function AddPants({ navigation }) {

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [colors, setColors] = useState('');
  const [sizes, setSizes] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  // 📸 Selecionar múltiplas imagens
  async function pickImage() {

    try {

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {

        Alert.alert(
          'Permissão necessária',
          'Libere acesso à galeria'
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({

          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          allowsEditing: false,
          quality: 0.7,
          selectionLimit: 10
        });

      console.log("Resultado:", result);

      if (!result.canceled && result.assets?.length > 0) {

        const selectedUris =
          result.assets.map(asset => asset.uri);

        setImages(prev => [...prev, ...selectedUris]);
      }

    } catch (error) {

      console.log("Erro picker:", error);
    }
  }

  async function uploadImage(uri) {

    try {

      const data = new FormData();

      data.append('image', {
        uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await fetch(
        `${BASE_URL}/upload`,
        {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const result = await response.json();

      console.log("Upload concluído:", result);

      return result.filename;

    } catch (error) {

      console.log("Erro upload local:", error);
      throw error;
    }
  }

  async function handleAdd() {

    if (!name.trim() || !price.trim()) {

      Alert.alert('Erro', 'Preencha nome e preço!');
      return;
    }

    try {

      let uploadedImages = [];

      if (images.length > 0) {

        uploadedImages = await Promise.all(
          images.map(uri => uploadImage(uri))
        );
      }

      await addDoc(collection(db, "pants"), {

        name: name.trim(),

        price: Number(
          price.replace(',', '.')
        ),

        colors: colors
          ? colors.split(',').map(c => c.trim())
          : [],

        sizes: sizes
          ? sizes.split(',').map(s => s.trim())
          : [],

        description: description.trim(),

        images: uploadedImages,

        createdAt: new Date()
      });

      Alert.alert('Sucesso', 'Calça adicionada!');

      navigation.goBack();

    } catch (error) {

      console.log("Erro geral:", error);

      Alert.alert(
        'Erro',
        'Falha ao salvar'
      );
    }
  }

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Adicionar Calça
      </Text>

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

      <TextInput
        placeholder="Cores (ex: preto, azul)"
        style={styles.input}
        value={colors}
        onChangeText={setColors}
      />

      <TextInput
        placeholder="Tamanhos (P, M, G)"
        style={styles.input}
        value={sizes}
        onChangeText={setSizes}
      />

      <TextInput
        placeholder="Descrição"
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity
        style={styles.button}
        onPress={pickImage}
      >
        <Text style={styles.buttonText}>
          Selecionar Imagens ({images.length})
        </Text>
      </TouchableOpacity>

      {/* Preview imagens */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.previewContainer}
      >

        {images.map((img, index) => (

          <Image
            key={index}
            source={{ uri: img }}
            style={styles.previewImage}
          />
        ))}

      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={handleAdd}
      >
        <Text style={styles.buttonText}>
          Adicionar
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
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
    borderRadius: 8,
    marginBottom: 10
  },

  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  previewContainer: {
    marginBottom: 15
  },

  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10
  }
});