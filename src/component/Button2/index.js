import React from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';

export default function Button2({
  title,
  onPress
}) {

  return (

    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >

      <Text style={styles.buttonText}>
        {title}
      </Text>

    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({

  button: {
    width: '100%',
    height: 58,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3
  },

  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  }

});