import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';

import { TextButton } from '../../constants/custom-ui';
import lo from 'lodash';

import {
    connect,
    action,
} from "../../constants";
class OptionView extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            options: this.props.options,
        }
    }

    layoutHandler = (e) => {
        this.props.dispatch(action('ArticleModel/layout')({ 
            key: this.props.itemKey,
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        }));
    }

    optionPressHandler = (data) => {
        this.props.dispatch(action('SceneModel/processActions')(data))
        .then(e => {
            // 仅在不切换章节时刷新
            if (data.toChapter == undefined) {
                this.props.dispatch(action('ArticleModel/getValidOptions')({ options: this.state.options }))
                .then(r => {
                    this.setState({ options: r });
                });
            }
        });
    }

    render() {
        const buttonChilds = [];
        if (this.state.options != undefined) {
            let key = 0;
            for (let k in this.state.options) {
                const option = this.state.options[k];
                buttonChilds.push(
                    <View key={key} style={{ marginTop: 5, marginBottom: 5 }}>
                        <TextButton {...this.props} title={option.title} disabled={option.disabled} onPress={()=>{ this.optionPressHandler(option); }} />
                    </View>
                );
                key += 1;
            }
        }
        return (
            <View key={this.props.itemKey} style={{ flexDirection: 'column', paddingLeft: 10, paddingRight: 10 }} onLayout={this.layoutHandler} >
                {buttonChilds}
            </View>
        );
    }

}

export default connect((state) => ({ ...state.AppModel, ...state.ArticleModel }))(OptionView);