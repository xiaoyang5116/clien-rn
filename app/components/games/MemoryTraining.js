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

    return (
        <TouchableWithoutFeedback onPress={() => {
            if (disabled.current) {
                return;
            }
            
            setSelected(true);
            disabled.current = true;
            DeviceEventEmitter.emit('__@MemoryTraining.choose', props.value);
        }}>
            <Animated.View style={[styles.word, (selected ? styles.selected : {}), { opacity: props.bindOpacity }]}>
                <Text>{props.value}</Text>
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
        if (previewList.current.length > 0) {
            previewList.current.forEach(e => {
                e.animation.start();
            });
        }
        return () => {
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
                <View style={styles.topBanner}>
                    <TouchableWithoutFeedback onPress={() => {
                        if (props.onClose != undefined) {
                            props.onClose();
                        }
                    }}>
                        <AntDesign name='close' size={24} />
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.boxContainer}>
                    {previewViews}
                </View>
                <Result />
                <View style={styles.boxContainer}>
                    {chooseViews}
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
    bodyContainer: {
        width: px2pd(850) + 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#333', 
        backgroundColor: '#fff',
    },
    boxContainer: {
        width: px2pd(850), 
        marginTop: 10, 
        marginBottom: 10, 
        borderWidth: 1, 
        borderColor: '#333', 
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
        width: 35, 
        height: 35, 
        borderWidth: 1, 
        borderColor: '#333', 
        justifyContent: 'center', 
        alignItems: 'center',
        margin: 10,
        backgroundColor: '#eee',
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
