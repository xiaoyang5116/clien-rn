import React from 'react';
import { View, Text, TouchableWithoutFeedback, DeviceEventEmitter, Animated } from 'react-native';

import {
    connect,
    action,
    EventKeys,
    DataContext,
} from "../../constants";

const PlainView = (props) => {
    const { readerStyle } = props
    const context = React.useContext(DataContext);

    const layoutHandler = (e) => {
        props.dispatch(action('ArticleModel/layout')({
            key: props.itemKey,
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        }));
    }

    const onPressHandler = (e) => {
        if (context.slideMoving == undefined
            || !context.slideMoving) {
            DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_PRESS, e);
        } else {
            context.slideMoving = false;
        }
    }

    const onLongPressHandler = (e) => {
        DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_LONG_PRESS, e);
    }

    return (
        <TouchableWithoutFeedback onLongPress={onLongPressHandler} onPress={onPressHandler}>
            <Animated.View key={props.itemKey} style={{ opacity: context.readerTextOpacity }} onLayout={layoutHandler} >
                <Text style={{
                    fontSize: readerStyle.contentSize,
                    color: readerStyle.color,
                    lineHeight: (readerStyle.contentSize + readerStyle.lineHeight),
                    marginTop: readerStyle.paragraphSpacing,
                    marginBottom: readerStyle.paragraphSpacing,
                    paddingLeft: readerStyle.leftPadding,
                    paddingRight: readerStyle.rightPadding,
                }}>
                    {props.content}
                </Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

export default connect((state) => ({ ...state.ArticleModel }))(PlainView);