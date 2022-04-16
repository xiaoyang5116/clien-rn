import React, { useEffect, useState } from 'react';

import {
    connect,
    Component,
    StyleSheet,
    DeviceEventEmitter,
} from "../../constants";

import { 
    View, 
    Text, 
    FlatList, 
    SafeAreaView, 
    TouchableWithoutFeedback 
} from '../../constants/native-ui';

import { TextButton } from '../../constants/custom-ui';
import ProgressBar from '../../components/ProgressBar';
import FastImage from 'react-native-fast-image';
import Toast from '../../components/toast';

const DATA = [
    { id: 1, title: 'aaaaa' },
    { id: 2, title: 'bbbbb' },
    { id: 3, title: 'ccccc' },
];

class ExploreMainPopPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    renderItem = (data) => {
        const item = data.item;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 10, marginBottom: 10 }} >
                <Text>{item.title}</Text>
            </View>
        );
    }

    render() {
        return (
            <FastImage style={{ flex: 1 }} source={require('../../../assets/explore_bg.jpg')} >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'flex-start', alignItems: 'center' }} >
                        <Text style={styles.textBox}>地图名</Text>
                    </View>
                    <View style={{ flexDirection: 'column', borderColor: '#999', borderWidth: 1, backgroundColor: '#ddd', margin: 10, height: 160, justifyContent: 'center', alignItems: 'center' }} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>背景图</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%',  height: 60, justifyContent: 'space-around', alignItems: 'center' }} >
                            <View style={styles.eventBox}>
                                <Text>寻宝</Text>
                            </View>
                            <View style={styles.eventBox}>
                                <Text>战斗</Text>
                            </View>
                            <View style={styles.eventBox}>
                                <Text>线索</Text>
                            </View>
                            <View style={styles.eventBox}>
                                <Text>奇遇</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginBottom: 10, justifyContent: 'flex-start', alignItems: 'center' }} >
                        <Text style={styles.textBox}>地区名称</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginBottom: 10, justifyContent: 'flex-start', alignItems: 'center' }} >
                        <Text style={styles.textBox}>探索度 100/100</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'flex-start', alignItems: 'center' }} >
                        <Text style={styles.textBox}>补给[预留位置]</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                          style={{ alignSelf: 'stretch', margin: 10, borderColor: '#999', borderWidth: 1, backgroundColor: '#fff' }}
                          data={DATA}
                          renderItem={this.renderItem}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', borderColor: '#999', borderWidth: 1, backgroundColor: '#ddd', marginLeft: 10, marginRight: 10, height: 60, justifyContent: 'space-around', alignItems: 'center' }} >
                        <Text>搜索进度</Text>
                    </View>
                    <View style={{ flexDirection: 'row', height: 80, justifyContent: 'space-around', alignItems: 'center' }} >
                        <TextButton {...this.props} title={'预留'} onPress={() => {
                        }} />
                        <TextButton {...this.props} title={'储物袋'} onPress={() => {
                            this.props.onClose();
                        }} />
                        <TextButton {...this.props} title={'预留'} onPress={() => {
                        }} />
                    </View>
                    <View style={{ flexDirection: 'row', height: 60, justifyContent: 'space-around', alignItems: 'center' }} >
                        <TextButton {...this.props} title={'结束探索'} onPress={() => {
                            this.props.onClose();
                        }} />
                        <TextButton {...this.props} title={'加速'} onPress={() => {
                            this.props.onClose();
                        }} />
                        <TextButton {...this.props} title={'全部加速'} onPress={() => {
                            this.props.onClose();
                        }} />
                    </View>
                </View>
            </SafeAreaView>
            </FastImage>
        );
    }
}

const styles = StyleSheet.create({
    eventBox: {
        width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderColor: '#999', borderWidth: 1, backgroundColor: '#eee',
    },
    textBox: {
        borderColor: '#999', borderWidth: 1, backgroundColor: '#ddd', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5,
    },
});

export default connect((state) => ({ ...state.ExploreModel, ...state.AppModel }))(ExploreMainPopPage);