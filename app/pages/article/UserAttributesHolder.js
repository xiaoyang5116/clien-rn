import {
  StyleSheet,
  View,
  Text,
  DeviceEventEmitter,
  SafeAreaView,
  Image
} from 'react-native'
import React from 'react'

import lo from 'lodash';
import {
  EventKeys,
  AppDispath,
} from "../../constants";

import AntDesign from 'react-native-vector-icons/AntDesign';
import Collapse from '../../components/collapse';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';

const UserAttributesHolder = (props) => {
  const [data, setData] = React.useState(props.config);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener(EventKeys.USER_ATTR_UPDATE, () => {
      const cb = (result) => {
        const newData = lo.cloneDeep(data);
        result.forEach(e => {
          const { key, value } = e;
          newData.forEach(e => {
            e.data.forEach(e => {
              e.forEach(e => {
                if (e.key == key) {
                  e.value = value;
                }
              })
            });
          });
        });
        //
        setData(newData);
      };
      AppDispath({ type: 'UserModel/getAttrs', cb });
    });

    // 更新角色属性
    DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);

    return () => {
      listener.remove();
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, }}>
      <Image style={{ width: px2pd(1080), height: px2pd(2400), position: 'absolute', }} source={require('../../../assets/bg/roleAttribute_bg.png')} />
      <View style={{ flex: 1, }}>
        <View>
          <FastImage style={{ width: px2pd(1132), height: px2pd(107), position: 'absolute' }} source={require('../../../assets/bg/roleAttribute_back_bg.png')} />
          <AntDesign name='left' size={23} style={{ margin: 5 }} />
        </View>

        <View style={{ flex: 1 }} onTouchStart={(e) => e.stopPropagation()}>
          <Collapse
            data={data}
            renderItem={(item) => {
              return (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <FastImage style={{ width: "100%", height: "100%", position: 'absolute' }} source={require('../../../assets/bg/roleAttribute_bg2.png')} />
                  <View style={{ width: 50 }}><Text>{item.title}:</Text></View>
                  <View><Text style={{ color: '#666' }}>{item.value}</Text></View>
                </View>
              );
            }}
            renderGroupHeader={(section) => {
              return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <FastImage style={{ width: px2pd(1074), height: px2pd(102), position: 'absolute' }} source={require('../../../assets/bg/roleAttribute_bg3.png')} />
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{section.title}</Text>
                </View>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default UserAttributesHolder

const styles = StyleSheet.create({})