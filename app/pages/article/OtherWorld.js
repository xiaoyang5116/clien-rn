import React from 'react';
import lo from 'lodash';

import { View, Text, Animated, StyleSheet } from 'react-native';
import WorldUnlockView from './WorldUnlockView';
import RootView from '../../components/RootView';

const OtherWorld = (props) => {
    const maskOpacity = React.useRef(new Animated.Value(1)).current;
    const fontOpacity = React.useRef(new Animated.Value(0)).current;
  
    const { navigation } = props;
    const state = navigation.getState();
    const index = state.index;
    const activeRouteName = state.routeNames[index];
    const routeName = props.route.name;
  
    const onTouchTransView = () => {
      fontOpacity.setValue(0);
      const key = RootView.add(<WorldUnlockView {...props} onClose={() => RootView.remove(key)} />);
    }
  
    // 首次进入
    React.useEffect(() => {
      if (lo.isEqual(routeName, activeRouteName)) {
        maskOpacity.setValue(0);
        fontOpacity.setValue(0);
      } else {
        maskOpacity.setValue(1);
        fontOpacity.setValue(0);
      }
    }, []);
  
    // 通过透明度播放过度效果
    React.useEffect(() => {
      if (!lo.isEqual(routeName, activeRouteName)) {
        maskOpacity.setValue(1);
        fontOpacity.setValue(0);
        return;
      }
      //
      if (lo.isEqual(routeName, 'LeftWorld') || lo.isEqual(routeName, 'RightWorld')) {
        Animated.sequence([
          Animated.delay(300),
          Animated.timing(fontOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start();
      }
    }, [props]);
  
    return (
      <View style={[{ flex: 1 }, {  }]}>
        {/* 白色遮盖层 */}
        <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#fff', opacity: maskOpacity }} 
          onTouchStart={onTouchTransView} 
          pointerEvents={(lo.isEqual(routeName, 'PrimaryWorld') ? 'none' : 'auto')}>
          <Animated.View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', opacity: fontOpacity }}>
            {(lo.isEqual(routeName, 'LeftWorld')) ? (<Text style={styles.tranSceneFontStyle}>其实，修真可以改变现实。。。</Text>) : <></>}
            {(lo.isEqual(routeName, 'RightWorld')) ? (<Text style={styles.tranSceneFontStyle}>所念即所现，所思即所得。。。</Text>) : <></>}
          </Animated.View>
        </Animated.View>
    </View>
    );
}

const styles = StyleSheet.create({
    tranSceneFontStyle: {
      fontSize: 24, 
      color: '#333',
    },
});  

export default OtherWorld;