import React from 'react';

import { 
    View, 
    Text, 
    TouchableWithoutFeedback, 
    DeviceEventEmitter, 
    Animated, 
    Linking 
} from 'react-native';

import RenderHTML from 'react-native-render-html';

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

    const css = [];
    css.push(`font-size: ${readerStyle.contentSize}px`);
    css.push(`margin-top: ${readerStyle.paragraphSpacing}px`);
    css.push(`margin-bottom: ${readerStyle.paragraphSpacing}px`);
    css.push(`padding-left: ${readerStyle.leftPadding}px`);
    css.push(`padding-right: ${readerStyle.rightPadding}px`);
    css.push(`line-height: ${readerStyle.contentSize + readerStyle.lineHeight}px`);
    css.push(`color: ${readerStyle.color}`);

    const html = `<pre style="${css.join(';')}">${props.content}</pre>`;

    return (
        <TouchableWithoutFeedback onLongPress={onLongPressHandler} onPress={onPressHandler}>
            <Animated.View key={props.itemKey} style={{ opacity: context.readerTextOpacity }} onLayout={layoutHandler} >
                {/* <Text style={{
                    fontSize: readerStyle.contentSize,
                    color: readerStyle.color,
                    lineHeight: (readerStyle.contentSize + readerStyle.lineHeight),
                    marginTop: readerStyle.paragraphSpacing,
                    marginBottom: readerStyle.paragraphSpacing,
                    paddingLeft: readerStyle.leftPadding,
                    paddingRight: readerStyle.rightPadding,
                }}>
                    {props.content}
                </Text> */}
                <RenderHTML 
                    renderersProps={{
                        a: {
                            onPress: (evt, href) => {
                                Linking.openURL(href);
                            }
                        }
                    }}
                    contentWidth={10} 
                    source={{ html }} 
                />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

export default connect((state) => ({ ...state.ArticleModel }))(PlainView);