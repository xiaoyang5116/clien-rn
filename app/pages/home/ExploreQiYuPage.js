import React from 'react';

import {
    action,
    connect,
    Component,
    StyleSheet,
} from "../../constants";

import { 
    View, 
    Text, 
    Image,
    FlatList, 
    SafeAreaView, 
    TouchableHighlight,
} from '../../constants/native-ui';

import { TextButton } from '../../constants/custom-ui';

const DATA = [
    { id: 1, title: '奇遇事件1' },
    { id: 2, title: '奇遇事件2' },
    { id: 3, title: '奇遇事件3' },
]

// 探索奇遇页面
class ExploreQiYuPage extends Component {

    constructor(props) {
        super(props);
    }

    renderItem = (data) => {
        const item = data.item;
        return (
        <TouchableHighlight activeOpacity={0.85} underlayColor='#666' onPress={() => {}} style={{ margin: 5 }} >
            <View style={{ height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderColor: '#999', borderWidth: 1, backgroundColor: '#ddd' }}>
                <Text>{item.title}</Text>
            </View>
        </TouchableHighlight>
        );
    }

    render() {
        return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <View>
                <Text style={{ marginBottom: 20, color: '#ccc', fontSize: 36 }}>奇遇</Text>
            </View>
            <View style={{ width: '90%', height: 550, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#a6c2cb' }}>
                <FlatList 
                    style={{ alignSelf: 'stretch' }}
                    data={DATA}
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

export default connect((state) => ({ ...state.ExploreModel, ...state.AppModel }))(ExploreQiYuPage);