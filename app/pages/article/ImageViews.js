import React from 'react';
import lo from 'lodash';

import { Animated, DeviceEventEmitter, View } from 'react-native';
import { DataContext, EventKeys, getChapterImage, getWorldBackgroundImage } from '../../constants';
import FastImage from 'react-native-fast-image';

 export const ReaderBackgroundImageView = () => {

    const [backgroundImage, setBackgroundImage] = React.useState(<></>);
  
    React.useEffect(() => {
      const listener = DeviceEventEmitter.addListener(EventKeys.SET_CURRENT_WORLD, (world) => {
        if (!lo.isEmpty(world.imageId)) {
          const found = getWorldBackgroundImage(world.imageId);
          if (found != undefined) {
            setBackgroundImage(<FastImage style={{ width: '100%', height: '100%', opacity: 0.15 }} source={found.source} />);
          }
        } else {
          setBackgroundImage(<></>);
        }
      });
      return () => {
        listener.remove();
      }
    }, []);
  
    return (
    <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      {backgroundImage}
    </View>
    );
}

export const ReaderXianGaoImageView = () => {
    const context = React.useContext(DataContext);
    const currentImageId = React.useRef('');
    const nextImage = React.useRef(null);
    const [image, setImage] = React.useState(<></>);
  
    React.useEffect(() => {
      const listener = DeviceEventEmitter.addListener(EventKeys.READER_BACKGROUND_IMG_UPDATE, ({ imageId, defaultOpacity }) => {
        if (lo.isEqual(currentImageId.current, imageId))
          return;
  
        if (lo.isEmpty(imageId)) {
          currentImageId.current = '';
          setTimeout(() => setImage(<></>), 0);
        } else if (lo.isEmpty(currentImageId.current)) {
          currentImageId.current = imageId;
          setTimeout(() => {
            const res = getChapterImage(imageId);
            context.readerBgImgOpacity.setValue(defaultOpacity);
            setImage(<Animated.Image style={{ width: res.width, height: res.height, opacity: context.readerBgImgOpacity }} source={res.source} />);
          }, 0);
        } else { // 先清除老的图片，再显示新的。（ 老图片同样绑定了 context.readerBgImgOpacity ）
          currentImageId.current = imageId;
          nextImage.current = { imageId, defaultOpacity };
          setTimeout(() => setImage(<></>), 0);
        }
      });
      return () => {
        listener.remove();
      }
    }, []);
  
    React.useEffect(() => {
      if (nextImage.current != null) {
        const { imageId, defaultOpacity } = nextImage.current;
        nextImage.current = null;
  
        currentImageId.current = imageId;
        setTimeout(() => {
          const res = getChapterImage(imageId);
          context.readerBgImgOpacity.setValue(defaultOpacity);
          setImage(<Animated.Image style={{ width: res.width, height: res.height, opacity: context.readerBgImgOpacity }} source={res.source} />);
        }, 0);
      }
    }, [image])
  
    return (
    <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      {image}
    </View>
    );
}
