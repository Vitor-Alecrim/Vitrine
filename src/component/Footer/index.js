import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import * as API from '../../services/api';

import Pants from '../Pants';

export default function Footer({ currentItemId, navigation }) {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, 'pants'),
      (snapshot) => {

        let list = [];

        snapshot.forEach((doc) => {

          const data = {
            id: doc.id,
            ...doc.data()
          };

          // ignora o produto atual
          if (data.id === currentItemId) {
            return;
          }

          list.push(data);

        });

        setProducts(list);

      }
    );

    return () => unsubscribe();

  }, [currentItemId]);

  function formatPrice(value) {
    if (!value) return "R$ 0,00";

    return `R$ ${Number(value)
      .toFixed(2)
      .replace('.', ',')}`;
  }

  return (
    <View>

      <Text style={styles.title}>
        VOCÊ TAMBÉM PODE GOSTAR
      </Text>

      <View style={{ flexDirection: 'row' }}>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >

          {products.map((item, index) => (

            <View
              key={item.id || index}
              style={{ marginHorizontal: 10 }}
            >

                <Pants
                  image={
                    item.images?.[0]
                      ? {
                          uri: item.images[0].startsWith('http')
                            ? item.images[0]
                            : `${API.BASE_URL}/uploads/${item.images[0]}`
                        }
                      : require('../../assets/1.png')
                  }
                  price={formatPrice(item.price)}
                  name={item.name}
                  showActions={false}
                  onClick={() =>
                    navigation.navigate('Detail', {
                      item: item
                    })
                  }
                />

            </View>

          ))}

        </ScrollView>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  title: {
    fontSize: 24,
    fontFamily: 'Anton_400Regular',
    marginVertical: '2%',
    paddingHorizontal: '2%',
  }

});