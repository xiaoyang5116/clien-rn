import React from 'react';
import { View, Text, Animated } from 'react-native';

import {
    connect,
    action,
    DataContext,
} from "../../constants";

import { TouchableWithoutFeedback } from 'react-native';
import { ArticleOptionActions } from '.';

const PlainOption = (props) => {
    const { option, readerStyle } = props
    const context = React.useContext(DataContext);
    const bgOpacity = React.useRef(new Animated.Value(0)).current;

    const optionPressHandler = (data) => {
        ArticleOptionActions.invoke(data);
        Animated.sequence([
            Animated.timing(bgOpacity, {
                toValue: 1,
                duration: 180,
                useNativeDriver: false,
            }),
            Animated.timing(bgOpacity, {
                toValue: 0,
                duration: 180,
                useNativeDriver: false,
            }),
        ]).start();
    }

    return (
    <TouchableWithoutFeedback onPress={()=>{ optionPressHandler(option); }}>
        <Animated.View style={{ opacity: context.readerTextOpacity }}>
            <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#9d958b', opacity: bgOpacity }} />
            <Text style={{
                fontSize: readerStyle.contentSize,
                color: readerStyle.color,
                lineHeight: (readerStyle.contentSize + readerStyle.lineHeight),
                marginTop: readerStyle.paragraphSpacing,
                marginBottom: readerStyle.paragraphSpacing,
                paddingLeft: readerStyle.leftPadding,
                paddingRight: readerStyle.rightPadding,
            }}>
                {option.title}
            </Text>
        </Animated.View>
    </TouchableWithoutFeedback>
    )
}

const PlainOptionView = (props) => {

    const { readerStyle } = props
    const context = React.useContext(DataContext);
    const [ options, setOptions ] = React.useState(props.options);
    const bgOpacity = React.useRef(new Animated.Value(0)).current;

    const layoutHandler = (e) => {
        props.dispatch(action('ArticleModel/layout')({ 
            key: props.itemKey,
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        }));
    }

    const buttonChilds = [];
    if (options != undefined) {
        let key = 0;
        for (let k in options) {
            const option = options[k];
            buttonChilds.push(
                <PlainOption key={key} option={option} {...props} />
            );
            key += 1;
        }
    }

    return (
        <View key={props.itemKey} style={{ flexDirection: 'column', paddingLeft: 10, paddingRight: 10 }} onLayout={layoutHandler} >
            {buttonChilds}
        </View>
    );
}

export default connect((state) => ({ ...state.AppModel, ...state.ArticleModel }))(PlainOptionView);