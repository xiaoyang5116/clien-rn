import React from 'react';
import PropTypes from 'prop-types';

import {
    View,
} from '../../constants/native-ui';

import { 
    Animated,
} from 'react-native';

export default class ColorScreenTransition extends React.Component {

    constructor(props) {
        super(props);
        this.state = { pointerEvents: 'auto' };
        this.opacity = new Animated.Value(1);
    }

    trans() {
        Animated.timing(this.opacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
        }).start((r) => {
            const { finished } = r;
            if (finished) {
                this.setState({ pointerEvents: 'none' });
            }
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.props.children}
                <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: this.props.color, opacity: this.opacity }} pointerEvents={this.state.pointerEvents} />
            </View>
        )
    }
}

ColorScreenTransition.propTypes = {
    color: PropTypes.string,
};

ColorScreenTransition.defaultProps = {
    color: '#fff',
};