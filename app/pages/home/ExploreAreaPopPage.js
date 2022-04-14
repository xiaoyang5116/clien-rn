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
    Image, 
    TouchableWithoutFeedback 
} from '../../constants/native-ui';

import { TextButton } from '../../constants/custom-ui';
import ProgressBar from '../../components/ProgressBar';
import FastImage from 'react-native-fast-image';

const DATA = [
    [{ id: 1, title: '新手村', desc: '新手村新手村新手村新手村新手村新手村' }, { id: 2, title: '邻家树林', desc: '邻家树林邻家树林邻家树林邻家树林邻家树林' }],
    [{ id: 3, title: '隔壁山上', desc: '隔壁山上隔壁山上隔壁山上隔壁山上隔壁山上' }, { id: 4, title: '隔壁后院', desc: '隔壁后院隔壁后院隔壁后院隔壁后院隔壁后院隔壁后' }],
    [{ id: 5, title: '隔壁屋顶', desc: '隔壁屋顶隔壁屋顶隔壁屋顶隔壁屋顶隔壁屋顶' }, { id: 6, title: '隔壁床下', desc: '隔壁床下隔壁床下隔壁床下隔壁床下隔壁床下隔壁床下' }],
];

const AreaBlock = (props) => {
    const [ selected, onSelected ] = useState(false);

    useEffect(() => {
        const listener = DeviceEventEmitter.addListener('AreaBlock.selected', (payload) => {
            if (payload.id == props.item.id) {
                onSelected(true);
            } else {
                onSelected(false);
            }
        });
        return () => {
            listener.remove();
        };
    });

    return (
        <TouchableWithoutFeedback onPress={() => {
            DeviceEventEmitter.emit('AreaBlock.selected', props.item);
            props.onSelected();
        }}>
        <View style={{ width: 150, height: 100, borderColor: '#666', borderWidth: 1, backgroundColor: '#e0f6ff', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#669900', width: '90%', height: 35, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{props.item.title}</Text>
            </View>
            <View style={{ height: 24, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ lineHeight: 24, fontSize: 12 }}>探索度</Text>
            </View>
            <View style={{ width: '80%', height: 15 }}>
                <ProgressBar percent={60} sections={[{x: 0, y: 100, color: '#12b7b5'}]} />
                <View style={{ position: 'absolute', top: -2, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#fff' }}>50/100</Text>
                </View>
            </View>
            {
            (selected)
            ? (<FastImage style={{ position: 'absolute', bottom: -9, right: -3, width: 35, height: 35 }} source={require('../../../assets/button_icon/1.png')} />)
            : <></>
            }
        </View>
        </TouchableWithoutFeedback>
    );
}

class ExplorePopPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            desc: '请选择区域',
        };
    }

    renderItem = (data) => {
        const item = data.item;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 10, marginBottom: 10 }} >
                <AreaBlock item={item[0]} onSelected={() => {
                    this.setState({ desc: item[0].desc });
                }} />
                <AreaBlock item={item[1]} onSelected={() => {
                    this.setState({ desc: item[1].desc });
                }} />
            </View>
        );
    }

    render() {
        return (
            <FastImage style={{ flex: 1 }} source={require('../../../assets/explore_bg.jpg')} >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 30, margin: 15 }}>世界探索</Text>
                    </View>
                    <View style={{ borderColor: '#999', borderWidth: 1, backgroundColor: '#eee', margin: 10, height: 100 }}>
                        <Text style={{ fontSize: 14, color: '#999', lineHeight: 28, margin: 5 }}>{this.state.desc}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                          style={{ alignSelf: 'stretch', margin: 10 }}
                          data={DATA}
                          renderItem={this.renderItem}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', height: 80, justifyContent: 'space-around', alignItems: 'center' }} >
                        <TextButton {...this.props} title={'返回'} onPress={() => {
                            this.props.onClose();
                        }} />
                        <TextButton {...this.props} title={'开始探索'} onPress={() => {
                            this.props.onClose();
                        }} />
                        <TextButton {...this.props} title={'调整补给'} disabled={true} />
                    </View>
                </View>
            </SafeAreaView>
            </FastImage>
        );
    }
}

const styles = StyleSheet.create({
});

export default connect((state) => ({ ...state.ExploreModel, ...state.AppModel }))(ExplorePopPage);