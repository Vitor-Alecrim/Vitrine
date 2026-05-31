import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';

import {
  doc,
  getDoc,
  setDoc,
  arrayRemove
} from 'firebase/firestore';

import { auth, db } from '../../services/firebaseConfig';

import Pants from '../../component/Pants';
import { BASE_URL } from '../../services/api';

export default function Wishlist({ navigation }) {

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadFavorites(){

      try{

        const user = auth.currentUser;

        if(!user){
          return;
        }

        const docRef =
          doc(db, 'favorites', user.uid);

        const docSnap =
          await getDoc(docRef);

        if(docSnap.exists()){

          const data = docSnap.data();

          setFavorites(data.items || []);

        }

      }catch(error){

        console.log(error);

        Alert.alert(
          'Erro',
          'Não foi possível carregar favoritos.'
        );

      }finally{

        setLoading(false);

      }

    }

    loadFavorites();

  }, []);

  async function removeFavorite(item){

    try{

      const user = auth.currentUser;

      if(!user){
        return;
      }

      const docRef =
        doc(db, 'favorites', user.uid);

      await setDoc(
        docRef,
        {
          items: arrayRemove(item)
        },
        { merge: true }
      );

      setFavorites(prev =>
        prev.filter(
          favorite => favorite.id !== item.id
        )
      );

    }catch(error){

      console.log(error);

      Alert.alert(
        'Erro',
        'Não foi possível remover favorito.'
      );

    }

  }

  function formatPrice(value) {

    if (!value) {
      return 'R$ 0,00';
    }

    return `R$ ${Number(value)
      .toFixed(2)
      .replace('.', ',')}`;

  }

  if(loading){

    return(

      <View style={styles.center}>
        <Text>
          Carregando favoritos...
        </Text>
      </View>

    );

  }

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Lista de Desejos ❤️
      </Text>

      {favorites.length === 0 ? (

        <View style={styles.center}>

          <Text style={styles.emptyText}>
            Nenhum produto salvo.
          </Text>

        </View>

      ) : (

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >

          <View style={styles.list}>

            {favorites.map(item => (

              <Pants
                key={item.id}

                image={
                  item.images &&
                  item.images.length > 0

                    ? {
                        uri:
                        `${BASE_URL}/uploads/${item.images[0]}`
                      }

                    : require('../../assets/1.png')
                }

                price={formatPrice(item.price)}

                name={item.name}

                onClick={() =>
                  navigation.navigate(
                    'Detail',
                    { item }
                  )
                }

                showCheckbox={false}

                showWishlist={true}

                isFavorite={true}

                onWishlist={() =>
                  removeFavorite(item)
                }
              />

            ))}

          </View>

        </ScrollView>

      )}

    </View>

  );

}

const styles = StyleSheet.create({

  container:{
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 20
  },

  title:{
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15
  },

  scroll:{
    paddingBottom: 30
  },

  list:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },

  center:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  emptyText:{
    fontSize: 16,
    opacity: 0.7
  }

});