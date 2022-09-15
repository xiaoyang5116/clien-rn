
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
  DataContext,
} from "../constants";

import {
  View,
  Text,
  SafeAreaView,
} from '../constants/native-ui';

import { ImageButton } from '../constants/custom-ui';
import * as RootNavigation from '../utils/RootNavigation';
import RootView from '../components/RootView';
import ArchivePage from './ArchivePage';
import MailBoxPage from './MailBoxPage';
import Modal from '../components/modal';
import Shock from '../components/shock';
import Drawer from '../components/drawer';
import Clues from '../components/cluesList';
import { playBGM } from '../components/sound/utils';
import WorshipModal from '../components/worship';

const BTN_STYLE = {
  width: 235,
  height: 60,
}

class FirstPage extends Component {

  static contextType = DataContext;

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
        <ImageBackground style={styles.bgContainer} source={require('../../assets/bg/first_page.webp')}>
          <View style={styles.viewContainer}>
            {/* 开始剧情 */}
            <ImageButton {...BTN_STYLE} source={require('../../assets/button/story_button.png')} selectedSource={require('../../assets/button/story_button_selected.png')} onPress={() => {
              RootNavigation.navigate('Article');
            }} />
            {/* 继续阅读 */}
            <ImageButton {...BTN_STYLE} source={require('../../assets/button/continue_button.png')} selectedSource={require('../../assets/button/continue_button_selected.png')} onPress={() => {
              this.context.continueReading = true;
              RootNavigation.navigate('Article');
            }} />
            {/* 读取存档 */}
            <ImageButton {...BTN_STYLE} source={require('../../assets/button/archive_button.png')} selectedSource={require('../../assets/button/archive_button_selected.png')} onPress={() => {
              const key = RootView.add(<ArchivePage onClose={() => {
                RootView.remove(key);
              }} />);
            }} />
            {/* 用户设置 */}
            <ImageButton {...BTN_STYLE} source={require('../../assets/button/profile_button.png')} selectedSource={require('../../assets/button/profile_button_selected.png')} onPress={() => {
              RootNavigation.navigate('Home', {
                screen: 'Profile',
              });
            }} />
            {/* 书城 */}
            <ImageButton {...BTN_STYLE} source={require('../../assets/button/quit_read.png')} selectedSource={require('../../assets/button/quit_read_selected.png')} onPress={() => {
              RootNavigation.navigate('BookMain');
            }} />

            {/* 供奉 */}
            <ImageButton {...BTN_STYLE} source={require('../../assets/button/quit_read.png')} selectedSource={require('../../assets/button/quit_read_selected.png')} onPress={() => {
              // RootNavigation.navigate('BookMain');
              WorshipModal.show()
            }} />
          </View>
          <Drawer ref={this.refDrawer} direction={'left'} margin={60} style={{ backgroundColor: '#a49f99', borderRadius: 10, overflow: 'hidden' }}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{ fontSize: 28, color: '#666', marginBottom: 20 }}>测试菜单</Text>
                {/* 乞丐开局 */}
                <ImageButton {...BTN_STYLE} source={require('../../assets/button/home_button.png')} selectedSource={require('../../assets/button/home_button_selected.png')} onPress={() => {
                  this.props.dispatch(action('StoryModel/enter')({ sceneId: 'wzkj' }));
                }} />
                {/* 继续阅读 */}
                <ImageButton {...BTN_STYLE} source={require('../../assets/button/continue_button.png')} selectedSource={require('../../assets/button/continue_button_selected.png')} onPress={() => {
                  this.props.dispatch(action('StoryModel/reEnter')({}));
                }} />
                {/* 线索 */}
                <ImageButton {...BTN_STYLE} source={require('../../assets/button/continue_button.png')} selectedSource={require('../../assets/button/continue_button_selected.png')} onPress={() => {
                  Clues.show();
                }} />
                {/* 测试按钮 */}
                <ImageButton {...BTN_STYLE} source={require('../../assets/button/test_button.png')} selectedSource={require('../../assets/button/test_button_selected.png')} onPress={() => {
                  // 半身人像对话 style = 10
                  // Modal.show({
                  //   style: 10, textAnimationType: 'TextSingle',
                  //   sections: [
                  //     { figureId: "01", location: "right", content: ['你迅速跑过去，', '地面有些东西。你迅速跑过去，',], },
                  //     { figureId: "02", location: "left", content: ['发放垃圾分类就', '发顺丰撒', '草公司的后果', '火鬼斧神工'], },
                  //     { figureId: "01", hideId: ["02"], location: "right", content: ['十分骄傲放假辣鸡。'], },
                  //     { figureId: "02", location: "left", content: ['好的根深蒂固', '电饭锅电饭锅合适的'], },
                  //   ]
                  // })

                  // // 线索列表
                  // Clues.show();

                  // 震屏
                  // Shock.shockShow('bigShock');

                  // 邮箱
                  // const key = RootView.add(<MailBoxPage onClose={() => { RootView.remove(key) }} />);

                  // GameOverModal 7
                  // Modal.show({
                  //   style: 7, title: '神秘阵盘', dialogType: 'FullScreen', textAnimationType: 'TextSingle', 
                  //   sections: [
                  //     { content: ['你迅速跑过去，地面有些东西。'], btn: [{ title: '去拿菜刀', tokey: "p2", props: [{ propId: 20, num: 10 }] }, { title: '去拿画轴', tokey: "p3" }] },
                  //   ]
                  // })

                  // 单人对话框
                  Modal.show({
                    style: 6, title: '神秘阵盘', dialogType: 'HalfScreen', textAnimationType: 'TextSingle',
                    sections: [
                      {
                        key: 'p1',
                        content: ['你迅速跑过去，地面有些东西。', ["废物"], '走开走开，马夫大喝， 正从远处拨开人群走来。', '获得几颗石头珠子，看起来能卖不少钱。'],
                        btn: [{
                          title: '去拿菜刀', tokey: "",
                          toMsg: {
                            action: 'CluesModel/useClues', params: {
                              addCluesId: ["xiansuo4"], useCluesId: ["xiansuo1"], invalidCluesId: ["xiansuo3"]
                            },
                          }
                        }, { title: '去拿画轴', tokey: "p3", animation: ['边缘闪烁绿'] }]
                      },
                      { key: 'p2', content: ['来这里这么多天了，连个像样的防身东西都没有，你觉得菜刀出现的正是时候。', '动不了', '动不了', '动不了'], btn: [{ title: '退出', tokey: "next" }] },
                      { key: 'p3', content: ['那是一个没有磕碰的精美画轴，你直觉的感到那些是个很值钱的东西。', '动不了', '动不了', '动不了'], btn: [{ title: '退出', tokey: "next" }] },
                    ]
                  })

                  // 多人对话框
                  // Modal.show({
                  //   style: 8, title: '神秘阵盘', textAnimationType: 'TextSingle', dialogType: 'FullScreen',
                  //   isBubbleColor: true,
                  //   sections: [
                  //     {
                  //       key: 'p1',
                  //       dialog: [
                  //         { id: '02', content: ['这里是外来的一般商家来的市场，一般为了图个彩头，不会有多寒酸 我们就在这附近讨乞。不出这条路就行。', ['边缘闪烁绿'], '讨乞后每天晚上要给帮派利钱，不然被记住会被帮派打走。',], },
                  //         { id: 'center', content: ["一天前"] },
                  //         { id: '01', content: ['好的', ['边缘闪烁绿']], },
                  //         { id: 'left', content: ["一天前"] },
                  //         { id: '04', content: ['好的',], },
                  //       ],
                  //       btn: [{ title: '开始乞讨', tokey: "p2", animation: ['边缘闪烁绿'] }, { title: '退出', tokey: "next" }]
                  //     },
                  //     {
                  //       key: 'p2',
                  //       dialog: [
                  //         { id: '02', content: ['记住不要去北街，那是富人才能去的地方，乞丐是去不了的。会被打。'] }
                  //       ],
                  //       btn: [{ title: '退出', tokey: "next" }]
                  //     },
                  //   ]
                  // })

                  // 黑白对话框
                  // Modal.show({
                  //   style: "9B", textAnimationType: 'TextSingle',
                  // sections: [
                  //   {
                  //     key: 'p1',
                  //     content: ['你迅速跑过去，地面有些东西。', '走开走开，马夫大喝， 正从远处拨开人群走来。', '获得几颗石头珠子，看起来能卖不少钱。', '获得几颗石头珠子，看起来能卖不少钱。', '获得几颗石头珠子，看起来能卖不少钱。', '获得几颗石头珠子，看起来能卖不少钱。', '获得几颗石头珠子，看起来能卖不少钱。','来这里这么多天了，连个像样的防身东西都没有，你觉得菜刀出现的正是时候。','来这里这么多天了，连个像样的防身东西都没有，你觉得菜刀出现的正是时候。','来这里这么多天了，连个像样的防身东西都没有，你觉得菜刀出现的正是时候。'],
                  //   },
                  //   { key: 'p2', content: ['来这里这么多天了，连个像样的防身东西都没有，你觉得菜刀出现的正是时候。', '动不了', '动不了', '动不了'], btn: [{ title: '退出', tokey: "next" }] },
                  //   { key: 'p3', content: ['那是一个没有磕碰的精美画轴，你直觉的感到那些是个很值钱的东西。', '动不了', '动不了', '动不了'], btn: [{ title: '退出', tokey: "next" }] },
                  // ]
                  // })

                  // 只有确认弹窗
                  // Modal.show({
                  //   style: "1B",
                  //   title: '乞丐李大哥：',
                  //   content: '平时讨乞的位置是在附近的东街市，我们一起走',
                  // })

                  // 背景对话框
                  // Modal.show({
                  //   style: 5,
                  //   textAnimationType: 'TextSingle',
                  //   sections: [
                  //     { type: "TopToBottom", bgImageId: 1, loop: true, play: true, videoId: 1, content: ["你迅速跑过去，地面有些东西。", "来这里这么多天了，连个像样的防身东西都没有，你觉得菜刀出现的正是时候。", "那是一个没有磕碰的精美画轴，你直觉的感到那些是个很值钱的东西。",] },
                  //     { type: "Bottom", bgImageId: 2, play: true, content: ["动不了", "动不了", "动不了"] },
                  //     {
                  //       type: "Barrage", videoId: 1, data: [
                  //         { title: '路人甲：竟然是黑光！', posIdx: 200, speed: 9 },
                  //         { title: '路人乙：天呐！黑光来了有好戏看了', posIdx: 2, speed: 10 },
                  //         { title: '为什么叫黑光，难道就因为皮肤黑又是光头吗', posIdx: 4, speed: 8, delay: 2000 },
                  //         { title: '客栈掌柜：有瓜子和西瓜没？', posIdx: 7, speed: 10, delay: 600 },
                  //         { title: '黑光是恶霸，这小子完了', posIdx: 8, speed: 8, delay: 800 },
                  //       ]
                  //     },
                  //   ]
                  // })

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

export default connect((state) => ({ ...state.AppModel }))(FirstPage);