import React from 'react';

import {
    getWindowSize,
} from '../../constants';

import { 
    View, 
    FlatList,
    StyleSheet, 
    TouchableWithoutFeedback,
} from 'react-native';

import { px2pd } from '../../constants/resolution';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';

const WIN_SIZE = getWindowSize();

const FarLayer = (props) => {
    const refFlatList = React.useRef(null);

    const images = [
        { style: { width: px2pd(540), height: px2pd(1500) }, source: require('../../../assets/cloud/F_1.png') },
        { style: { width: px2pd(540), height: px2pd(1500) }, source: require('../../../assets/cloud/F_2.png') },
        { style: { width: px2pd(540), height: px2pd(1500) }, source: require('../../../assets/cloud/F_3.png') },
        { style: { width: px2pd(540), height: px2pd(1500) }, source: require('../../../assets/cloud/F_4.png') },
        { style: { width: px2pd(540), height: px2pd(1500) }, source: require('../../../assets/cloud/F_5.png') },
        { style: { width: px2pd(540), height: px2pd(1500) }, source: require('../../../assets/cloud/F_6.png') },
    ]
    
    let index = 0;
    const data = [];
    
    images.forEach(e => {
        data.push({ id: index++ });
    });

    React.useEffect(() => {
        let offset = 0;
        const timer = setInterval(() => {
            if (refFlatList.current == null)
                return
            refFlatList.current.scrollToOffset({ offset: offset, animated: false });
            offset += 0.1;
        }, 10);
        return () => {
            clearInterval(timer);
        }
    }, []);

    const renderItem = ({ item, index }) => {
        const imageIndex = index % 6;
        return (
            <View style={[images[imageIndex].style]}>
                <FastImage style={{ width: '100%', height: '100%' }} source={images[imageIndex].source} />
            </View>
        );
    }

    return (
    <FlatList 
        ref={(ref) => refFlatList.current = ref}
        data={data}
        style={{ alignContent: 'stretch' }}
        contentContainerStyle={{ alignItems: 'center' }}
        horizontal={true}
        renderItem={renderItem}
        scrollEnabled={false}
        keyExtractor={item => item.id}
        onEndReached={(e) => {
            data.push({ id: data.length + 1 });
        }}
    />
    );
}

const MidLayer = (props) => {
    const refFlatList = React.useRef(null);

    const images = [
        { style: { width: px2pd(540), height: px2pd(1500) }, source: require('../../../assets/cloud/M_1.png') },
        { style: { width: px2pd(540), height: px2pd(1500) }, source: require('../../../assets/cloud/M_2.png') },
        { style: { width: px2pd(540), height: px2pd(1500) }, source: require('../../../assets/cloud/M_3.png') },
        { style: { width: px2pd(540), height: px2pd(1500) }, source: require('../../../assets/cloud/M_4.png') },
        { style: { width: px2pd(540), height: px2pd(1500) }, source: require('../../../assets/cloud/M_5.png') },
        { style: { width: px2pd(540), height: px2pd(1500) }, source: require('../../../assets/cloud/M_6.png') },
    ]
    
    let index = 0;
    const data = [];
    
    images.forEach(e => {
        data.push({ id: index++ });
    });

    React.useEffect(() => {
        let offset = 0;
        const timer = setInterval(() => {
            if (refFlatList.current == null)
                return
            refFlatList.current.scrollToOffset({ offset: offset, animated: false });
            offset += 0.2;
        }, 10);
        return () => {
            clearInterval(timer);
        }
    }, []);

    const renderItem = ({ item, index }) => {
        const imageIndex = index % 6;
        return (
            <View style={[images[imageIndex].style]}>
                <FastImage style={{ width: '100%', height: '100%' }} source={images[imageIndex].source} />
            </View>
        );
    }

    return (
    <FlatList 
        ref={(ref) => refFlatList.current = ref}
        data={data}
        style={{ alignContent: 'stretch' }}
        contentContainerStyle={{ alignItems: 'center' }}
        horizontal={true}
        renderItem={renderItem}
        scrollEnabled={false}
        keyExtractor={item => item.id}
        onEndReached={(e) => {
            data.push({ id: data.length + 1 });
        }}
    />
    );
}

const NearLayer = (props) => {
    const refFlatList = React.useRef(null);

    const images = [
        { style: { width: px2pd(540), height: px2pd(800) }, source: require('../../../assets/cloud/N_1.png') },
        { style: { width: px2pd(540), height: px2pd(800) }, source: require('../../../assets/cloud/N_2.png') },
        { style: { width: px2pd(540), height: px2pd(800) }, source: require('../../../assets/cloud/N_3.png') },
        { style: { width: px2pd(540), height: px2pd(800) }, source: require('../../../assets/cloud/N_4.png') },
        { style: { width: px2pd(540), height: px2pd(800) }, source: require('../../../assets/cloud/N_5.png') },
        { style: { width: px2pd(540), height: px2pd(800) }, source: require('../../../assets/cloud/N_6.png') },
    ]
    
    let index = 0;
    const data = [];
    
    images.forEach(e => {
        data.push({ id: index++ });
    });

    React.useEffect(() => {
        let offset = 0;
        const timer = setInterval(() => {
            if (refFlatList.current == null)
                return
            refFlatList.current.scrollToOffset({ offset: offset++, animated: false });
        }, 20);
        return () => {
            clearInterval(timer);
        }
    }, []);

    const renderItem = ({ item, index }) => {
        const imageIndex = index % 6;
        return (
            <View style={[images[imageIndex].style]}>
                <FastImage style={{ width: '100%', height: '100%' }} source={images[imageIndex].source} />
            </View>
        );
    }

    return (
    <FlatList 
        ref={(ref) => refFlatList.current = ref}
        data={data}
        style={{ alignContent: 'stretch' }}
        contentContainerStyle={{ alignItems: 'center' }}
        horizontal={true}
        renderItem={renderItem}
        scrollEnabled={false}
        keyExtractor={item => item.id}
        onEndReached={(e) => {
            data.push({ id: data.length + 1 });
        }}
    />
    );
}

const CloudAnimation = (props) => {

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (props.onClose != undefined) {
                props.onClose();
            }
        }, 3 * 1000);
        return () => {
            clearTimeout(timer);
        }
    }, [])

    return (
        <View style={styles.viewContainer}>
            <TouchableWithoutFeedback onPress={() => {
                    if (props.onClose != undefined) {
                        props.onClose();
                    }
                }}>
                <View style={{ position: 'absolute', zIndex: 10, top: (WIN_SIZE.height / 2 - px2pd(1500) / 2), alignItems: 'flex-end', width: '100%' }}>
                    <AntDesign name='close' size={30} />
                </View>
            </TouchableWithoutFeedback>
            <View style={{ width: '100%', height: px2pd(1500), overflow: 'hidden' }}>
                <FarLayer />
                <View style={{ position: 'absolute', top: 0 }}>
                    <MidLayer />
                </View>
                <View style={{ position: 'absolute', top: 260 }}>
                    <NearLayer />
                </View>
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
    },
});

export default CloudAnimation;