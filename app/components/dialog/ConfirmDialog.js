import React from 'react'
import { ImageBackground, Image } from 'react-native';
import RootView from '../RootView'
import lo from 'lodash';

import {
    View,
    Text,
    SafeAreaView,
} from '../../constants/native-ui';

import { TextButton } from '../../constants/custom-ui';
import { px2pd } from '../../constants/resolution';
import ImageCapInset from 'react-native-image-capinsets-next';
import FastImage from 'react-native-fast-image';
import { ThemeContext } from '../../constants';

class ConfirmDialog extends React.Component {
    static contextType = ThemeContext
    constructor(props) {
        super(props);
    }

    render() {
        const buttons = [];
        if (lo.isObject(this.props.yes) && !lo.isFunction(this.props.yes)) {
            const { title, cb } = this.props.yes;
            buttons.push(
                <TextButton key={0} title={title} style={{ width: 90 }} onPress={() => {
                    if (cb != undefined) cb();
                    this.props.onClose();
                }} />
            );
        } else {
            buttons.push(
                <TextButton key={0} title="确认" style={{ width: 90 }} onPress={() => {
                    if (this.props.yes != undefined) this.props.yes();
                    this.props.onClose();
                }} />
            );
            buttons.push(
                <TextButton key={1} title="取消" style={{ width: 90 }} onPress={() => {
                    if (this.props.no != undefined) this.props.no();
                    this.props.onClose();
                }} />
            );
        }

        return (
            <SafeAreaView style={{ flex: 1, zIndex: 999999 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: 320, justifyContent: 'center', alignItems: 'center', borderRadius: 3 }}>
                        <ImageBackground style={{ width: px2pd(899), height: px2pd(352) }} source={this.context.dialogBg_1_img}>
                            <ImageCapInset
                                style={{ width: '100%', height: '100%', position: 'absolute', }}
                                source={this.context.dialogBorder_1_img}
                                capInsets={{ top: 10, right: 10, bottom: 10, left: 10 }}
                            />
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <View style={{ marginTop: 10, marginBottom: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#000', fontSize: 20 }}>{this.props.msg}</Text>
                                </View>
                                <View style={{ height: 50, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                    {buttons}
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

export function confirm(msg, yes, no, type = 0) {
    const key = RootView.add(<ConfirmDialog msg={msg} yes={yes} no={no} onClose={() => {
        RootView.remove(key);
    }} />);
}
