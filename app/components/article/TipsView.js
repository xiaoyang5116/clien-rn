import React from 'react';

import { 
    View, 
    Text,
    StyleSheet
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';

const TipsView = (props) => {

    return (
        <View style={[styles.viewContainer, { left: props.pageX, top: props.pageY }]}>
            <FastImage style={{ width: px2pd(300), height: px2pd(480) }} source={require('../../../assets/bg/baojian.png')} />
            <Text style={{ marginTop: 10, color: '#000' }}>尚方宝剑 （至高无上的皇权象征）</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        position: 'absolute', 
        zIndex: 100,  
        width: 120, 
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 10,
        backgroundColor: 'rgba(164,159,153,0.85)',
    },
});

export default TipsView;