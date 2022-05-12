import React, { PureComponent } from 'react';
import { View, Image } from 'react-native';

import { TextButton } from '../../constants/custom-ui';
import lo from 'lodash';

import {
    connect,
    action,
} from "../../constants";

import RootView from '../../components/RootView';
import OptionsPage from '../../pages/OptionsPage';

const ICONS = [
    { id: 1, img: require('../../../assets/button_icon/1.png'), top: 0, left: 10 },
    { id: 2, img: require('../../../assets/button_icon/2.png'), top: -1, left: 10 },
    { id: 3, img: require('../../../assets/button_icon/3.png'), top: 0, left: 10 },
    { id: 4, img: require('../../../assets/button_icon/4.png'), top: 0, left: 10 },
    { id: 5, img: require('../../../assets/button_icon/5.png'), top: 0, right: 0 },
];

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
            // 如果是切换场景，显示选项页面
            if (data.toScene != undefined) {
                const key = RootView.add(<OptionsPage onClose={() => {
                    RootView.remove(key);
                  }} />);
            }
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
                    const icon = ICONS.find(e => e.id == option.icon.id);
                    const attrs = {};
                    if (icon.top != undefined) attrs.top = icon.top;
                    if (icon.left != undefined) attrs.left = icon.left;
                    if (icon.right != undefined) attrs.right = icon.right;

                    iconComponent = (<View style={{ position: 'absolute', height: 5, ...attrs }}>
                                        <Image source={icon.img} style={{ width: 30, height: 30 }} />
                                    </View>);
                }
                buttonChilds.push(
                    <View key={key} style={{ marginTop: 5, marginBottom: 5 }}>
                        <TextButton {...this.props} title={option.title} disabled={option.disabled} onPress={()=>{ this.optionPressHandler(option); }} />
                        {iconComponent}
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