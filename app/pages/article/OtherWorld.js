import React from 'react';
import lo from 'lodash';

import { View, Animated, StyleSheet } from 'react-native';
import WorldPreview from '../../components/carousel/WorldPreview';

const OtherWorld = (props) => {
    const maskOpacity = React.useRef(new Animated.Value(1)).current;
  
    const { navigation } = props;
    const state = navigation.getState();
    const index = state.index;
    const activeRouteName = state.routeNames[index];
    const routeName = props.route.name;
  
    // 通过透明度播放过度效果
    React.useEffect(() => {
      if (!lo.isEqual(routeName, activeRouteName)) {
        maskOpacity.setValue(1);
        return;
      }
      Animated.sequence([
        Animated.timing(maskOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        })
      ]).start();
    }, [props]);
  
    return (
      <View style={{ flex: 1 }}>
        <WorldPreview 
          item={{ 
            worldId: 0, 
            title: '尘界', 
            desc: 'xxx', 
            toChapter: '' 
          }} 
          animation={true} 
        />
        {/* 白色遮盖层 */}
        <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#fff', opacity: maskOpacity }} pointerEvents='none'>
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