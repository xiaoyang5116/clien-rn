import React, { useEffect, useState } from 'react';
import { ImageBackground, Platform } from 'react-native'

import {
    action,
    connect,
    Component,
    StyleSheet,
    DeviceEventEmitter,
    EventKeys,
    ThemeContext,
} from "../../../constants";
import { px2pd } from '../../../constants/resolution';

import {
    View,
    Text,
    FlatList,
    SafeAreaView,
    TouchableWithoutFeedback,
} from '../../../constants/native-ui';

import FastImage from 'react-native-fast-image';
import ImageCapInset from 'react-native-image-capinsets-next';

import { TextButton, Header1 } from '../../../constants/custom-ui';
import Toast from '../../../components/toast';

const AreaBlock = (props) => {
    const theme = React.useContext(ThemeContext)
    const [selected, onSelected] = useState(false);

    useEffect(() => {
        const listener = DeviceEventEmitter.addListener(EventKeys.AREA_BLOCK_SELECTED, (payload) => {
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

    const progressMaxWidth = 116;
    let progressCurrWidth = (props.item.progress / 100) * progressMaxWidth;
    progressCurrWidth = progressCurrWidth > progressMaxWidth ? progressMaxWidth : progressCurrWidth;

    return (
        <TouchableWithoutFeedback onPress={() => {
            DeviceEventEmitter.emit(EventKeys.AREA_BLOCK_SELECTED, props.item);
            props.onSelected();
        }}>
            <View style={[theme.blockBg_2_size, { justifyContent: 'center', alignItems: 'center' }]}>
                <FastImage
                    source={theme.blockBg_2_img}
                    style={{ ...theme.blockBg_2_size, position: 'absolute' }}
                />
                <ImageCapInset
                    style={{ width: '100%', height: '100%', position: 'absolute', }}
                    source={theme.pattern_1_img}
                    capInsets={{ top: 10, right: 10, bottom: 10, left: 10 }}
                />
                <View style={{ width: '75%', height: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <ImageBackground style={[theme.blockBg_3_size, { justifyContent: "center", alignItems: 'center' }]} source={theme.blockBg_3_img}>
                        <Text style={{ color: '#666', fontSize: 16, fontWeight: 'bold', }}>{props.item.name}</Text>
                    </ImageBackground>
                </View>
                <View style={{ width: '100%', height: 24, marginTop: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ lineHeight: 24, fontSize: 14, color: '#111' }}>探索度</Text>
                </View>
                <View style={{ width: '80%', height: 15, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ position: 'absolute', width: progressMaxWidth, height: 15 }}>
                        <View style={{ position: 'absolute', width: progressMaxWidth, backgroundColor: '#669900', height: 15 }}>
                            <FastImage
                                source={require('../../../../assets/progress/progress_bg.png')}
                                style={{ width: '100%', height: '100%', position: 'absolute' }}
                                resizeMode='stretch'
                            />
                        </View>
                        <View style={{ position: 'absolute', width: progressCurrWidth, backgroundColor: '#669900', height: 15 }}>
                            <FastImage
                                source={require('../../../../assets/progress/progress_front.png')}
                                style={{ width: '100%', height: '100%', position: 'absolute' }}
                                resizeMode='stretch'
                            />
                        </View>
                    </View>
                    <View style={{ position: 'absolute', top: -2, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#fff' }}>{props.item.progress}/100</Text>
                    </View>
                </View>
                {
                    (selected)
                        ? (<FastImage style={{ position: 'absolute', bottom: -9, right: -3, width: 35, height: 35 }} source={require('../../../../assets/button_icon/1.png')} />)
                        : <></>
                }
            </View>
        </TouchableWithoutFeedback>
    )

    // 旧的
    // return (
    //     <TouchableWithoutFeedback onPress={() => {
    //         DeviceEventEmitter.emit(EventKeys.AREA_BLOCK_SELECTED, props.item);
    //         props.onSelected();
    //     }}>
    //         <View style={{ width: 150, height: 120, borderColor: '#666', borderWidth: 1, backgroundColor: '#f2ede7', justifyContent: 'center', alignItems: 'center' }}>
    //             <FastImage
    //                 source={require('../../../../assets/bg/area_block_bg.png')}
    //                 style={{ width: '100%', height: '100%', position: 'absolute' }}
    //             />
    //             <ImageCapInset
    //                 style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.5 }}
    //                 source={require('../../../../assets/bg/area_block_border.png')}
    //                 capInsets={{ top: 10, right: 10, bottom: 10, left: 10 }}
    //             />
    //             <View style={{ backgroundColor: '#e2d3c0', width: '75%', height: 30, justifyContent: 'center', alignItems: 'center' }}>
    //                 <ImageCapInset
    //                     style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.5 }}
    //                     source={require('../../../../assets/bg/area_block_title.png')}
    //                     capInsets={{ top: 15, right: 15, bottom: 15, left: 15 }}
    //                 />
    //                 <Text style={{ color: '#666', fontSize: 14, fontWeight: 'bold' }}>{props.item.name}</Text>
    //             </View>
    //             <View style={{ width: '100%', height: 24, marginTop: 15, paddingLeft: 20, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
    //                 <Text style={{ lineHeight: 24, fontSize: 12, color: '#b48b63' }}>探索度</Text>
    //             </View>
    //             <View style={{ width: '80%', height: 15 }}>
    //                 <View style={{ position: 'absolute', width: progressMaxWidth, backgroundColor: '#669900', height: 15 }}>
    //                     <FastImage
    //                         source={require('../../../../assets/progress/progress_bg.png')}
    //                         style={{ width: '100%', height: '100%', position: 'absolute' }}
    //                         resizeMode='stretch'
    //                     />
    //                 </View>
    //                 <View style={{ position: 'absolute', width: progressCurrWidth, backgroundColor: '#669900', height: 15 }}>
    //                     <FastImage
    //                         source={require('../../../../assets/progress/progress_front.png')}
    //                         style={{ width: '100%', height: '100%', position: 'absolute' }}
    //                         resizeMode='stretch'
    //                     />
    //                 </View>
    //                 <View style={{ position: 'absolute', top: -2, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
    //                     <Text style={{ color: '#fff' }}>{props.item.progress}/100</Text>
    //                 </View>
    //             </View>
    //             {
    //                 (selected)
    //                     ? (<FastImage style={{ position: 'absolute', bottom: -9, right: -3, width: 35, height: 35 }} source={require('../../../../assets/button_icon/1.png')} />)
    //                     : <></>
    //             }
    //         </View>
    //     </TouchableWithoutFeedback>
    // );
}

class ExploreMapsPage extends Component {
    static contextType = ThemeContext

    constructor(props) {
        super(props);

        this.state = {
            desc: '请选择探索地图',
            selectMapId: 0,
        };
    }

    componentDidMount() {
        this.props.dispatch(action('ExploreModel/getMaps')({}));
    }

    renderItem = (data) => {
        const item = data.item;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 10, marginBottom: 10 }} >
                <AreaBlock item={item[0]} onSelected={() => {
                    this.setState({ desc: item[0].desc, selectMapId: item[0].id });
                }} />
                {(item.length > 1) ?
                    (
                        <AreaBlock item={item[1]} onSelected={() => {
                            this.setState({ desc: item[1].desc, selectMapId: item[1].id });
                        }} />
                    )
                    : <></>
                }
            </View>
        );
    }

    render() {
        return (
            <FastImage style={{ flex: 1 }} source={this.context.profileBg} >
                {/* <SafeAreaView style={{ flex: 1 }}> */}
                <View style={{ flex: 1 }}>
                    {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 30, margin: 15 }}>世界探索</Text>
                        </View> */}

                    <Header1 style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }} title={"世界探索"} />

                    <View style={{ borderColor: '#999', borderWidth: 1, backgroundColor: '#eee', margin: 10, height: 100 }}>
                        <ImageBackground style={{ width: "100%", height: "100%" }} source={this.context.blockBg_1_img}>
                            <Text style={{ fontSize: 14, color: '#111', lineHeight: 28, margin: 8 }}>{this.state.desc}</Text>
                        </ImageBackground>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            style={{ alignSelf: 'stretch', margin: 10 }}
                            data={this.props.maps}
                            renderItem={this.renderItem}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', height: 80, justifyContent: 'space-around', alignItems: 'center' }} >
                        <TextButton {...this.props} title={'返回'} onPress={() => {
                            this.props.onClose();
                        }} />
                        <TextButton {...this.props} title={'开始探索'} onPress={() => {
                            if (this.state.selectMapId <= 0) {
                                Toast.show('请选择探索地图', 'CenterToTop');
                            } else {
                                this.props.onClose();
                                this.props.dispatch(action('ExploreModel/start')({ mapId: this.state.selectMapId }));
                                DeviceEventEmitter.emit(EventKeys.EXPLORETABPAGE_SHOW, 'ExploreMainPage');
                            }
                        }} />
                        <TextButton {...this.props} title={'调整补给'} disabled={true} />
                    </View>
                </View>
                {/* </SafeAreaView> */}
            </FastImage>
        );
    }
}

const styles = StyleSheet.create({
});

export default connect((state) => ({ ...state.ExploreModel, ...state.AppModel }))(ExploreMapsPage);