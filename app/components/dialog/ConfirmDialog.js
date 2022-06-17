import React from 'react'
import RootView from '../RootView'
import lo from 'lodash';

import {
    View,
    Text,
    SafeAreaView,
} from '../../constants/native-ui';

import { TextButton } from '../../constants/custom-ui';
import ImageCapInset from 'react-native-image-capinsets-next';
import FastImage from 'react-native-fast-image';

class ConfirmDialog extends React.Component {
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
            <View style={{ width: 320, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(180,180,180, 1)', borderRadius: 3 }}>
                <ImageCapInset
                        style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.5 }}
                        source={require('../../../assets/bg/confirm_dlg_patch.png')}
                        capInsets={{ top: 10, right: 10, bottom: 10, left: 10 }}
                />
                <View style={{ width: 280, margin: 10, overflow: 'hidden' }}>
                    <ImageCapInset
                        style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.5 }}
                        source={require('../../../assets/bg/confirm_dlg_outter_patch.png')}
                        capInsets={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    />
                    <FastImage 
                        style={{ width: '100%', height: '100%', position: 'absolute', top: 80 }}
                        source={require('../../../assets/bg/panel_c.png')}
                    />
                    <View style={{ alignSelf: 'stretch', backgroundColor: 'rgba(72,72,72,0.7)' }}>
                        <View style={{ marginTop: 10, marginBottom: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff' }}>{this.props.msg}</Text>
                        </View>
                        <View style={{ height: 50, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            {buttons}
                        </View>
                    </View>
                </View>
            </View>
        </View>
        </SafeAreaView>
        );
    }
}

export function confirm(msg, yes, no) {
    const key = RootView.add(<ConfirmDialog msg={msg} yes={yes} no = {no} onClose={() => {
        RootView.remove(key);
    }} />);
}
