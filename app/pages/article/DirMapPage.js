
import React from 'react';
import lo from 'lodash';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { px2pd } from '../../constants/resolution';

const DirMapPage = (props) => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ImageBackground style={{ width: px2pd(1080), height: px2pd(1808) }} source={require('../../../assets/bg/dir_map.png')}>
          <View style={styles.header}>
            <Text style={styles.headerText}></Text>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%', 
    height: 40 , 
    justifyContent: 'center', 
    alignItems: 'center'
  },

  headerText: {
    fontSize: 24,
  },

});

export default DirMapPage;