import React from 'react';

import {
    action,
    connect,
    Component,
    StyleSheet,
    DeviceEventEmitter,
} from "../../constants";

import { View, Text, FlatList, SafeAreaView } from '../../constants/native-ui';
import { TextButton } from '../../constants/custom-ui';
import ProgressBar from '../../components/ProgressBar';
import RootView from '../../components/RootView';
import { Image, TouchableNativeFeedback } from 'react-native';
import lo from 'lodash';

const PROPS_ICON = [
    { iconId: 1, img: require('../../../assets/props/prop_1.png') },
    { iconId: 2, img: require('../../../assets/props/prop_2.png') },
    { iconId: 3, img: require('../../../assets/props/prop_3.png') },
    { iconId: 4, img: require('../../../assets/props/prop_4.png') },
    { iconId: 5, img: require('../../../assets/props/prop_5.png') },
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

const RewardItem = (props) => {
    const icon = PROPS_ICON.find(e => e.iconId == props.iconId);
    return (
    <View style={{ flexDirection: 'column', margin: 10, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 68, height: 68 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderColor: '#ccc', borderWidth: 0, backgroundColor: '#333' }}>
                <Image source={icon.img} />
                <Text style={{ position: 'absolute', top: 53, right: 0, color: '#fff' }}>{props.num}</Text>
            </View>
        </View>
        <Text style={{ color: '#000', marginTop: 3 }}>{props.name}</Text>
    </View>
    );
}

const RewardsPage = (props) => {
    const childs = [];
    let key = 0;
    props.data.forEach(e => {
        childs.push(<RewardItem key={key++} propId={e.propId} iconId={e.iconId} num={e.num} name={e.name} />);
    });
    return (
        <TouchableNativeFeedback onPress={() => { props.onClose() }}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', opacity: 0.85 }}>
                <View>
                    <Text style={{ marginBottom: 20, color: '#ccc', fontSize: 36 }}>获得奖励</Text>
                </View>
                <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#a6c2cb' }}>
                    {childs}
                </View>
                <View>
                    <Text style={{ marginTop: 20, color: '#fff', fontSize: 20 }}>点击任意区域关闭</Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
}

// 十连抽页面
class Lottery10Times extends Component {
    constructor(props) {
        super(props);
        this.state = {
            propsInfo: [],
        };
    }

    refreshQuanNum() {
        this.props.dispatch(action('PropsModel/getPropsNum')({ propsId: [54, 55] }))
        .then(result => {
            this.setState({ propsInfo: result });
        });
    }

    componentDidMount() {
        this.refreshQuanNum();
    }

    lottery(id) {
        this.props.dispatch(action('LotteryModel/lottery')({ id }))
        .then(data => {
            if (lo.isArray(data)) {
                const key = RootView.add(<RewardsPage data={data} onClose={() => {
                    RootView.remove(key);
                    this.refreshQuanNum();
                }} />);
            }
        });
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
                        <Text style={{ marginLeft: 10, marginTop: 10, lineHeight: 20, fontWeight: 'bold' }}>白嫖券: {(this.state.propsInfo[0] != undefined) ? this.state.propsInfo[0].num : 0}</Text>
                        <Text style={{ marginLeft: 10, marginTop: 10, lineHeight: 20, fontWeight: 'bold' }}>消费券: {(this.state.propsInfo[1] != undefined) ? this.state.propsInfo[1].num : 0}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text></Text>
                    </View>
                    <View style={{ height: 200, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ marginLeft: 20, marginRight: 20 }}>
                            <TextButton title='抽1次' {...this.props} onPress={() => { this.lottery(1); }} />
                        </View>
                        <View style={{ marginLeft: 20, marginRight: 20 }}>
                            <TextButton title='抽10次' {...this.props} onPress={() => { this.lottery(2); }} />
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
        this.state = {
            boxes: [],
        };
    }

    componentDidMount() {
        this.props.dispatch(action('LotteryModel/getBoxes')({ }))
        .then(data => {
            if (lo.isArray(data)) {
                this.setState({ boxes: data });
            }
        });
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
                        data={this.state.boxes}
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