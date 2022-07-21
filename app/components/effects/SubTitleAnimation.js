import React from 'react';
import lo from 'lodash';

import { 
    View,
    Text,
    StyleSheet,
    Animated,
    DeviceEventEmitter,
} from 'react-native';

// 缺省测试数据
const DATA = ['字幕测试内容1', '字幕测试内容2', '字幕测试内容3', '字幕测试内容4', '字幕测试内容5', '字幕测试内容6', '字幕测试内容7', '字幕测试内容8', '字幕测试内容9']

const SubTitleItem = (props) => {
    const opacity = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@SubTitleAnimation.display', (idx) => {
            if (idx != props.id)
                return

            Animated.sequence([
                Animated.delay(300),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: false,
                }),
                Animated.delay(200),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ]).start(r => {
                const { finished } = r;
                if (finished) {
                    if ((idx + 1) >= props.maxNums) {
                        DeviceEventEmitter.emit('__@SubTitleAnimation.completed');
                    } else {
                        DeviceEventEmitter.emit('__@SubTitleAnimation.display', idx + 1);
                    }
                }
            });
        });
        return () => {
            listener.remove();
        }
    }, []);

    return (
        <Animated.View style={{ position: 'absolute', opacity: opacity }}>
            <Text style={{
                color: '#fff',
                fontSize: 28,
                textShadowColor: '#000', 
                textShadowRadius: 2, 
                shadowOpacity: 0,
            }}>{props.title}</Text>
        </Animated.View>
    );
}

const SubTitleAnimation = (props) => {

    const data = (lo.isArray(props.data) && props.data.length > 0) ? props.data : DATA;

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@SubTitleAnimation.completed', () => {
            if (props.onClose != undefined) {
                props.onClose();
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    React.useEffect(() => {
        DeviceEventEmitter.emit('__@SubTitleAnimation.display', 0);
    }, []);

    let idx = 0;
    const items = [];
    data.forEach(e => {
        items.push(<SubTitleItem key={idx} id={idx} title={e} maxNums={data.length} />);
        idx++;
    });

    return (
        <View style={styles.viewContainer}>
            <View style={{ width: '100%', height: 500, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                {items}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 99,
    },
});

export default SubTitleAnimation;
