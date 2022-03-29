import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';

import {
    connect,
    action,
} from "../../constants";

class PlainView extends PureComponent {

    layoutHandler = (e) => {
        this.props.dispatch(action('ArticleModel/layout')({ 
            key: this.props.itemKey,
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        }));
    }

    render() {
        return (
            <View style={{ }} onLayout={this.layoutHandler} >
                <Text style={{ fontSize: 20, lineHeight: 28, paddingLeft: 10, paddingRight: 10 }}>{this.props.content}</Text>
            </View>
        );
    }

}

export default connect((state) => ({ ...state.ArticleModel }))(PlainView);