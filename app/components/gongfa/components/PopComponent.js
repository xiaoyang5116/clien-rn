import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import React from 'react';

const PopComponent = props => {
  const { onClose } = props;
  return (
    <View style={styles.viewContainer}>
      <TouchableWithoutFeedback style={{ width:"100%",height:"100%", backgroundColor:'red'}} onPress={onClose}>
        <View style={{ flex: 1,backgroundColor:'green', }}></View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default PopComponent;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    // zIndex: 99,
  },
  contentContainer: {
    width: '90%',
    height: '60%',
    backgroundColor: '#ccc',
  },
});
