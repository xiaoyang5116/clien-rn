import React from 'react';

import {
    connect,
    Component,
    StyleSheet,
    AppDispath,
} from "../../../constants";

import {
    View,
    Text,
    FlatList,
    TouchableHighlight,
} from '../../../constants/native-ui';
import Modal from '../../../components/modal';

import { TextButton } from '../../../constants/custom-ui';

// 探索寻宝页面
class ExploreXunBaoPage extends Component {

    constructor(props) {
        super(props);
    }

    renderItem = (data) => {
        const item = data.item;
        return (
            <TouchableHighlight activeOpacity={0.85} underlayColor='#666' style={{ margin: 5 }} onPress={() => {
                // AppDispath({ type: 'ExploreModel/toXunBao', payload: item });
                Modal.show(item.xunbao);
                this.props.onClose();
            }} >
                <View style={{ height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderColor: '#999', borderWidth: 1, backgroundColor: '#ddd' }}>
                    <Text>寻宝事件</Text>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)' }}>
                <View>
                    <Text style={{ marginBottom: 20, color: '#ccc', fontSize: 36 }}>寻宝</Text>
                </View>
                <View style={{ width: '90%', height: 550, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#a6c2cb' }}>
                    <FlatList
                        style={{ alignSelf: 'stretch' }}
                        data={this.props.event_xunbao}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <TextButton title={'返回'} {...this.props} onPress={() => { this.props.onClose(); }} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
});

export default connect((state) => ({ ...state.ExploreModel, ...state.AppModel }))(ExploreXunBaoPage);