import React from 'react';
import { Animated, ScrollView, StyleSheet } from 'react-native';

import {
  action,
  connect,
  Component,
  ThemeContext,
  EventKeys,
} from "../../constants";
  
import { 
  Text, 
  View, 
  Image,
  SectionList, 
  TouchableWithoutFeedback 
} from '../../constants/native-ui';

import lo from 'lodash';
import { px2pd } from '../../constants/resolution';
import AntDesign from 'react-native-vector-icons/AntDesign';

const BoxItem = (props) => {
  return (
    <View style={[props.style, styles.boxItem]}>

    </View>
  );
}

const MissionBar = (props) => {

  const translateY = React.useRef(new Animated.Value(0)).current;
  const zIndex = React.useRef(new Animated.Value(0)).current;
  const showBtnOpacity = React.useRef(new Animated.Value(0)).current;

  const hide = () => {
    Animated.timing(translateY, {
      toValue: 200,
      duration: 300,
      useNativeDriver: true,
    }).start((r) => {
      const { finished } = r;
      if (finished) {
        zIndex.setValue(0);
        Animated.timing(showBtnOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    });
  }

  const show = () => {
    showBtnOpacity.setValue(0);
    zIndex.setValue(100);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start((r) => {
    });
  }

  React.useEffect(() => {
    hide();
  }, []);

  const boxItems = [];
  lo.range(28).forEach(e => {
    boxItems.push(<BoxItem key={e} style={(e <= 1) ? { marginLeft: 10 } : {}} />);
  });

  return (
      <Animated.View style={[styles.viewContainer, { transform: [{ translateY: translateY }], zIndex: zIndex }]}>
        <View style={{ position: 'absolute', right: 5, top: -25 }}>
          <AntDesign name='close' size={25} onPress={() => hide()} />
        </View>
        <Animated.View style={[{ position: 'absolute', right: 90, top: -105 }, { opacity: showBtnOpacity }]}>
          <AntDesign name='upcircleo' size={20} onPress={() => show()} />
        </Animated.View>
        <ScrollView horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false} style={{}}>
          <View style={{ flexWrap: 'wrap' }}>
            {boxItems}
          </View>
        </ScrollView>
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    position: 'absolute', 
    bottom: 40, 
    width: '100%', 
    height: px2pd(320), 
    backgroundColor: '#a49f99', 
    // zIndex: 100,
  },

  boxItem: {
    width: px2pd(120), 
    height: px2pd(120), 
    marginRight: 10, 
    marginTop: 10, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 10, 
    backgroundColor: '#666',
  }
});

export default MissionBar;