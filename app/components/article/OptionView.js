import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';

import { TextButton } from '../../constants/custom-ui';
import lo from 'lodash';

import {
    connect,
    action,
} from "../../constants";
import Modal from '../modal';

class OptionView extends PureComponent {

    layoutHandler = (e) => {
        this.props.dispatch(action('ArticleModel/layout')({ 
            key: this.props.itemKey,
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        }));
    }

    optionPressHandler = (data) => {
        this.props.dispatch(action('SceneModel/processActions')(data));
    }

    render() {
        const buttonChilds = [];
        if (this.props.options != undefined) {
            let key = 0;
            for (let k in this.props.options) {
                const option = this.props.options[k];
                buttonChilds.push(
                    <View key={key} style={{ marginTop: 5, marginBottom: 5 }}>
                        <TextButton {...this.props} title={option.title} onPress={()=>{ 
                            this.optionPressHandler(option);
                            
                            // 一次性按钮点击后置灰
                            if (lo.isBoolean(option.once)) {
                                return ({ disabled: true });
                            }
                        }} />
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