import React from 'react';

import {
    StyleSheet,
    ImageBackground,
    DeviceEventEmitter,
} from 'react-native';

import {
    action,
    connect,
    Component,
    EventKeys,
} from "../../constants";

import {
    View,
    Text,
    SafeAreaView,
} from '../../constants/native-ui';

import { ImageButton } from '../../constants/custom-ui';
import * as RootNavigation from '../../utils/RootNavigation';
import RootView from '../../components/RootView';
import ArchivePage from '../ArchivePage';
import Drawer from '../../components/drawer';
import Clues from '../../components/cluesList';

const BTN_STYLE = {
    width: 235,
    height: 60,
}

class StartReadPage extends Component {

    constructor(props) {
        super(props);
        this.refDrawer = React.createRef();
        this.startX = 0;
        this.startY = 0;
        this.started = false;
    }

    componentDidMount() {
        DeviceEventEmitter.emit(EventKeys.NAVIGATION_ROUTE_CHANGED, { routeName: 'First' });
    }

    render() {
        return (
            <View style={{ flex: 1 }}
                onTouchStart={(e) => {
                    if (e.nativeEvent.pageX > 40)
                        return;

                    this.startX = e.nativeEvent.pageX;
                    this.startY = e.nativeEvent.pageY;
                    this.started = true;
                }}
                onTouchMove={(e) => {
                    if (!this.started)
                        return;

                    const dx = e.nativeEvent.pageX - this.startX;
                    const dy = e.nativeEvent.pageY - this.startY;
                    if (Math.abs(dx) >= 5) {
                        if (dx > 0) this.refDrawer.current.offsetX(dx);
                    }
                }}
                onTouchEnd={(e) => {
                    this.refDrawer.current.release();
                    this.started = false;
                }}
                onTouchCancel={(e) => {
                    this.refDrawer.current.release();
                    this.started = false;
                }}>
                {/* 背景图片 */}
                <ImageBackground style={styles.bgContainer} source={require('../../../assets/bg/first_page.webp')}>
                    <View style={styles.viewContainer}>
                        {/* 开始剧情 */}
                        <ImageButton {...BTN_STYLE} source={require('../../../assets/button/story_button.png')} selectedSource={require('../../../assets/button/story_button_selected.png')} onPress={() => {
                            RootNavigation.navigate('Article');
                        }} />
                        {/* 继续阅读 */}
                        <ImageButton {...BTN_STYLE} source={require('../../../assets/button/continue_button.png')} selectedSource={require('../../../assets/button/continue_button_selected.png')} onPress={() => {
                            RootNavigation.navigate('Article');
                        }} />
                        {/* 读取存档 */}
                        <ImageButton {...BTN_STYLE} source={require('../../../assets/button/archive_button.png')} selectedSource={require('../../../assets/button/archive_button_selected.png')} onPress={() => {
                            const key = RootView.add(<ArchivePage onClose={() => {
                                RootView.remove(key);
                            }} />);
                        }} />
                        {/* 用户设置 */}
                        <ImageButton {...BTN_STYLE} source={require('../../../assets/button/profile_button.png')} selectedSource={require('../../../assets/button/profile_button_selected.png')} onPress={() => {
                            RootNavigation.navigate('Home', {
                                screen: 'Profile',
                            });
                        }} />
                        {/* 书城 */}
                        <ImageButton {...BTN_STYLE} source={require('../../../assets/button/profile_button.png')} selectedSource={require('../../../assets/button/profile_button_selected.png')} onPress={() => {
                            RootNavigation.navigate('BookCity');
                        }} />
                        {/* 返回 */}
                        <ImageButton {...BTN_STYLE} source={require('../../../assets/button/profile_button.png')} selectedSource={require('../../../assets/button/profile_button_selected.png')} onPress={() => {
                            RootNavigation.navigate('BookMain', { screen: 'BookDetail' });
                        }} />
                    </View>
                    <Drawer ref={this.refDrawer} direction={'left'} margin={60} style={{ backgroundColor: '#a49f99', borderRadius: 10, overflow: 'hidden' }}>
                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ fontSize: 28, color: '#666', marginBottom: 20 }}>测试菜单</Text>
                                {/* 乞丐开局 */}
                                <ImageButton {...BTN_STYLE} source={require('../../../assets/button/home_button.png')} selectedSource={require('../../../assets/button/home_button_selected.png')} onPress={() => {
                                    this.props.dispatch(action('StoryModel/enter')({ sceneId: 'wzkj' }));
                                }} />
                                {/* 继续阅读 */}
                                <ImageButton {...BTN_STYLE} source={require('../../../assets/button/continue_button.png')} selectedSource={require('../../../assets/button/continue_button_selected.png')} onPress={() => {
                                    this.props.dispatch(action('StoryModel/reEnter')({}));
                                }} />
                                {/* 测试按钮 */}
                                <ImageButton {...BTN_STYLE} source={require('../../../assets/button/test_button.png')} selectedSource={require('../../../assets/button/test_button_selected.png')} onPress={() => {
                                    // // 线索列表
                                    Clues.show();
                                }} />
                            </View>
                        </SafeAreaView>
                    </Drawer>
                </ImageBackground>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bgContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
});

export default connect((state) => ({ ...state.AppModel }))(StartReadPage);