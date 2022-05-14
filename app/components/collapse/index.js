
import React from 'react';

import lo from 'lodash';

import {
  Animated,
} from 'react-native';

import {
  DeviceEventEmitter
} from '../../constants'

import { 
  SafeAreaView, 
  View, 
  Text, 
  SectionList,
  TouchableWithoutFeedback
} from '../../constants/native-ui';
import Easing from 'react-native/Libraries/Animated/Easing';

const DEFAULT_LINE_HEIGHT = 40;
const EXPAND_EVENT = '__@EXPAND_EVENT';
const COLLAPSE_EVENT = '__@COLLAPSE_EVENT';

const CollapseGroup = (props) => {
  const { item, section } = props.data;
  const lineHeight = lo.isUndefined(props.style.lineHeight) ? DEFAULT_LINE_HEIGHT : props.style.lineHeight;
  const viewHeight = lineHeight * item.length;
  const height = React.useRef(new Animated.Value(section.collapsed ? 0 : viewHeight)).current;

  React.useEffect(() => {
    const expandListener = DeviceEventEmitter.addListener(EXPAND_EVENT, (groupId) => {
      if (groupId != section.groupId)
        return;
      Animated.timing(height, {
        toValue: viewHeight,
        duration: 300,
        easing: Easing.bounce,
        useNativeDriver: false,
      }).start();
    });

    const collapseListener = DeviceEventEmitter.addListener(COLLAPSE_EVENT, (groupId) => {
      if (groupId != section.groupId)
        return;
      Animated.timing(height, {
        toValue: 0,
        duration: 300,
        easing: Easing.cubic,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      expandListener.remove();
      collapseListener.remove();
    }
  }, []);

  let key = 0;
  const childrens = [];
  item.forEach(e => {
    childrens.push(
      <TouchableWithoutFeedback key={key++} onPress={() => {}}>
        <View style={{ width: 'auto', height: lineHeight, borderWidth: 1, borderColor: '#666', backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
          {props.renderItem(e)}
        </View>
      </TouchableWithoutFeedback>
    );
  });
  return (
    <Animated.View style={{ margin: 0, height: height, overflow: 'hidden', backgroundColor: '#669900' }}>
      {childrens}
    </Animated.View>
  );
}

const CollapseGroupHeader = (props) => {
  const { section } = props;

  return (
    <TouchableWithoutFeedback onPress={() => {
        if (section.collapsed) {
          DeviceEventEmitter.emit(EXPAND_EVENT, section.groupId);
        } else {
          DeviceEventEmitter.emit(COLLAPSE_EVENT, section.groupId);
        }
        section.collapsed = !section.collapsed;
      }}>
      <View style={{ width: 'auto', height: 40, backgroundColor: '#666', justifyContent: 'center', alignItems: 'center' }}>
        {props.renderGroupHeader(section)}
      </View>
    </TouchableWithoutFeedback>
    );
}

// 用法：
// 通过 style: { lineHeight: 指定条目行高 }
// 通过 renderItem 函数返回条目显示。
// 通过 renderGroupHeader 番薯返回分组标题显示。
const Collapse = (props) => {
  const data = lo.cloneDeep(props.data);

  // 自动生成 groupId
  let groupId = 0;
  data.forEach(e => {
    e.groupId = groupId++;
  })

  // 自动补全 collapsed
  data.forEach(e => {
    e.collapsed = lo.isBoolean(e.collapsed) ? e.collapsed : false;
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <SectionList
          sections={data}
          keyExtractor={(item, index) => item + index}
          renderItem={(item) => <CollapseGroup {...props} style={{ ...props.style }} data={item} />}
          renderSectionHeader={({ section }) => <CollapseGroupHeader {...props} section={section} />}
        />
      </View>
    </SafeAreaView>
  );
}

export default Collapse;