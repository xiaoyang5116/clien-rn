import {
  StyleSheet,
  View,
  Text,
  DeviceEventEmitter,
  SafeAreaView
} from 'react-native'
import React from 'react'

import lo from 'lodash';
import {
  EventKeys,
  AppDispath,
} from "../../constants";

import AntDesign from 'react-native-vector-icons/AntDesign';
import Collapse from '../../components/collapse';

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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <AntDesign name='left' size={23} style={{ margin: 5 }} />
        <View style={{ flex: 1 }} onTouchStart={(e) => e.stopPropagation()}>
          <Collapse
            data={data}
            renderItem={(item) => {
              return (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: 50 }}><Text>{item.title}:</Text></View>
                  <View><Text style={{ color: '#666' }}>{item.value}</Text></View>
                </View>
              );
            }}
            renderGroupHeader={(section) => {
              return (
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{section.title}</Text>
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