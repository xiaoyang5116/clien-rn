
import React from 'react';

import lo, { set } from 'lodash';

import {
  connect,
  Component,
  StyleSheet,
  action,
  EventKeys,
  AppDispath,
  DataContext,
  getWindowSize,
} from "../constants";

import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableWithoutFeedback,
} from '../constants/native-ui';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { TextButton } from '../constants/custom-ui';
import RootView from '../components/RootView';
import { px2pd } from '../constants/resolution';

const CollectPage = (props) => {
  return (
    <SafeAreaView style={styles.viewContainer}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.bodyContainer}>
          <View style={styles.topBarContainer}>
            <TouchableWithoutFeedback onPress={() => {
              if (props.onClose != undefined) {
                props.onClose();
              }
            }}>
              <AntDesign name={'left'} size={30} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.mapContainer}>
          </View>
        </View>
        <View style={{ width: '100%', marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
          <TextButton title='一键采集' />
        </View>
        <View style={{ width: '100%', marginTop: 10, marginRight: 20, justifyContent: 'center', alignItems: 'flex-end' }}>
          <TextButton title='储物袋' />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#a49f99',
  },

  bodyContainer: {
    width: px2pd(1000),
    height: px2pd(1700),
  },

  topBarContainer: {
    marginBottom: 5,
  },

  mapContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#666',
  },
});

export const showCollectPage = () => {
  const key = RootView.add(<CollectPage onClose={() => {
    RootView.remove(key);
  }} />)
}

export default CollectPage;