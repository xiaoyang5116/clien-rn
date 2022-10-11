import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { Animated, Text, View } from 'react-native';
import { px2pd } from '../../constants/resolution';
import { ImageButton, TextButton } from '../../constants/custom-ui';
import { useImperativeHandle } from 'react';
import FastImage from 'react-native-fast-image';
import RootView from '../RootView';

const NotificationContent = (props) => {
    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>
                <FastImage style={{ width: px2pd(800), height: px2pd(1200), borderRadius: 5, opacity: 0.85 }} source={require('../../../assets/bg/notication_content_bg.png')} />
                <View style={{ position: 'absolute', top: 90, width: px2pd(700) }}>
                    <Text style={{ color: '#fff', lineHeight: 26, fontSize: 18 }}>一些生产环节在后期可能会花费较多的时间，这个时候您可以暂时离开手机，进行少许的休息，进行适量的放松</Text>
                </View>
                <View style={{ position: 'absolute', bottom: 30 }}>
                    <TextButton style={{ width: 160 }} title={'确认'} onPress={props.onClose} />
                </View>
            </View>
        </View>
    );
}

const NotificationIcon = (props, ref) => {
    const scale = React.useRef(new Animated.Value(1)).current;
    const [display, setDisplay] = React.useState('none');

    const animation = React.useRef(
        Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.3,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1.0,
                    duration: 600,
                    useNativeDriver: true,
                })
            ])
        )
    ).current;

    React.useEffect(() => {
        animation.start();
        return () => {
            animation.stop();
        }
    }, []);

    useImperativeHandle(ref, () => ({
        active: () => {
            setDisplay('flex');
        }
    }));

    const pressHandler = () => {
        const key = RootView.add(<NotificationContent onClose={() => {
            RootView.remove(key);
            setTimeout(() => {
                if (props.onPress != undefined) {
                    props.onPress();
                }
            }, 0);
        }} />);
        setDisplay('none');
    }

    return (
        <Animated.View style={{ transform: [{ scale: scale }], display: display }}>
            <ImageButton
                width={px2pd(80)} 
                height={px2pd(80)} 
                source={require('../../../assets/button/notication_button.png')}
                selectedSource={require('../../../assets/button/notication_button_press.png')}
                onPress={pressHandler}
            />
        </Animated.View>
    )
}

export default forwardRef(NotificationIcon);

NotificationIcon.propTypes = {
    onPress: PropTypes.func,
}

NotificationIcon.defaultProps = {
}
