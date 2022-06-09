import React from 'react';
import { Animated, DeviceEventEmitter, View } from 'react-native';

import {
    connect,
    action,
    EventKeys,
} from "../../constants";

import lo from 'lodash';
import { px2pd } from '../../constants/resolution';

const ImageView = (props) => {
    const { image, readerStyle } = props;
    const imgWidth = px2pd(1080);
    const imgHeight = px2pd(1080);

    const opacity = React.useRef(new Animated.Value(0)).current;
    const translateX = React.useRef(new Animated.Value(0)).current;
    const translateY1 = React.useRef(new Animated.Value(0)).current;
    const translateY2 = React.useRef(new Animated.Value(0)).current;

    const fadeInAnimation = React.useRef(Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
    }));
    const translateXAnimation = React.useRef(Animated.timing(translateX, {
        toValue: imgWidth,
        duration: 1000,
        useNativeDriver: true,
    }));
    const translateY1Animation = React.useRef(Animated.timing(translateY1, {
        toValue: -imgHeight/2,
        duration: 1000,
        useNativeDriver: true,
    }));
    const translateY2Animation = React.useRef(Animated.timing(translateY2, {
        toValue: imgHeight/2,
        duration: 1000,
        useNativeDriver: true,
    }));

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(EventKeys.IMAGE_VIEW_ENTER_EVENT_AREA, ({ key }) => {
            if (lo.isEqual(key, props.itemKey)) {
                if (lo.isEqual(image.animation, 'fadeIn')) {
                    fadeInAnimation.current.start();
                } else if (lo.isEqual(image.animation, 'move')) {
                    translateXAnimation.current.start();
                } else if (lo.isEqual(image.animation, 'open')) {
                    translateY1Animation.current.start();
                    translateY2Animation.current.start();
                }
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    const layoutHandler = (e) => {
        props.dispatch(action('ArticleModel/layout')({ 
            key: props.itemKey,
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        }));
    }

    const commonStyle = { width: imgWidth, height: imgHeight };

    let animationView = <></>;
    switch (image.animation) {
        case 'fadeIn':
            animationView = <Animated.Image style={[commonStyle, { opacity: opacity }]} source={require('../../../assets/chapter/V1080.png')} />
            break;
        case 'move':
            animationView = <Animated.Image style={[commonStyle, { position: 'absolute', left: -imgWidth, transform: [{ translateX: translateX }] }]} 
                                source={require('../../../assets/chapter/V1080.png')} />
            break;
        case 'open':
            animationView = (
                <View style={{ overflow: 'hidden' }}>
                    <Animated.Image style={[commonStyle, { }]} source={require('../../../assets/chapter/V1080.png')} />
                    <Animated.View style={[{ position: 'absolute', top: 0, width: '100%', height: imgHeight/2, backgroundColor: readerStyle.bgColor }, { transform: [{ translateY: translateY1 }] }]} />
                    <Animated.View style={[{ position: 'absolute', bottom: 0, width: '100%', height: imgHeight/2, backgroundColor: readerStyle.bgColor }, { transform: [{ translateY: translateY2 }] }]} />
                </View>
            );
            break;
    }

    return (
        <View key={props.itemKey} style={{ justifyContent: 'center', alignItems: 'center', height: imgHeight }} onLayout={layoutHandler} >
            {animationView}
        </View>
    );
}

export default connect((state) => ({ ...state.ArticleModel }))(ImageView);