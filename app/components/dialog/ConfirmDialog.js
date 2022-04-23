import React from 'react'
import RootView from '../RootView'

import {
    View,
    Text,
    SafeAreaView,
} from '../../constants/native-ui';

import { TextButton } from '../../constants/custom-ui';

class ConfirmDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 300, backgroundColor: 'rgba(0,0,0,0.85)' }}>
                <View style={{ marginTop: 10, marginBottom: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#fff' }}>{this.props.msg}</Text>
                </View>
                <View style={{ height: 50, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    <TextButton title="确认" onPress={() => { 
                        this.props.yes();
                        this.props.onClose();
                    }} />
                    <TextButton title="取消" onPress={() => { 
                        this.props.no(); 
                        this.props.onClose();
                    }} />
                </View>
            </View>
        </View>
        </SafeAreaView>
        );
    }
}

export default function confirm(msg, yes, no) {
    const key = RootView.add(<ConfirmDialog msg={msg} yes={yes} no = {no} onClose={() => {
        RootView.remove(key);
    }} />);
}
