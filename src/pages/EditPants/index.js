import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView
} from 'react-native';

import {
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../../services/firebaseConfig";
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL } from '../../services/api';

export default function EditPants({ navigation, route }) {

  const { item } = route.params;

  const [name, setName] = useState(item.name || '');

  const [price, setPrice] = useState(
    item.price ? String(item.price) : ''
  );

  const [colors, setColors] = useState(
        Array.isArray(item.colors)
      ? item.colors.join(', ')
      : ''
  );

  const [sizes, setSizes] = useState(
  Array.isArray(item.sizes)
    ? item.sizes.join(', ')
    : ''
  );

  const [description, setDescription] = useState(
    item.description || ''
  );

  const [images, setImages] = useState(
    item.images || []
  );

  // 📸 Selecionar imagens
  async function pickImage() {

    try {

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permissão necessária', 'Libere acesso à galeria');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
        selectionLimit: 10
      });

      if (!result.canceled && result.assets?.length > 0) {

        const novasImagens =
          result.assets.map(asset => asset.uri);

        setImages(prev => [...prev, ...novasImagens]);
      }

    } catch (error) {

      console.log('Erro picker:', error);
    }
  }

    function removeImage(index){

      setImages(prev =>
        prev.filter((_, i) => i !== index)
      );

    }

 async function uploadImage(uri) {

  // já é imagem salva no banco
  if (!uri.startsWith('file')) {
    return uri;
  }

  try {

    const data = new FormData();

    data.append('image', {
      uri,
      type: 'image/jpeg',
      name: `photo_${Date.now()}.jpg`,
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

    console.log('Upload concluído:', result);

    return result.filename;

  } catch (error) {

    console.log('Erro upload:', error);
    throw error;
  }
}

  async function handleUpdate() {

    if (!name.trim() || !price.trim()) {
      Alert.alert('Erro', 'Preencha nome e preço!');
      return;
    }

    try {

      const uploadedImages = await Promise.all(
        images.map(img => uploadImage(img))
      );

      const productRef = doc(db, 'pants', item.id);

      await updateDoc(productRef, {
        name: name.trim(),
        price: Number(price.replace(',', '.')),
        colors: colors
          ? colors.split(',').map(c => c.trim())
          : [],
        sizes: sizes
          ? sizes.split(',').map(s => s.trim())
          : [],
        description: description.trim(),
        images: uploadedImages,
        updatedAt: new Date()
      });

      Alert.alert(
        'Sucesso',
        'Produto atualizado com sucesso!'
      );

      navigation.goBack();

    } catch (error) {

      console.log('Erro update:', error);

      Alert.alert(
        'Erro',
        'Não foi possível atualizar o produto.'
      );
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Editar Calça
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
        placeholder="Cores (ex: preto, azul, bege)"
        style={styles.input}
        value={colors}
        onChangeText={setColors}
      />

      <TextInput
        placeholder="Tamanhos (ex: P, M, G, GG)"
        style={styles.input}
        value={sizes}
        onChangeText={setSizes}
      />

      <TextInput
        placeholder="Descrição"
        style={[styles.input, { height: 80 }]}
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

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.imageList}
    >

      {images.map((img, index) => (

        <View
          key={index}
          style={styles.imageContainer}
        >

          <Image
            source={{
              uri:
                String(img).startsWith('file')
                  ? img
                  : `${BASE_URL}/uploads/${img}`
            }}
            style={styles.previewImage}
          />

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeImage(index)}
          >
            <Text style={styles.removeButtonText}>
              X
            </Text>
          </TouchableOpacity>

        </View>

      ))}

    </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdate}
      >
        <Text style={styles.buttonText}>
          Salvar Alterações
        </Text>
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
    borderRadius: 8,
    marginBottom: 10
  },

  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold'
  },


  imageList:{
  marginBottom:15
},

imageContainer:{
  marginRight:10,
  position:'relative'
},

previewImage:{
  width:100,
  height:100,
  borderRadius:10
},

removeButton:{
  position:'absolute',
  top:-5,
  right:-5,
  backgroundColor:'#ff4444',
  width:24,
  height:24,
  borderRadius:12,
  justifyContent:'center',
  alignItems:'center'
},

removeButtonText:{
  color:'#FFF',
  fontWeight:'bold'
}

});
