import React, { PureComponent } from 'react';
import { View, Image } from 'react-native';

import { TextButton } from '../../constants/custom-ui';
import lo from 'lodash';

import {
    connect,
    action,
    DeviceEventEmitter,
    EventKeys,
    AppDispath,
} from "../../constants";

import { BtnIcon } from '../button'
import OptionComponents from './optionComponents'
import { ArticleOptionActions } from '.';
import { px2pd } from '../../constants/resolution';


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
        ArticleOptionActions.invoke(data, (v) => {
            // 仅在不切换章节时刷新
            if (data.toChapter == undefined) {
                this.props.dispatch(action('ArticleModel/getValidOptions')({ options: this.state.options }))
                    .then(r => {
                        this.setState({ options: r });
                    });
            }
            // 记录点击动作
            AppDispath({ type: 'StateModel/saveArticleBtnClickState', payload: data });
        });
    }

    render() {
        const buttonChilds = [];
        if (this.state.options != undefined) {
            let key = 0;
            for (let k in this.state.options) {
                const option = this.state.options[k];
                let iconComponent = <></>;
                if (lo.isObject(option.icon) && lo.isBoolean(option.icon.show) && option.icon.show) {
                    iconComponent = (
                        <View style={{ position: 'absolute', width: px2pd(100), height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <BtnIcon id={option.icon.id} style={{ position: 'relative' }} />
                        </View>
                    )
                }
                if (option.btnType !== undefined) {
                    buttonChilds.push(
                        <View key={key} style={{ marginTop: 5, marginBottom: 5 }}>
                            <OptionComponents
                                {...this.props}
                                optionData={option}
                                type={option.btnType}
                                title={option.title}
                                disabled={option.disabled}
                                onPress={() => { this.optionPressHandler(option); }}
                                sourceType={"reader"}
                                btnAnimateId={option.btnAnimateId}
                            />
                            {iconComponent}
                        </View>
                    );
                }
                if (option.btnType === undefined) {
                    buttonChilds.push(
                        <View key={key} style={{ marginTop: 5, marginBottom: 5 }}>
                            <TextButton {...this.props} title={option.title} sourceType={"reader"} btnAnimateId={option.btnAnimateId} disabled={option.disabled} onPress={() => { this.optionPressHandler(option); }} />
                            {iconComponent}
                        </View>
                    );

                }
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