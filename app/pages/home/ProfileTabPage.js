import React from 'react';

import {
    action,
    connect,
    Component,
    StyleSheet,
} from "../../constants";

import { View, Text, FlatList } from '../../constants/native-ui';
import { TextButton } from '../../constants/custom-ui';
import * as DateTime from '../../utils/DateTimeUtils';

class ProfileTabPage extends Component {

    constructor(props) {
        super(props);
    }

    _onClearArchive() {
        this.props.dispatch(action('AppModel/clearArchive')());
    }

    _onChangeTheme(themeId) {
        if (themeId >= 0) {
            this.props.dispatch(action('AppModel/changeTheme')({ themeId: themeId }));
        }
    }

    _onArchive() {
        this.props.dispatch(action('AppModel/archive')({ title: '手动存档' }));
    }

    _renderItem = (data) => {
        const item = data.item;
        return (
            <View style={{ width: '100%', height: 50, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
                            marginTop: 5, marginBottom: 5, borderColor: '#999', borderWidth: 1, backgroundColor: '#ddd' }}>
                <Text style={{ width: 60, textAlign: 'center' }}>ID：{item.id}</Text>
                <Text style={{ flex: 1, paddingLeft: 5, color: '#669900' }}>{item.desc.title}</Text>
                <Text style={{ width: 160, textAlign: 'center' }}>{DateTime.format(item.dt, 'yyyy-MM-dd hh:mm:ss')}</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={this.props.currentStyles.viewContainer}>
                <View style={{ alignSelf: 'stretch', flexDirection: 'row', backgroundColor: '#ddd' }}>
                    <Text style={{ lineHeight: 20, fontWeight: 'bold', margin: 10 }}>存档列表:</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', padding: 10 }}>
                    <FlatList
                        data={this.props.archiveList}
                        renderItem={this._renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View style={{ margin: 10, paddingTop: 10, paddingBottom: 10, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', 
                    borderColor: '#999', borderWidth: 1, backgroundColor: '#ede7db' }}>
                    <Text>状态:</Text>
                    <TextButton {...this.props} title="存档" onPress={() => { this._onArchive() }} />
                    <TextButton {...this.props} title="清档" onPress={() => { this._onClearArchive() }} />
                </View>
                <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 20, paddingTop: 10, paddingBottom: 10, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', 
                    borderColor: '#999', borderWidth: 1, backgroundColor: '#ede7db' }}>
                    <Text>选择风格：</Text>
                    <TextButton {...this.props} title="白天模式" onPress={() => { this._onChangeTheme(0) }} />
                    <TextButton {...this.props} title="夜晚模式" onPress={() => { this._onChangeTheme(1) }} />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    logo: {
        width: 80,
        height: 80
    },
});

export default connect((state) => ({ ...state.AppModel }))(ProfileTabPage);