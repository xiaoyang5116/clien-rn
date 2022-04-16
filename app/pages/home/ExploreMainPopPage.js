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
import { Animated, Easing } from 'react-native';

const DATA = [
    { id: 1, title: 'aaaaa' },
    { id: 2, title: 'bbbbb' },
    { id: 3, title: 'ccccc' },
];

class ExploreMainPopPage extends Component {

    constructor(props) {
        super(props);
        this.bannerLeftValue = new Animated.Value(100);
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

    componentDidMount() {
        Animated.timing(this.bannerLeftValue, {
            toValue: -1000,
            duration: 50000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
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
                    <View style={{ flexDirection: 'row', borderColor: '#999', borderWidth: 1, backgroundColor: '#ddd', overflow: 'hidden', marginLeft: 10, marginRight: 10, height: 60, justifyContent: 'space-around', alignItems: 'center' }} >
                        <Animated.View style={{ position: 'absolute', left: this.bannerLeftValue, top: 0 }}>
                            <View style={[styles.mxPoint, { left:  0, }]}><Text>0</Text></View>
                            <View style={[styles.mxPoint, { left: 40, }]}><Text>1</Text></View>
                            <View style={[styles.mxPoint, { left: 80, }]}><Text>2</Text></View>
                            <View style={[styles.mxPoint, { left: 120, }]}><Text>3</Text></View>
                            <View style={[styles.mxPoint, { left: 160, }]}><Text>4</Text></View>
                            <View style={[styles.mxPoint, { left: 200, }]}><Text>5</Text></View>
                            <View style={[styles.mxPoint, { left: 240, }]}><Text>6</Text></View>
                            <View style={[styles.mxPoint, { left: 280, }]}><Text>7</Text></View>
                            <View style={[styles.mxPoint, { left: 320, }]}><Text>8</Text></View>
                            <View style={[styles.mxPoint, { left: 360, }]}><Text>9</Text></View>
                            <View style={[styles.mxPoint, { left: 400, }]}><Text>10</Text></View>
                            <View style={[styles.mxPoint, { left: 440, }]}><Text>11</Text></View>
                            <View style={[styles.mxPoint, { left: 480, }]}><Text>12</Text></View>
                            <View style={[styles.mxPoint, { left: 520, }]}><Text>13</Text></View>
                            <View style={[styles.mxPoint, { left: 560, }]}><Text>14</Text></View>
                            <View style={[styles.mxPoint, { left: 600, }]}><Text>15</Text></View>
                            <View style={[styles.mxPoint, { left: 640, }]}><Text>16</Text></View>
                            <View style={[styles.mxPoint, { left: 680, }]}><Text>17</Text></View>
                            <View style={[styles.mxPoint, { left: 720, }]}><Text>18</Text></View>
                            <View style={[styles.mxPoint, { left: 760, }]}><Text>19</Text></View>
                            <View style={[styles.mxPoint, { left: 800, }]}><Text>20</Text></View>
                        </Animated.View>
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
    mxPoint: {
        position: 'absolute', left: 330, top: 20,
        width: 20, height: 20, borderColor: '#666', borderWidth: 1, justifyContent: 'center', alignItems: 'center',
    }
});

export default connect((state) => ({ ...state.ExploreModel, ...state.AppModel }))(ExploreMainPopPage);