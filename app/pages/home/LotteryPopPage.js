import React from 'react';

import {
    connect,
    Component,
    StyleSheet,
    DeviceEventEmitter,
} from "../../constants";

import { View, Text, FlatList, SafeAreaView } from '../../constants/native-ui';
import { TextButton } from '../../constants/custom-ui';
import ProgressBar from '../../components/ProgressBar';

const DATA = [
    [{ id: 1, title: '天地宝箱', reqNum: 100, currentNum: 70 },],
    [{ id: 2, title: '时光宝箱', reqNum: 120, currentNum: 100 }, { id: 3, title: '岁月宝箱', reqNum: 120, currentNum: 300 },],
    [{ id: 4, title: '采药宝箱', reqNum: 150, currentNum: 400 }, { id: 5, title: '炼丹宝箱', reqNum: 150, currentNum: 80 },],
    [{ id: 6, title: '穿越宝箱', reqNum: 200, currentNum: 500 }, { id: 7, title: '复活宝箱', reqNum: 200, currentNum: 150 },],
];

// 宝藏箱子组件
const Box = (props) => {
    const percent = (props.currentNum >= props.reqNum) ? 100 : Math.ceil((props.currentNum / props.reqNum) * 100);
    return (
    <View style={{ width: 160, height: 100, borderColor: '#666', borderWidth: 1 }}>
        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0f6ff' }} >
            <Text>{props.title}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#fff' }} >
            <View style={{ flex: 1, marginLeft: 10, marginRight: 10, marginTop: 8, marginBottom: 8 }}>
                <ProgressBar percent={percent} sections={[{x: 0, y: 100, color: '#12b7b5'}]} />
            </View>
            <View style={{ position: 'absolute', top: 7, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff' }}>{props.currentNum}/{props.reqNum}</Text>
            </View>
        </View>
    </View>
    );
};

// 底部工具栏
const BottomBar = (props) => {
    return (
    <View style={{ height: 80, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-around' }}>
        <View style={{ width: 100, marginTop: 10, marginLeft: 20, marginRight: 30, backgroundColor: '#000' }}>
            <TextButton title='返回' {...props} onPress={() => {
                props.onClose();
            }} />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <View style={{ marginLeft: 10, marginRight: 10 }}>
                <TextButton title='十连抽' {...props} onPress={() => {
                    DeviceEventEmitter.emit('LotteryPopPage.showView', 'Lottery10Times');
                }} />
            </View>
            <View style={{ marginLeft: 10, marginRight: 10 }}>
                <TextButton title='宝藏' {...props} onPress={() => {
                    DeviceEventEmitter.emit('LotteryPopPage.showView', 'LotteryBaoZang');
                }} />
            </View>
        </View>
    </View>
    );
}

// 十连抽页面
class Lottery10Times extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>十连抽</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 10, marginTop: 10, lineHeight: 20, fontWeight: 'bold' }}>消费券: {this.props.prop1Num}</Text>
                        <Text style={{ marginLeft: 10, marginTop: 10, lineHeight: 20, fontWeight: 'bold' }}>白嫖券: {this.props.prop2Num}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text>背景展示</Text>
                    </View>
                    <View style={{ height: 200, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ marginLeft: 20, marginRight: 20 }}>
                            <TextButton title='抽1次' {...this.props} />
                        </View>
                        <View style={{ marginLeft: 20, marginRight: 20 }}>
                            <TextButton title='抽10次' {...this.props} />
                        </View>
                    </View>
                    <BottomBar {...this.props} />
                </View>
            </SafeAreaView>
            </>
        );
    }
}

// 宝藏页面
class LotteryBaoZang extends Component {
    constructor(props) {
        super(props);
    }

    renderItem = (data) => {
        const item = data.item;
        const boxs = [];
        item.forEach(e => {
            boxs.push(<Box key={e.id} {...e} />);
        });
        return (
        <View style={{ height: 100, flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, marginBottom: 10 }} >
            {boxs}
        </View>
        );
    }

    render() {
        return (
            <>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f6efe5' }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>宝藏</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <FlatList
                        style={{ alignSelf: 'stretch', margin: 10 }}
                        data={DATA}
                        renderItem={this.renderItem}
                        />
                    </View>
                    <BottomBar {...this.props} />
                </View>
            </SafeAreaView>
            </>
        );
    }
}

// 抽奖弹出页
class LotteryPopPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            type: 'Lottery10Times',
        };

        this.eventListener = null;
    }

    showView(type) {
        this.setState({ type });
    }

    componentDidMount() {
        this.eventListener = DeviceEventEmitter.addListener('LotteryPopPage.showView', (type) => {
            this.showView(type);
        });
    }

    componentWillUnmount() {
        this.eventListener.remove();
    }

    render() {
        let subView = null;
        switch (this.state.type) {
            case 'Lottery10Times':
                subView = <Lottery10Times {...this.props} />
                break;
            case 'LotteryBaoZang':
                subView = <LotteryBaoZang {...this.props} />
                break;
            default:
                subView = <Lottery10Times {...this.props} />
                break;
        }
        return (<>{subView}</>);
    }
}

const styles = StyleSheet.create({
});

export default connect((state) => ({ ...state.LotteryModel, ...state.AppModel }))(LotteryPopPage);