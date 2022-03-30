import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';

import {
    connect,
    action,
} from "../../constants";

class HeaderView extends PureComponent {

    layoutHandler = (e) => {
        this.props.dispatch(action('ArticleModel/layout')({ 
            key: this.props.itemKey,
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        }));
    }

    render() {
        return (
            <View key={this.props.itemKey} style={{ marginTop: 10, marginBottom: 10 }} onLayout={this.layoutHandler}>
                <Text style={{ fontSize: 26, fontWeight: 'bold', paddingLeft: 10, paddingRight: 10 }}>{this.props.content}</Text>
            </View>
        );
    }

}

export default connect((state) => ({ ...state.ArticleModel }))(HeaderView);
