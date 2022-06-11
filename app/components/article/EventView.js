import React from 'react';

import { 
    View, 
    StyleSheet, 
    DeviceEventEmitter 
} from 'react-native';

import lo from 'lodash';

import {
    connect,
    action,
    EventKeys,
} from "../../constants";

const EventView = (props) => {
    const layoutHandler = (e) => {
        props.dispatch(action('ArticleModel/layout')({ 
            key: props.itemKey,
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        }));
    }

    React.useEffect(() => {
        const { backgroundImage } = props;
        if (lo.isString(backgroundImage)) {
            DeviceEventEmitter.emit(EventKeys.READER_BACKGROUND_IMG_UPDATE, backgroundImage);
        }
    }, []);

    return (
        <View key={props.itemKey} style={styles.debugView} onLayout={layoutHandler} >
            {/* <Text style={{ fontSize: 20, paddingLeft: 10, paddingRight: 10 }}>{this.props.content}</Text> */}
        </View>
    );
}

const styles = StyleSheet.create({
    debugView: {
        width: '100%', 
        height: 10, 
        backgroundColor: '#669900'
    }
});

export default connect((state) => ({ ...state.ArticleModel }))(EventView);