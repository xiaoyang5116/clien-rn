import React from 'react';

import lo from 'lodash';
import {
  AppDispath,
  DeviceEventEmitter,
  EventKeys
} from "../../constants";
import * as RootNavigation from '../../utils/RootNavigation';

import {
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';


const MENU_OPTIONS = [
  { id: 1, title: '返回主页', icon: 'exit-outline', type: 'Ionicons' },
  { id: 2, title: '功能未解锁', icon: 'laptop', type: 'AntDesign' },
  { id: 3, title: '功能未解锁', icon: 'linechart', type: 'AntDesign' },
  { id: 4, title: '功能未解锁', icon: 'filter', type: 'AntDesign' },
  { id: 5, title: '功能未解锁', icon: 'sharealt', type: 'AntDesign' },
  { id: 6, title: '功能未解锁', icon: 'notification', type: 'AntDesign' },
  { id: 7, title: '功能未解锁', icon: 'customerservice', type: 'AntDesign' },
  { id: 8, title: '功能未解锁', icon: 'clouddownloado', type: 'AntDesign' },
  { id: 9, title: '功能未解锁', icon: 'search1', type: 'AntDesign' },
  { id: 10, title: '功能未解锁', icon: 'dashboard', type: 'AntDesign' },
];

const MenuOptions = (props) => {

  const renderItem = (data) => {
    const { item } = data;
    let icon = (<></>);
    if (lo.isEqual(item.type, 'Ionicons')) {
      icon = <Ionicons name={item.icon} size={20} />
    } else if (lo.isEqual(item.type, 'AntDesign')) {
      icon = <AntDesign name={item.icon} size={20} />
    }

    let pressHandler = null;
    if (!lo.isFunction(item.action)) {
      if (item.id == 1) {
        pressHandler = () => {
          // 关闭 按钮浮层页面
          DeviceEventEmitter.emit(EventKeys.OPTIONS_HIDE)

          RootNavigation.navigate('First');
          AppDispath({ type: 'ArticleModel/cleanup' });
        }
      }
    } else {
      pressHandler = item.action;
    }

    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TouchableWithoutFeedback onPress={pressHandler}>
          <View style={styles.menuOptionsItem}>
            <View style={{ width: 50, alignItems: 'center' }}>{icon}</View>
            <View style={{ width: 130 }}><Text style={{ color: (pressHandler != null ? '#000' : '#999'), fontSize: 20 }}>{item.title}</Text></View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eee' }}>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <View style={{ width: '70%' }}>
          <AntDesign name='left' size={23} style={{ margin: 5 }} />
        </View>
        <View style={{ flex: 1, width: '70%' }} onTouchStart={(e) => { e.stopPropagation(); }}>
          <FlatList
            data={MENU_OPTIONS}
            style={{ alignSelf: 'stretch' }}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default MenuOptions

const styles = StyleSheet.create({
  menuOptionsItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
  },
})