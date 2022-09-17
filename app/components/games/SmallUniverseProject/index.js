import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { action, connect, } from '../../../constants'

import { TextButton } from '../../../constants/custom-ui';




const SmallUniverseProject = props => {
  const { onClose } = props

  const AttrICon = ({ attrName }) => {
    return (
      <View></View>
    )
  }

  return (
    <View style={styles.viewContainer}>
      <SafeAreaView style={{ flex: 1, }}>
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <AttrICon attrName={"属性1"} />
          </View>
          <View style={styles.bottomContainer}></View>
          <View style={styles.goBackContainer}>
            <TextButton title={"返回"} onPress={onClose} />
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
};

export default SmallUniverseProject;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 99,
    backgroundColor: '#ccc',
  },
  container: {
    justifyContent: "space-between",
    alignItems: 'center',
  },
  topContainer: {
    width: "90%",
    height: '55%',
    borderColor: '#000',
    borderWidth: 1,
  },
  bottomContainer: {
    width: "90%",
    height: '35%',
    borderColor: '#000',
    borderWidth: 1,
  },
  goBackContainer: {
    width: "90%"
  }
});
