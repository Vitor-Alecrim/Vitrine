import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";

import Pants from '../../component/Pants';

export default function Home({ navigation }) {

  const [pants, setPants] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pants"), (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPants(lista);
    });

    return () => unsubscribe();
  }, []);

  function formatPrice(value) {
    if (!value) return "R$ 0,00";
    return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
  }

  const toggleItem = (item) => {
    const exists = selectedItems.find(i => i.id === item.id);

    if (exists) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const gerarMensagem = () => {
    if (selectedItems.length === 0) {
      return "Olá! Ainda não selecionei calças.";
    }

    const lista = selectedItems
      .map(item => `- ${item.name} (R$ ${Number(item.price).toFixed(2)})`)
      .join("\n");

    const total = selectedItems.reduce((soma, item) => soma + Number(item.price), 0);

    return `Olá! Gostaria de fazer um pedido de calças:\n\n${lista}\n\nTotal: R$ ${total.toFixed(2)}`;
  };

  const enviarWhatsApp = () => {
    const numero = "5562994406167";
    const mensagem = encodeURIComponent(gerarMensagem());

    const url = `https://wa.me/${numero}?text=${mensagem}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/banner.png')}
          style={styles.image}
        />

        <View style={styles.textContainer}>
          <View style={styles.row}>
            <Text style={styles.text}>CALÇAS</Text>
            <Text style={[styles.text, styles.gray]}>•</Text>
            <Text style={[styles.text, styles.gray]}>MASCULINO</Text>
          </View>

          <View style={styles.row}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('AddPants')}
              style={styles.icon}
            >
              <MaterialIcons name="add" size={28} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity>
              <MaterialIcons name="filter-list" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.line} />

      {/* LISTA */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={styles.sectionTitle}>LANÇAMENTOS</Text>

        {pants.length === 0 ? (
          <Text style={styles.empty}>
            Nenhuma calça cadastrada 😢
          </Text>
        ) : (
          <View style={styles.list}>
            {pants.map(item => (
              <Pants
                key={item.id}
                image={require('../../assets/1.png')}
                price={formatPrice(item.price)}
                name={item.name}
                onClick={() => navigation.navigate('Detail', { item })}

                isSelected={selectedItems.some(i => i.id === item.id)}
                onSelect={() => toggleItem(item)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* FOOTER */}
      <TouchableOpacity
        onPress={enviarWhatsApp}
        style={styles.footerButton}
      >
        <Text style={styles.footerText}>
          Enviar lista no WhatsApp ({selectedItems.length})
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#FFF'
  },

  header:{
    marginBottom: 8
  },

  image:{
    width: '100%',
    height: 180,
    resizeMode: 'cover'
  },

  textContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: '5%',
    marginHorizontal: '5%'
  },

  row:{
    flexDirection: 'row',
    alignItems: 'center'
  },

  text:{
    fontFamily: 'Anton_400Regular',
    fontSize: 26,
    marginHorizontal: '1%'
  },

  gray:{
    color: '#CECECF'
  },

  icon:{
    marginRight: 15
  },

  sectionTitle:{
    fontFamily: 'Anton_400Regular',
    fontSize: 24,
    marginHorizontal: '5%',
    marginVertical: 10
  },

  list:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },

  scroll:{
    paddingBottom: 80
  },

  empty:{
    textAlign: 'center',
    marginTop: 20,
    color: '#888'
  },

  line:{
    borderBottomColor: '#D8d8d8',
    borderBottomWidth: 2,
  },

  footerButton:{
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'green',
    padding: 15,
    alignItems: 'center'
  },

  footerText:{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});