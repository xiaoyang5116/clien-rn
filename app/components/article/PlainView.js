import React, { PureComponent } from 'react';
import { View, Text, TouchableWithoutFeedback, DeviceEventEmitter } from 'react-native';

import {
    connect,
    action,
    EventKeys,
    DataContext,
} from "../../constants";

class PlainView extends PureComponent {

    static contextType = DataContext;

    layoutHandler = (e) => {
        this.props.dispatch(action('ArticleModel/layout')({
            key: this.props.itemKey,
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        }));
    }

    onPressHandler = (e) => {
        if (this.context.slideMoving == undefined 
            || !this.context.slideMoving) {
            DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_PRESS, e);
        } else {
            this.context.slideMoving = false;
        }
    }

    onLongPressHandler = (e) => {
        DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_LONG_PRESS, e);
    }

    render() {
        const { readerStyle } = this.props

        return (
            <TouchableWithoutFeedback onLongPress={this.onLongPressHandler} onPress={this.onPressHandler}>
                <View key={this.props.itemKey} style={{}} onLayout={this.layoutHandler} >
                    <Text style={{
                        fontSize: readerStyle.contentSize,
                        color: readerStyle.color,
                        lineHeight: 28,
                        paddingLeft: 10,
                        paddingRight: 10
                    }}>
                        {this.props.content}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

export default connect((state) => ({ ...state.ArticleModel }))(PlainView);