
import React from 'react';
import lo from 'lodash';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
} from 'react-native';

const DirMapPage = (props) => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>章节地图</Text>
        </View>
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