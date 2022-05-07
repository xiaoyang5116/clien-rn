import React from 'react';

import { 
    View, 
    Animated,
    Easing,
} from 'react-native';

const ANIMATION_IMAGES = [
    require('../../../assets/animations/world_trans/1.png'),
    require('../../../assets/animations/world_trans/2.png'),
    require('../../../assets/animations/world_trans/3.png'),
    require('../../../assets/animations/world_trans/4.png'),
    require('../../../assets/animations/world_trans/5.png'),
    require('../../../assets/animations/world_trans/6.png'),
    require('../../../assets/animations/world_trans/7.png'),
];

const TransAnimation = (props) => {
    const [imageId, setImageId] = React.useState(0);
    const scale = React.useRef(new Animated.Value(2)).current;
    const animation = React.useRef(
        Animated.timing(scale, {
            toValue: 1,
            duration: 3500,
            easing: Easing.linear,
            useNativeDriver: false,
        })).current;
    //
    React.useEffect(() => {
        // 播放帧动画
        const timer1 = setInterval(() => {
            setImageId((e) => ((e > ANIMATION_IMAGES.length - 1) ? e : (e + 1)));
        }, 333);
        // 镜头拉伸
        const timer2 = setTimeout(() => {
            animation.start(({ finished }) => {
                if (props.onCompleted != undefined) props.onCompleted();
            });
        }, 3000);
        //
        return (() => {
            clearInterval(timer1);
            clearTimeout(timer2);
        });
    }, []);
    //
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Animated.Image style={{ width: '100%', height: '100%', transform: [{ scale: scale }] }} resizeMode='contain' source={ANIMATION_IMAGES[imageId]} />
        </View>
    );
}

export default TransAnimation;