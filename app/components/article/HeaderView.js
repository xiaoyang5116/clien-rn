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
        const { readerStyle } = this.props;
        return (
            <View key={this.props.itemKey} style={{ paddingTop: 10, paddingBottom: 10 }} onLayout={this.layoutHandler}>
                <Text style={{
                    fontSize: readerStyle.titleSize,
                    color: readerStyle.color,
                    fontWeight: 'bold',
                    paddingLeft: readerStyle.leftPadding,
                    paddingRight: readerStyle.rightPadding,
                }}>
                    {this.props.content}
                </Text>
            </View>
        );
    }

}

export default connect((state) => ({ ...state.ArticleModel }))(HeaderView);
