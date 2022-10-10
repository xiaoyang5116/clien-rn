import React from 'react';
import PropTypes from 'prop-types';
import lo from 'lodash';

import {
    View,
    Animated,
} from 'react-native';

import { px2pd } from '../../constants/resolution';

const NumberItem = (props) => {
    
    return (
        <View style={{ width: px2pd(30), height: px2pd(46), overflow: 'hidden' }}>
            <Animated.Image 
                source={require('../../../assets/animations/number.png')} 
                style={{ width: px2pd(300), height: px2pd(46), transform: [{ translateX: -px2pd(30) * props.value }] }} 
            />
        </View>
    )
}

NumberItem.propTypes = {
    value: PropTypes.number,
}

NumberItem.defaultProps = {
    value: 0,
}

const NumberString = (props) => {
    const numbers = [];
    for (let i = 0; i < props.value.length; i++) {
        const char = props.value[i];
        numbers.push(parseInt(char));
    }
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {lo.map(numbers, (v, k) => { return <NumberItem key={k} value={v} /> })}
        </View>
    )
}

NumberString.propTypes = {
    value: PropTypes.string,
}

NumberString.defaultProps = {
    value: '666',
}

export default NumberString;