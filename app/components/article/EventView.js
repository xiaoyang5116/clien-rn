import React from 'react';

import { 
    View, 
    StyleSheet, 
} from 'react-native';

import {
    connect,
    action,
} from "../../constants";

const EventView = (props) => {
    const layoutHandler = (e) => {
        props.dispatch(action('ArticleModel/layout')({ 
            key: props.itemKey,
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        }));
    }

    return (
        <View key={props.itemKey} style={{}} onLayout={layoutHandler} >
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