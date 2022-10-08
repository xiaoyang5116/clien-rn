import React from 'react';
import lo from 'lodash';

import { View, StyleSheet, DeviceEventEmitter } from 'react-native';
import Video from 'react-native-video';

import WorldPreview from '../../components/carousel/WorldPreview';
import WorldUnlockView from './WorldUnlockView';
import { AppDispath, DataContext, EventKeys } from '../../constants';
import WorldUtils from '../../utils/WorldUtils';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';

const WORLD_MAPS = [
  { primary: '尘界', left: '现实', right: '灵修界' },
  { primary: '灵修界', left: '尘界', right: '现实' },
  { primary: '现实', left: '灵修界', right: '尘界' },
]

const OtherWorld = (props) => {

    const CALLBACK_EVENT = '__@OtherWorld.cb';

    const [preview, setPreview] = React.useState(<></>);
    const context = React.useContext(DataContext);

    const refVideo = React.useRef(null);
    const [pauseBGVideo, setPauseBGVideo] = React.useState(true);
  
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
              // 播放背景动画
              refVideo.current.seek(0);
              setPauseBGVideo(false);
            } else if (v.data.dialog != undefined && !lo.isEmpty(v.data.dialog.content)) {
              setPreview(<WorldUnlockView {...props} content={v.data.dialog.content} onClose={() => {}} />);
              // 播放背景动画
              refVideo.current.seek(0);
              setPauseBGVideo(false);
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
      // 获取世界转场数据
      AppDispath({ type: 'ArticleModel/getTransWorld', payload: { routeName: activeRouteName }, retmsg: CALLBACK_EVENT});

      // 强制隐藏功能浮层
      DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);

      // 页面切走时，停止播放背景动画
      return () => {
        setPauseBGVideo(true);
      }
    }, [props]);
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Video 
            ref={(ref) => refVideo.current = ref}
            style={{ position: 'absolute', width: '100%', height: '100%', display: (pauseBGVideo ? 'none' : 'flex') }}
            source={require('../../../assets/mp4/ARTICLE_LEFT_RIGHT_BG.mp4')}
            fullscreen={false}
            // repeat={true}
            resizeMode={'stretch'}
            paused={pauseBGVideo}
            onEnd={() => {}}
        />
        <FastImage source={require('../../../assets/bg/world_unlock_bg.png')} style={{ position: 'absolute', width: px2pd(1080), height: px2pd(555) }} />
        {preview}
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