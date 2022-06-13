
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
        <View style={{ width: '100%', height: 60 }}>
          <TouchableWithoutFeedback onPress={gotoDirMap}>
            <View style={styles.dirItem}>
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
    marginLeft: 5,
    marginRight: 5, 
    marginBottom: 5,
    borderWidth: 1, 
    borderColor: '#ccc', 
    backgroundColor: '#666', 
    justifyContent: 'center', 
    alignItems: 'center'
  },

  dirItemText: {
    fontSize: 16,
  },

});

export default DirectoryPage;