import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions
} from 'react-native';

import * as API from '../../services/api';
import Footer from '../../component/Footer';

console.log(API);

const { width } = Dimensions.get('window');

export default function Detail({ navigation, route }) {

  const { item } = route.params;

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);



  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text>{item.name}</Text>
      )
    });
  }, []);

  function formatPrice(value) {

    if (!value) return "R$ 0,00";

    return `R$ ${Number(value)
      .toFixed(2)
      .replace('.', ',')}`;
  }

  function toggleSelection(value, list, setList) {

    if (list.includes(value)) {

      setList(
        list.filter(item => item !== value)
      );

    } else {

      setList([...list, value]);
    }
  }

  function handleBuy() {

    const phone = "Telefone_Whatapp"; // Numero Whatsapp do Vendedor

    const message = `
Olá! Tenho interesse neste produto:

Produto: ${item.name}
Preço: ${formatPrice(item.price)}

Cores:
${selectedColors.length > 0
  ? selectedColors.join(', ')
  : 'Nenhuma selecionada'}

Tamanhos:
${selectedSizes.length > 0
  ? selectedSizes.join(', ')
  : 'Nenhum selecionado'}
`;

    const url =
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url);
  }

  return (
      <ScrollView style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageContainer}

        onScroll={(event) => {

          const slideSize =
            event.nativeEvent.layoutMeasurement.width;

          const index =
            event.nativeEvent.contentOffset.x / slideSize;

          const roundIndex = Math.round(index);

          setCurrentImage(roundIndex);

        }}

        scrollEventThrottle={16}

      >

        {item.images?.length > 0 ? (

          item.images.map((img, index) => (

            <Image
              key={index}
              source={{
                uri: `${API.BASE_URL}/uploads/${img}`
              }}
              style={styles.image}
              resizeMode="cover"
            />

          ))

        ) : (

          <Image
            source={require('../../assets/1.png')}
            style={styles.image}
            resizeMode="cover"
          />

        )}

      </ScrollView>

        {item.images?.length > 1 && (

          <View style={styles.counterContainer}>

            <Text style={styles.counterText}>
              {currentImage + 1} / {item.images.length} fotos
            </Text>

          </View>

        )}

      <View>

        {/* PREÇO */}
        <Text style={[styles.title, { fontSize: 24 }]}>
          {formatPrice(item.price)}
        </Text>

        {/* NOME */}
        <Text style={[styles.title, styles.name]}>
          {item.name}
        </Text>

        {/* CORES */}
        {item.colors?.length > 0 && (

          <View style={styles.colorsContainer}>

            <Text style={styles.sectionTitle}>
              Cores disponíveis
            </Text>

            <View style={styles.colorsWrap}>

              {item.colors.map((color, index) => {

                const selected =
                  selectedColors.includes(color);

                return (

                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorTag,
                      selected && styles.selectedTag
                    ]}
                    onPress={() =>
                      toggleSelection(
                        color,
                        selectedColors,
                        setSelectedColors
                      )
                    }
                  >

                    <Text
                      style={[
                        styles.colorText,
                        selected && styles.selectedText
                      ]}
                    >
                      {color}
                    </Text>

                  </TouchableOpacity>

                );

              })}

            </View>

          </View>

        )}

        {/* TAMANHOS */}
        {item.sizes?.length > 0 && (

          <View style={styles.sizeContainer}>

            <Text style={styles.sectionTitle}>
              Tamanhos disponíveis
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >

              {item.sizes.map((size, index) => {

                const selected =
                  selectedSizes.includes(size);

                return (

                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.sizeTag,
                      selected && styles.selectedTag
                    ]}
                    onPress={() =>
                      toggleSelection(
                        size,
                        selectedSizes,
                        setSelectedSizes
                      )
                    }
                  >

                    <Text
                      style={[
                        styles.sizeText,
                        selected && styles.selectedText
                      ]}
                    >
                      {size}
                    </Text>

                  </TouchableOpacity>

                );

              })}

            </ScrollView>

          </View>

        )}

        {/* DESCRIÇÃO */}
        <View style={styles.textContent}>

          <Text style={styles.textTitle}>
            Descrição
          </Text>

          <Text style={styles.textDescription}>
            {item.description || 'Sem descrição cadastrada.'}
          </Text>

        </View>

        {/* BOTÃO */}
        <TouchableOpacity
          style={styles.buyButton}
          onPress={handleBuy}
        >

          <Text style={styles.buyButtonText}>
            Comprar no WhatsApp
          </Text>

        </TouchableOpacity>

        <View style={styles.line} />

        <Footer
          currentItemId={item.id}
          navigation={navigation}
        />

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF'
  },

  imageContainer: {
    width: '100%',
  },

  image: {
    width,
    height: 300
  },

  title: {
    fontFamily: 'Anton_400Regular',
    paddingHorizontal: '4%'
  },

  name: {
    fontSize: 30,
    opacity: 0.7
  },

  swipeContainer: {
  alignItems: 'center',
  marginTop: 10,
},

swipeText: {
  fontSize: 14,
  color: '#777',
  fontWeight: '500',
},

counterContainer: {
  alignItems: 'center',
  marginTop: 10,
},

counterText: {
  fontSize: 14,
  color: '#777',
  fontWeight: '600',
},

  /* CORES */

  colorsContainer: {
    paddingHorizontal: '4%',
    marginVertical: '5%',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  colorsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  colorTag: {
    backgroundColor: '#EEE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },

  colorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },

  /* TAMANHOS */

  sizeContainer: {
    paddingHorizontal: '4%',
    marginBottom: '4%'
  },

  sizeTag: {
    backgroundColor: '#EEE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },

  sizeText: {
    color: '#333',
    fontWeight: '500',
  },

  /* SELECIONADO */

  selectedTag: {
    backgroundColor: '#111',
  },

  selectedText: {
    color: '#FFF',
  },

  /* DESCRIÇÃO */

  textContent: {
    marginVertical: '2%',
    paddingHorizontal: '4%'
  },

  textTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },

  textDescription: {
    fontSize: 16,
    lineHeight: 25,
  },

  /* BOTÃO */

  buyButton: {
    backgroundColor: '#25D366',
    marginHorizontal: '4%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  buyButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /* LINHA */

  line: {
    borderWidth: 1,
    borderBottomColor: '#DDD',
    marginVertical: '5%',
  }

});