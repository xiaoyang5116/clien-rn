import React from 'react';
import lo from 'lodash';

import { View, Animated, StyleSheet, DeviceEventEmitter } from 'react-native';
import WorldPreview from '../../components/carousel/WorldPreview';
import WorldUnlockView from './WorldUnlockView';
import { AppDispath, DataContext, EventKeys } from '../../constants';
import WorldUtils from '../../utils/WorldUtils';

const WORLD_MAPS = [
  { primary: '尘界', left: '现实', right: '灵修界' },
  { primary: '灵修界', left: '尘界', right: '现实' },
  { primary: '现实', left: '灵修界', right: '尘界' },
]

const OtherWorld = (props) => {

    const CALLBACK_EVENT = '__@OtherWorld.cb';

    const maskOpacity = React.useRef(new Animated.Value(1)).current;
    const [preview, setPreview] = React.useState(<></>);
    const context = React.useContext(DataContext);
  
    const { navigation } = props;
    const state = navigation.getState();
    const index = state.index;
    const activeRouteName = state.routeNames[index];
    const routeName = props.route.name;

    React.useEffect(() => {
      const listener = DeviceEventEmitter.addListener(CALLBACK_EVENT, (v) => {
        if (!lo.isEqual(routeName, v.routeName))
          return

        const worldItems = WORLD_MAPS.find(e => lo.isEqual(e.primary, context.currentWorldName));
        if (worldItems != undefined) {
          let worldName = '';
          if (lo.isEqual(v.routeName, 'LeftWorld')) worldName = worldItems.left;
          if (lo.isEqual(v.routeName, 'RightWorld')) worldName = worldItems.right;
  
          if (!lo.isEmpty(worldName)) {
            const worldId = WorldUtils.getWorldIdByName(worldName);
            if (v.data == null) {
              setPreview(<WorldUnlockView {...props} onClose={() => {}} />);
            } else if (v.data.dialog != undefined && !lo.isEmpty(v.data.dialog.content)) {
              setPreview(<WorldUnlockView {...props} content={v.data.dialog.content} onClose={() => {}} />);
            } else {
              setPreview(
                <WorldPreview 
                  item={{ 
                    worldId: worldId, 
                    title: worldName, 
                    desc: v.data.desc, 
                    toChapter: v.data.toChapter, 
                  }} 
                  animation={true}
                  onClose={() => {
                    props.navigation.navigate('PrimaryWorld');
                  }}
                />
              );
            }
          }
        }
      });
      return () => {
        listener.remove();
      }
    }, []);
  
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

      AppDispath({ type: 'ArticleModel/getTransWorld', payload: { routeName: activeRouteName }, retmsg: CALLBACK_EVENT});

      // 强制隐藏功能浮层
      DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
    }, [props]);
  
    return (
      <View style={{ flex: 1 }}>
        {preview}
        {/* 白色遮盖层 */}
        <Animated.View style={[styles.maskView, { opacity: maskOpacity }]} pointerEvents='none' />
    </View>
    );
}

const styles = StyleSheet.create({
    tranSceneFontStyle: {
      fontSize: 24, 
      color: '#333',
    },
    maskView: {
      position: 'absolute', 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#fff',
    },
});

export default OtherWorld;