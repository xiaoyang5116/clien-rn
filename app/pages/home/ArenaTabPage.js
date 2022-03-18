import React from 'react';

import {
    action,
    connect,
    Component,
    StyleSheet,
} from "../../constants";

import {
    RenderHTML
} from 'react-native-render-html';

import ProgressBar from '../../components/ProgressBar';
import { View, Text, FlatList } from '../../constants/native-ui';

const DATA = [
    {id: 1, msg: '<li style="color: #ffffff">你攻击了<span style="color: #46e4e9">BOSS</span>一下</li>'},
    {id: 2, msg: '<li style="color: #ffffff"><span style="color: #46e4e9">BOSS</span>打了你一下</li>'},
    {id: 3, msg: '<li style="color: #ffffff">你躲避了攻击@@</li>'},
    {id: 4, msg: '<li style="color: #ffffff"><span style="color: #46e4e9">BOSS</span>打了你一下</li>'},
    {id: 5, msg: '<li style="color: #ffffff"><span style="color: #46e4e9">BOSS</span>没命中你</li>'},
    {id: 6, msg: '<li style="color: #ffffff"><span style="color: #46e4e9">BOSS</span>打了你一下</li>'},
    {id: 7, msg: '<li style="color: #ffffff">你攻击了<span style="color: #46e4e9">BOSS</span>一下</li>'},
    {id: 8, msg: '<li style="color: #ffffff"><span style="color: #46e4e9">BOSS</span>打了你一下</li>'},
    {id: 9, msg: '<li style="color: #ffffff">你击杀了<span style="color: #46e4e9">BOSS</span></li>'},
    {id: 10, msg: '<li style="color: #ffffff">获得<span style="color: #dd6f4d">大米</span>一箩筐<span style="color: #3fde04"><strong>(100斤)</strong></span>!!!</li>'},

    {id: 11, msg: '<li style="color: #ffffff"><span style="color: #46e4e9">BOSS</span>打了你一下</li>'},
    {id: 12, msg: '<li style="color: #ffffff">你攻击了<span style="color: #46e4e9">BOSS</span>一下</li>'},
    {id: 13, msg: '<li style="color: #ffffff"><span style="color: #46e4e9">BOSS</span>打了你一下</li>'},
    {id: 14, msg: '<li style="color: #ffffff">你击杀了<span style="color: #46e4e9">BOSS</span></li>'},
    {id: 15, msg: '<li style="color: #ffffff">获得<span style="color: #dd6f4d">大米</span>一箩筐<span style="color: #3fde04"><strong>(100斤)</strong></span>!!!</li>'},

    {id: 16, msg: '<li style="color: #ffffff"><span style="color: #46e4e9">BOSS</span>打了你一下</li>'},
    {id: 17, msg: '<li style="color: #ffffff">你攻击了<span style="color: #46e4e9">BOSS</span>一下</li>'},
    {id: 18, msg: '<li style="color: #ffffff"><span style="color: #46e4e9">BOSS</span>打了你一下</li>'},
    {id: 19, msg: '<li style="color: #ffffff">你击杀了<span style="color: #46e4e9">BOSS</span></li>'},
    {id: 20, msg: '<li style="color: #ffffff">获得<span style="color: #dd6f4d">大米</span>一箩筐<span style="color: #3fde04"><strong>(100斤)</strong></span>!!!</li>'},
];

class ArenaTabPage extends Component {

    constructor(props) {
        super(props);
        this.refFlatList = React.createRef();
    }

    _alertCopper(value) {
        this.props.dispatch(action('UserModel/alertCopper')({ value: value }));
    }

    _renderPKMsg(data) {
        return (
            <View style={{ height: 28, justifyContent: 'center', margin: 5, paddingLeft: 5, borderBottomWidth: 1, borderBottomColor: '#999' }}>
                <RenderHTML contentWidth={100} source={{html: data.item.msg}} />
            </View>
            );
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={this.props.currentStyles.viewContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 100, backgroundColor: '#403340' }}>
                    <View style={{ width: 90, height: 90, marginLeft: 5, marginRight: 5, flexDirection: 'row', borderRadius: 10, justifyContent: 'center', alignItems: 'center',  backgroundColor: '#ccc' }}>
                        <Text>大BOSS</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', height: '100%' }}>
                        <View style={{ height: 20, marginTop: 6, marginRight: 6, marginBottom: 3 }}>
                            <ProgressBar percent={100} toPercent={0} duration={10000} />
                        </View>
                        <View style={{ height: 20, marginTop: 3, marginRight: 6, marginBottom: 6 }}>
                            <ProgressBar percent={100} toPercent={0} duration={6000} sections={[{x: 0, y: 100, color: '#12b7b5'}]} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#fff' }}>体力: 100</Text>
                            <Text style={{ color: '#fff' }}>灵力: 120</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#fff' }}>攻击力: 80</Text>
                            <Text style={{ color: '#fff' }}>回避: 900</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#5a5a70' }}>
                    <FlatList
                        ref={this.refFlatList}
                        data={DATA}
                        renderItem={this._renderPKMsg}
                        keyExtractor={item => item.id}
                        getItemLayout={(data, index) => (
                            {length: 28, offset: 28 * index, index}
                          )}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 100, backgroundColor: '#403340' }}>
                    <View style={{ width: 90, height: 90, marginLeft: 5, marginRight: 5, flexDirection: 'row', borderRadius: 10, justifyContent: 'center', alignItems: 'center',  backgroundColor: '#ccc' }}>
                        <Text>我是MT</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', height: '100%' }}>
                        <View style={{ height: 20, marginTop: 6, marginRight: 6, marginBottom: 3 }}>
                            <ProgressBar percent={100} toPercent={20} duration={10000} />
                        </View>
                        <View style={{ height: 20, marginTop: 3, marginRight: 6, marginBottom: 6 }}>
                            <ProgressBar percent={100} toPercent={30} duration={6000} sections={[{x: 0, y: 100, color: '#12b7b5'}]} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#fff' }}>体力: 100</Text>
                            <Text style={{ color: '#fff' }}>灵力: 120</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#fff' }}>攻击力: 80</Text>
                            <Text style={{ color: '#fff' }}>回避: 900</Text>
                        </View>
                    </View>
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
    buttonContainer: {
        width: 100,
        marginTop: 25,
    }
});

export default connect((state) => ({ ...state.AppModel, user: { ...state.UserModel } }))(ArenaTabPage);