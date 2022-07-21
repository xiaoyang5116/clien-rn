import React from 'react';
import lo from 'lodash';

import {
    View,
    Text,
    Animated,
    DeviceEventEmitter,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    StyleSheet,
} from '../../constants'

import { px2pd } from '../../constants/resolution';
import { confirm } from '../dialog/ConfirmDialog';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageCapInset from 'react-native-image-capinsets-next';
import FastImage from 'react-native-fast-image';

// 缺省数据，在不指定props.words时使用。
const WORDS = [
    { value: '童' },
    { value: '家' },
    { value: '知' },
    { value: '道' },
    { value: '董' },
    { value: '家' },
    { value: '冬' },
    { value: '瓜' },
    { value: '大' }, 
    { value: '来' },
    { value: '到' },
    { value: '董' },
    { value: '家' },
    { value: '学' },
    { value: '种' },
    { value: '冬' },
    { value: '瓜' },
];

const Result = (props) => {
    const [value, setValue] = React.useState('');

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@MemoryTraining.choose', (v) => {
            setValue((pv) => {
                return `${pv}${v}`;
            })
        });
        return () => {
            listener.remove();
        }
    }, []);

    return (
        <View style={styles.resultContainer}>
            <View style={styles.label1}>
                <Text style={{ }}>请按顺序选择：</Text>
            </View>
            <View style={styles.label1}>
                <Text style={{ }}>{value}</Text>
            </View>
        </View>
    );
};

const ChooseItem = (props) => {

    const [selected, setSelected] = React.useState(false);
    const disabled = React.useRef(false);

    const img = selected
                    ? require('../../../assets/button/memory_traning_btn_selected.png')
                    : require('../../../assets/button/memory_traning_btn.png');

    return (
        <TouchableWithoutFeedback onPress={() => {
            if (disabled.current) {
                return;
            }
            
            setSelected(true);
            disabled.current = true;
            DeviceEventEmitter.emit('__@MemoryTraining.choose', props.value);
        }}>
            <Animated.View style={[styles.word, { opacity: props.bindOpacity }]}>
                <FastImage style={{ position: 'absolute', width: px2pd(118), height: px2pd(118) }} source={img} />
                <Text>{props.value}</Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const Space = (props) => {
    return (
        <View style={{ width: '100%', height: 10 }} />
    );
}

const BeginButton = (props) => {
    const opacity = React.useRef(new Animated.Value(1)).current;
    const scale = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        const animation = Animated.loop(Animated.sequence([
            Animated.timing(scale, {
                toValue: 1.05,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]));
        animation.start();
        return () => {
            animation.stop();
        }
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => {
            if (opacity._value <= 0)
                return;
                
            opacity.setValue(0);
            setTimeout(() => {
                DeviceEventEmitter.emit('__@MemoryTraining.begin');
            }, 1000);
        }}>
            <Animated.View style={{ position: 'absolute', opacity: opacity, transform: [{ scale: scale }] }}>
                <FastImage style={{ width: px2pd(666), height: px2pd(166) }} source={require('../../../assets/button/memory_traning_start_btn.png')} />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const MemoryTraining = (props) => {

    const previewList = React.useRef([]);
    const previewAnimationCounter = React.useRef(0);
    const chooseList = React.useRef([]);
    const chooseViewOpacity = React.useRef(new Animated.Value(0));
    const chooseWordOrder = React.useRef([]);

    if (lo.isArray(props.words) && props.words.length > 0) {
        WORDS.length = 0;
        props.words.forEach(e => {
            WORDS.push({ value: e });
        });
    }

    if (previewList.current.length <= 0) {
        const words = lo.cloneDeep(WORDS);

        let delay = 0;
        words.forEach(e => {
            e.opacity = new Animated.Value(0);
            e.animation = Animated.sequence([
                Animated.delay(delay),
                Animated.timing(e.opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.delay(1000),
                Animated.timing(e.opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }),
                {
                    start: () => { 
                        previewAnimationCounter.current += 1;
                        if (previewAnimationCounter.current >= WORDS.length) {
                            DeviceEventEmitter.emit('__@MemoryTraining.previewCompleted');
                        }
                    },
                    stop: () => { },
                }
            ]);
            delay += 1000;
        });

        previewList.current = lo.shuffle(words);
        chooseList.current = lo.shuffle(words);
    }

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@MemoryTraining.begin', () => {
            if (previewList.current.length > 0) {
                previewList.current.forEach(e => {
                    e.animation.start();
                });
            }
        });
        return () => {
            listener.remove();
            previewList.current.length = 0;
            previewAnimationCounter.current = 0;
            chooseList.current.length = 0;
            chooseViewOpacity.current.setValue(0);
            chooseWordOrder.current.length = 0;
        }
    }, []);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@MemoryTraining.previewCompleted', () => {
            Animated.timing(chooseViewOpacity.current, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        });
        return () => {
            listener.remove();
        }
    }, []);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@MemoryTraining.choose', (v) => {
            chooseWordOrder.current.push(v);
            if (chooseWordOrder.current.length >= WORDS.length) {
                let failure = false;
                for (let idx in WORDS) {
                    const item = WORDS[idx];
                    if (!lo.isEqual(item.value, chooseWordOrder.current[idx])) {
                        failure = true;
                        break;
                    }
                }
                if (failure) {
                    setTimeout(() => {
                        confirm('失败!', { title: '确认', cb: () => {
                            DeviceEventEmitter.emit('__@MemoryTraining.reset');
                        }});
                    }, 600);
                } else {
                    setTimeout(() => {
                        confirm('过关成功!', { title: '确认', cb: () => {
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                        }});
                    }, 600);
                }
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    let key = 0;
    const previewViews = [];
    previewList.current.forEach(e => {
        previewViews.push(
            <Animated.View key={key++} style={[styles.word, { opacity: e.opacity }]}>
                <FastImage style={{ position: 'absolute', width: px2pd(118), height: px2pd(118) }} source={require('../../../assets/button/memory_traning_btn.png')} />
                <Text>{e.value}</Text>
            </Animated.View>
        );
    });

    const chooseViews = [];
    chooseList.current.forEach(e => {
        chooseViews.push(<ChooseItem key={key++} value={e.value} bindOpacity={chooseViewOpacity.current} />);
    });

    return (
        <View style={styles.viewContainer}>
            <View style={styles.bodyContainer}>
                <View style={styles.titleContainer}>
                    <Text style={{ color: '#000', fontSize: 26 }}>记忆力考验</Text>
                </View>
                <View style={styles.topBanner}>
                    <TouchableWithoutFeedback onPress={() => {
                        if (props.onClose != undefined) {
                            props.onClose();
                        }
                    }}>
                        <AntDesign name='close' size={24} />
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.resultContainer}>
                    <Text>出题：</Text>
                </View>
                <View style={styles.boxContainer}>
                    <ImageCapInset
                        style={{ width: '100%', height: '100%', position: 'absolute' }}
                        source={require('../../../assets/bg/memory_training_bg.png')}
                        capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                    />
                    <Space />
                    {previewViews}
                    <Space />
                    <BeginButton />
                </View>
                <Result />
                <View style={[styles.boxContainer, { marginBottom: 10 }]}>
                    <ImageCapInset
                        style={{ width: '100%', height: '100%', position: 'absolute' }}
                        source={require('../../../assets/bg/memory_training_bg.png')}
                        capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                    />
                    <Space />
                    {chooseViews}
                    <Space />
                </View>
            </View>
        </View>
    )
}

const MemoryTrainingWapper = (props) => {

    const [refreshKey, setRefreshKey] = React.useState(0);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@MemoryTraining.reset', () => {
            setRefreshKey((v) => {
                return v + 1;
            })
        });
        return () => {
            listener.remove();
        }
    }, []);

    return (
        <>
            <MemoryTraining key={refreshKey} { ...props } />
        </>
    );
}

export default MemoryTrainingWapper;

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 99,
    },
    titleContainer: {
        position: 'absolute', 
        top: -28, 
        borderWidth: 1, 
        borderColor: '#333', 
        borderRadius: 16,
        backgroundColor: '#eee', 
        justifyContent: 'center',
        alignItems: 'center',
        width: 220, 
    }, 
    bodyContainer: {
        width: px2pd(850) + 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#333', 
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    boxContainer: {
        width: px2pd(850), 
        marginTop: 5, 
        marginBottom: 5, 
        borderWidth: 1, 
        borderColor: '#333', 
        borderRadius: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultContainer: {
        width: px2pd(850), 
        // marginBottom: 10, 
        // borderWidth: 1, 
        borderColor: '#333', 
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    topBanner: {
        width: '100%', 
        height: 30, 
        paddingRight: 10, 
        justifyContent: 'center', 
        alignItems: 'flex-end',
    },
    word: {
        width: px2pd(118), 
        height: px2pd(118), 
        // borderWidth: 1, 
        // borderColor: '#333', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    selected: {
        backgroundColor: '#999',
    },
    label1: {
        height: 20, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
});
