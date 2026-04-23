import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';

export default function Pants(props) {

 function filterDesc(desc){
    if(!desc) return '';

    if(desc.length < 27){
        return desc;
    }

    return `${desc.substring(0, 23)}...`;
 }

 return (
  <View
    style={[
      styles.container,
      props.isSelected && {
        borderWidth: 2,
        borderColor: 'green',
        borderRadius: 10,
        backgroundColor: '#eaffea'
      }
    ]}
  >

    {/* CHECKBOX */}
    <TouchableOpacity 
      style={styles.checkboxContainer}
      onPress={props.onSelect}
      activeOpacity={0.7}
    >
      <Checkbox 
        value={props.isSelected}
        pointerEvents="none"
      />
    </TouchableOpacity>

    {/* CARD */}
    <TouchableOpacity onPress={props.onClick} activeOpacity={0.8}>
      <Image
  source={
    props.image
      ? (typeof props.image === 'string'
          ? { uri: props.image }
          : props.image)
      : require('../../assets/1.png') // 👈 imagem padrão
  }
  style={styles.pantsImg}
/>

      <Text style={styles.pantsText}>
        {filterDesc(props.name)}
      </Text>

      <View style={{ opacity: 0.6 }}>
        <Text style={styles.pantsText}>{props.price}</Text>
      </View>
    </TouchableOpacity>

  </View>
 );
}

const styles = StyleSheet.create({
  container:{
    paddingVertical: '2%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },

  pantsImg:{
    width: 175,
    height: 175
  },

  pantsText:{
    fontSize: 16
  },

  checkboxContainer:{
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10
  }
});