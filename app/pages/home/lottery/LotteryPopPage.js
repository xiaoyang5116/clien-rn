import React from 'react';
import { ImageBackground } from 'react-native'

import {
    action,
    connect,
    Component,
    StyleSheet,
    DeviceEventEmitter,
    EventKeys,
    ThemeContext,
} from "../../../constants";

import {
    View,
    Text,
    FlatList,
    SafeAreaView,
    Image,
    TouchableWithoutFeedback
} from '../../../constants/native-ui';

import { TextButton, ImageButton, Header1 } from '../../../constants/custom-ui';
import ProgressBar from '../../../components/ProgressBar';
import RootView from '../../../components/RootView';
import PropGrid from '../../../components/prop/PropGrid';
import FastImage from 'react-native-fast-image';
import lo from 'lodash';

// 点击宝箱二次确认框
const BoxConfirmDialog = (props) => {
    const theme = React.useContext(ThemeContext)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <View style={{ width: '90%', height: 440, borderColor: '#999', borderWidth: 1, backgroundColor: '#fff' }}>
                    <Image style={{ width: "100%", height: "100%", position: 'absolute' }} source={theme.blockBg_6_img} />
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ lineHeight: 80, fontSize: 32, fontWeight: 'bold' }}>{props.title}</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 160, height: 100, borderColor: '#666', borderWidth: 1 }}>
                            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0f6ff' }} >
                                <Text>{props.title}</Text>
                            </View>
                            <View style={{ flex: 1, backgroundColor: '#fff' }} >
                                <View style={{ position: 'absolute', top: 7, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#000' }}>{props.currentNum}/{props.reqNum}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 100, margin: 10, height: 100, justifyContent: 'space-evenly' }}>
                        {
                            // 默认抽一次
                            (props.maxTimes > 0)
                                ?
                                (
                                    <TextButton {...props} title='开启1次' onPress={() => {
                                        props.dispatch(action('LotteryModel/lottery')({ id: props.id, times: 1 }))
                                            .then(data => {
                                                if (lo.isArray(data)) {
                                                    const key = RootView.add(<RewardsPage data={data} onClose={() => {
                                                        RootView.remove(key);
                                                    }} />);
                                                }
                                                props.onClose();
                                            });
                                    }} />
                                )
                                : (<TextButton {...props} title='数量不足' disabled={true} />)
                        }
                        {
                            // 最大连抽次数
                            (props.maxTimes > 1)
                                ?
                                (
                                    <TextButton {...props} title={`开启${props.maxTimes}次`} onPress={() => {
                                        props.dispatch(action('LotteryModel/lottery')({ id: props.id, max: true }))
                                            .then(data => {
                                                if (lo.isArray(data)) {
                                                    const key = RootView.add(<RewardsPage data={data} onClose={() => {
                                                        RootView.remove(key);
                                                    }} />);
                                                }
                                                props.onClose();
                                            });
                                    }} />
                                )
                                : (<></>)
                        }
                    </View>
                    <View style={{ margin: 10 }}>
                        <TextButton {...props} title='返回' onPress={() => {
                            props.onClose();
                        }} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

// 宝藏箱子组件
const Box = (props) => {
    const theme = React.useContext(ThemeContext)

    const percent = (props.currentNum >= props.reqNum) ? 100 : Math.ceil((props.currentNum / props.reqNum) * 100);

    const onPressHandler = () => {
        const key = RootView.add(<BoxConfirmDialog {...props} onClose={() => {
            RootView.remove(key);
            props.onClose();
        }} />);
    }

    return (
        <TouchableWithoutFeedback onPress={onPressHandler} >
            <View>
                <ImageBackground style={{ width: 160, height: 100, }} resizeMode={"stretch"} source={theme.blockBg_2_img}>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', }} >
                        <Text>{props.title}</Text>
                    </View>
                    <View style={{ flex: 1 }} >
                        <View style={{ flex: 1, marginLeft: 10, marginRight: 10, marginTop: 8, marginBottom: 8 }}>
                            <ProgressBar percent={percent} sections={[{ x: 0, y: 100, color: '#12b7b5' }]} />
                        </View>
                        <View style={{ position: 'absolute', top: 7, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff' }}>{props.currentNum}/{props.reqNum}</Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    );
};

// 底部工具栏组件
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
                    <TextButton title='寻宝' {...props} onPress={() => {
                        DeviceEventEmitter.emit(EventKeys.LOTTERYPOPPAGE_SHOW, 'Lottery10Times');
                    }} />
                </View>
                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <TextButton title='宝藏' {...props} onPress={() => {
                        DeviceEventEmitter.emit(EventKeys.LOTTERYPOPPAGE_SHOW, 'LotteryBaoZang');
                    }} />
                </View>
            </View>
        </View>
    );
}

// 奖励物品组件
const RewardItem = (props) => {
    return (
        <View style={{ flexDirection: 'column', margin: 8, paddingBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
            <PropGrid prop={props} labelStyle={{ color: '#000' }} />
        </View>
    );
}

// 奖励显示页面
const RewardsPage = (props) => {
    const theme = React.useContext(ThemeContext)
    const childs = [];
    let key = 0;
    props.data.forEach(e => {
        childs.push(<RewardItem key={key++} propId={e.propId} iconId={e.iconId} num={e.num} name={e.name} quality={e.quality} />);
    });
    return (
        <TouchableWithoutFeedback onPress={() => { props.onClose() }}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)' }}>
                <View>
                    <Text style={{ marginBottom: 20, color: '#ccc', fontSize: 36 }}>获得奖励</Text>
                </View>
                <ImageBackground style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#a6c2cb' }} source={theme.blockBg_5_img}>
                    <FastImage style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 2 }} resizeMode='stretch' source={require('../../../../assets/bg/dialog_line.png')} />
                    {childs}
                    <FastImage style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 2 }} resizeMode='stretch' source={require('../../../../assets/bg/dialog_line.png')} />
                </ImageBackground>
                <View>
                    <Text style={{ marginTop: 20, color: '#fff', fontSize: 20 }}>点击任意区域关闭</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

// 十连抽页面
class Lottery10Times extends Component {

    static contextType = ThemeContext

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
            <FastImage style={{ flex: 1 }} source={this.context.profileBg}>
                {/* <SafeAreaView style={{ flex: 1 }}> */}
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    {/* <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>十连抽</Text>
                    </View> */}
                    <Header1 style={{ marginBottom: 10 }} title={"寻宝"} />

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 10, marginTop: 10, lineHeight: 20, fontWeight: 'bold' }}>白嫖券: {(this.state.propsInfo[0] != undefined) ? this.state.propsInfo[0].num : 0}</Text>
                        <Text style={{ marginLeft: 10, marginTop: 10, lineHeight: 20, fontWeight: 'bold' }}>消费券: {(this.state.propsInfo[1] != undefined) ? this.state.propsInfo[1].num : 0}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text></Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 60 }}>
                        <ImageButton width={150} height={50} source={require('../../../../assets/button/xunbao1.png')} selectedSource={require('../../../../assets/button/xunbao1_selected.png')} onPress={() => { this.lottery(1); }} />
                        <ImageButton width={150} height={50} source={require('../../../../assets/button/xunbao10.png')} selectedSource={require('../../../../assets/button/xunbao10_selected.png')} onPress={() => { this.lottery(2); }} />
                    </View>
                    <BottomBar {...this.props} />
                </View>
                {/* </SafeAreaView> */}
            </FastImage>
        );
    }
}

// 宝藏页面
class LotteryBaoZang extends Component {

    static contextType = ThemeContext

    constructor(props) {
        super(props);
        this.state = {
            boxes: [],
        };
    }

    refreshBoxes() {
        this.props.dispatch(action('LotteryModel/getBoxes')({}))
            .then(data => {
                if (lo.isArray(data)) {
                    this.setState({ boxes: data });
                }
            });
    }

    componentDidMount() {
        this.refreshBoxes();
    }

    renderItem = (data) => {
        const item = data.item;
        const boxs = [];
        item.forEach(e => {
            boxs.push(<Box key={e.id} {...e} {...this.props} onClose={() => { this.refreshBoxes() }} />);
        });
        return (
            <View style={{ height: 100, flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, marginBottom: 10 }} >
                {boxs}
            </View>
        );
    }

    render() {
        return (
            <FastImage style={{ flex: 1 }} source={this.context.profileBg}>
                {/* <SafeAreaView style={{ flex: 1 }}> */}
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        {/* <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>宝藏</Text>
                        </View> */}
                        <Header1 title={"宝藏"} />

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <FlatList
                                style={{ alignSelf: 'stretch', margin: 10 }}
                                data={this.state.boxes}
                                renderItem={this.renderItem}
                            />
                        </View>
                        <BottomBar {...this.props} />
                    </View>
                {/* </SafeAreaView> */}
            </FastImage>
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
        this.eventListener = DeviceEventEmitter.addListener(EventKeys.LOTTERYPOPPAGE_SHOW, (type) => {
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
        return (<View style={{ flex: 1, backgroundColor: '#fff' }} >{subView}</View>);
    }
}

const styles = StyleSheet.create({
});

export default connect((state) => ({ ...state.LotteryModel, ...state.AppModel }))(LotteryPopPage);