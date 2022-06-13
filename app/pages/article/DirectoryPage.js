
import React from 'react';
import lo from 'lodash';

import {
  FlatList,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native';
import { EventKeys } from '../../constants';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';

const DATA = [
  { id: 1, title: '第一章' },
  { id: 2, title: '第二章' },
  { id: 3, title: '第三章' },
  { id: 4, title: '第四章' },
  { id: 5, title: '第五章' },
  { id: 6, title: '第六章' },
  { id: 7, title: '第七章' },
  { id: 8, title: '第八章' },
  { id: 9, title: '第九章' },
  { id: 10, title: '第十章' },
]

const DirectoryPage = (props) => {

  const gotoDirMap = () => {
    DeviceEventEmitter.emit(EventKeys.GOTO_DIRECTORY_MAP);
  }

  const renderItem = (data) => {
    const { id, title } = data.item;
    return (
        <View style={{ width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
          <TouchableWithoutFeedback onPress={gotoDirMap}>
            <View style={styles.dirItem}>
              <FastImage style={{ position: 'absolute', width: '100%', height: '100%' }} source={require('../../../assets/button/dir_button.png')} />
              <Text style={styles.dirItemText}>{title}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>章 节</Text>
        </View>
        <FlatList 
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
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

  dirItem: {
    flex: 1, 
    width: px2pd(1018),
    height: px2pd(135),
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 3,
  },

  dirItemText: {
    fontSize: 16,
  },

});

export default DirectoryPage;