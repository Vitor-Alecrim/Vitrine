import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';
import { MaterialIcons } from '@expo/vector-icons';

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
{props.showCheckbox && (
  <TouchableOpacity 
    style={styles.checkboxContainer}
    onPress={props.onSelect}
  >
    <Checkbox
      value={props.isSelected}
      pointerEvents="none"
    />
  </TouchableOpacity>
)}


{/* MENU ADMIN */}
{props.showActions && (
  <TouchableOpacity
    style={styles.menuContainer}
    onPress={props.onMenuPress}
  >

    <MaterialIcons
      name="more-vert"
      size={24}
      color="#000"
    />

  </TouchableOpacity>
)}

{/* FAVORITOS */}
{props.showWishlist && (
  <TouchableOpacity
    style={styles.favoriteContainer}
    onPress={props.onWishlist}
  >

    <MaterialIcons
      name={
        props.isFavorite
          ? "favorite"
          : "favorite-border"
      }
      size={24}
      color={
        props.isFavorite
          ? "red"
          : "#000"
      }
    />

  </TouchableOpacity>
)}

  {/* CARD */}
  <TouchableOpacity onPress={props.onClick} activeOpacity={0.8}>
    
    <Image
      source={
        props.image
          ? (typeof props.image === 'string'
              ? { uri: props.image }
              : props.image)
          : require('../../assets/1.png')
      }
      style={styles.pantsImg}
    />

    <Text
      style={styles.pantsText}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {filterDesc(props.name)}
    </Text>

    <View style={{ opacity: 0.6 }}>
      <Text
        style={styles.pantsText}
        numberOfLines={1}
      >
        {props.price}
      </Text>
    </View>

  </TouchableOpacity>

</View>
);
}

const styles = StyleSheet.create({
    container:{
    width: 180,
    paddingTop: 15,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },

  pantsImg:{
    width: 175,
    height: 175
  },

  pantsText:{
    fontSize: 16,
    width: 175,
    textAlign: 'center'
  },

  checkboxContainer:{
    position: 'absolute',
    top: 18,
    left: 10,
    zIndex: 10
  },

  favoriteContainer:{
  position: 'absolute',
  top: 18,
  right: 10,
  zIndex: 10
},

  menuContainer:{
    position: 'absolute',
    top: 18,
    right: 10,
    zIndex: 10
  }

});