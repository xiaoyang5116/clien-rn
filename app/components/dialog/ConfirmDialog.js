import React from 'react'
import RootView from '../RootView'

import {
    View,
    Text,
    SafeAreaView,
} from '../../constants/native-ui';

import { TextButton } from '../../constants/custom-ui';
import ImageCapInset from 'react-native-image-capinsets-next';

class ConfirmDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 320, backgroundColor: 'rgba(102,102,102, 0.9)', borderRadius: 3 }}>
                <ImageCapInset
                        style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.5 }}
                        source={require('../../../assets/bg/confirm_dlg_outter_patch.png')}
                        capInsets={{ top: 20, right: 20, bottom: 20, left: 20 }}
                />
                <View style={{ width: 300, margin: 10 }}>
                    <ImageCapInset
                        style={{ width: '100%', height: '100%', position: 'absolute', opacity: 1 }}
                        source={require('../../../assets/bg/confirm_dlg_patch.png')}
                        capInsets={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    />
                    <View style={{ alignSelf: 'stretch', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                        <View style={{ marginTop: 10, marginBottom: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff' }}>{this.props.msg}</Text>
                        </View>
                        <View style={{ height: 50, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <TextButton title="确认" onPress={() => { 
                                if (this.props.yes != undefined) this.props.yes();
                                this.props.onClose();
                            }} />
                            <TextButton title="取消" onPress={() => {
                                if (this.props.no != undefined) this.props.no();
                                this.props.onClose();
                            }} />
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
