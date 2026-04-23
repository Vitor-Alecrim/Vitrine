import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import Pants from '../Pants';

export default function Footer() {
 return (
   <View>
       <Text style={styles.title}>VOCÊ TAMBÉM PODE GOSTAR</Text>

       <View style={{flexDirection: 'row'}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            
            <View style={{marginHorizontal: 10}}>
                <Pants 
                  image={require('../../assets/1.png')} 
                  price="R$ 110,90"
                  name="Calça Jeans Slim"
                />
            </View>

            <View style={{marginHorizontal: 10}}>
                <Pants 
                  image={require('../../assets/5.png')} 
                  price="R$ 160,90"
                  name="Calça Moletom Confort"
                />
            </View>

            <View style={{marginHorizontal: 10}}>
                <Pants 
                  image={require('../../assets/3.png')} 
                  price="R$ 189,90"
                  name="Calça Cargo Street"
                />
            </View>

        </ScrollView> 
       </View>
   </View>
  );
}

const styles = StyleSheet.create({
    title:{
        fontSize: 24,
        fontFamily: 'Anton_400Regular',
        marginVertical: '2%',
        paddingHorizontal: '2%',
    }
});