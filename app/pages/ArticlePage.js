
import React from 'react';

import {
  connect,
  Component,
  StyleSheet,
  action,
  EventKeys,
  AppDispath,
  DataContext,
  statusBarHeight,
} from "../constants";

import { 
  View,
  Text,
} from '../constants/native-ui';

import {
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { DeviceEventEmitter } from 'react-native';
import RootView from '../components/RootView';
import ReaderSettings from '../components/readerSettings';
import HeaderContainer from '../components/article/HeaderContainer';
import FooterContainer from '../components/article/FooterContainer';
import LeftContainer from '../components/article/LeftContainer';
import DirectoryPage from './article/DirectoryPage';
import RightContainer from '../components/article/RightContainer';
import DirMapPage from './article/DirMapPage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BagAnimation from '../components/animation/BagAnimation';
import MenuOptions from '../components/article/MenuOptions';
import UserAttributesHolder from './article/UserAttributesHolder'
import Clues from '../components/cluesList';
import { ReaderBackgroundImageView, ReaderXianGaoImageView } from './article/ImageViews';
import FooterTabBar from './article/FooterTabBar';
import DarkLightSelector from './article/DarkLightSelector';
import WorldTabBar from './article/WorldTabBar';
import WorldSelector from './article/WorldSelector';
import OtherWorld from './article/OtherWorld';
import PrimaryWorld from './article/PrimaryWorld';
import ObjectUtils from '../utils/ObjectUtils';
import { ArticleOptionActions } from '../components/article';

const Tab = createMaterialTopTabNavigator();

class ArticlePage extends Component {

  static contextType = DataContext;

  constructor(props) {
    super(props);
    this.refMenuOptions = React.createRef();
    this.refPropsContainer = React.createRef();
    this.refDirectory = React.createRef();
    this.refDirMap = React.createRef();
    this.longPressListener = null;
    this.gotoDirMapListener = null;
    this.darkMode = false;
    this.listeners = [];
    this.refreshKey = 0;
    this.hasBagAnimation = false;
  }

  componentDidMount() {
    // 判断是否继续阅读
    if (this.context.continueReading != undefined && this.context.continueReading) {
      AppDispath({ type: 'StateModel/getAllStates', payload: {}, cb: (states) => {
        const { articleState, articleBtnClickState, articleSceneClickState } = states;
        if (articleState != null) {
          this.props.dispatch(action('ArticleModel/show')(articleState)).then(r => {
            if (articleBtnClickState != null && ObjectUtils.hasProperty(articleBtnClickState, ['toScene', 'dialogs'])) {
              setTimeout(() => { 
                ArticleOptionActions.invoke(articleBtnClickState, (v) => { // 打开场景选项或者对话框
                  if (articleSceneClickState != null && ObjectUtils.hasProperty(articleSceneClickState, ['nextChat'])) {
                    ArticleOptionActions.invoke(articleSceneClickState);  // 切换场景选项
                  }
                });
              }, 0);
            }
          });
        } else {
          this.props.dispatch(action('ArticleModel/show')({ file: 'WZXX_[START]' }));
        }
      }});
      this.context.continueReading = false;
    } else {
      this.props.dispatch(action('ArticleModel/show')({ file: 'WZXX_[START]' }));
    }

    // 注册系列事件
    this.listeners.push(
      // 文章长按点击
      DeviceEventEmitter.addListener(EventKeys.ARTICLE_PAGE_LONG_PRESS, (e) => {
        WorldSelector();
      }),
      // 文章单击
      DeviceEventEmitter.addListener(EventKeys.ARTICLE_PAGE_PRESS, (e) => {
        this.refMenuOptions.current.close();
      }),
      // 进入章节地图
      DeviceEventEmitter.addListener(EventKeys.GOTO_DIRECTORY_MAP, (id) => {
        this.refDirectory.current.close();
        this.refDirMap.current.open();
      }),
      // 返回章节目录
      DeviceEventEmitter.addListener(EventKeys.BACK_DIRECTORY, () => {
        this.refDirectory.current.open();
        this.refDirMap.current.close();
      }),
      // 显示背包动画
      DeviceEventEmitter.addListener(EventKeys.ARTICLE_SHOW_BAG_ANIMATION, () => {
        if (!this.hasBagAnimation) {
          this.hasBagAnimation = true;
          const key = RootView.add(<BagAnimation {...this.props} onClose={() => {
            RootView.remove(key);
            this.hasBagAnimation = false;
          }} />);
        }
      })
    );
  }

  componentWillUnmount() {
    this.listeners.forEach(e => e.remove());
    this.listeners.length = 0;
  }

  openDirectory = (e) => {
    DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
    setTimeout(() => {
      this.refDirectory.current.open();
    }, 500);
  }

  render() {
    const { readerStyle, attrsConfig } = this.props;
    this.refreshKey++; // 提供给需强制刷新的组件
    this.context.readerTextOpacity.setValue(1);

    return (
      <View style={[styles.viewContainer, { backgroundColor: readerStyle.bgColor }]}>
        <HeaderContainer>
          <View style={[styles.bannerStyle, { marginTop: (Platform.OS == 'ios' ? statusBarHeight : 0) }]}>
            <TouchableWithoutFeedback onPress={() => {
              DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
              setTimeout(() => {
                this.refMenuOptions.current.open();
              }, 500);
            }}>
              <View style={styles.bannerButton}>
                <AntDesign name={'menufold'} color={"#111"} size={21} />
                <Text style={styles.bannerButtonText}>菜单选项</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={this.openDirectory}>
              <View style={styles.bannerButton}>
                <AntDesign name={'bars'} color={"#111"} size={23} />
                <Text style={styles.bannerButtonText}>章节目录</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => {
              this.refPropsContainer.current.open();
            }}>
              <View style={styles.bannerButton}>
                <AntDesign name={'hearto'} color={"#111"} size={21} />
                <Text style={styles.bannerButtonText}>角色属性</Text>
              </View>
            </TouchableWithoutFeedback>

            <DarkLightSelector {...this.props} />

            <TouchableWithoutFeedback onPress={()=>{
                DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
                const key =RootView.add(<ReaderSettings onClose={() => { RootView.remove(key) }} />)
              }}>
              <View style={styles.bannerButton}>
                <Ionicons name={'ios-text'} color={"#111"} size={23} />
                <Text style={styles.bannerButtonText}>阅读设置</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={()=>{
                DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
                Clues.show()
              }}>
              <View style={styles.bannerButton}>
                <AntDesign name={'carryout'} color={"#111"} size={23} />
                <Text style={styles.bannerButtonText}>线索</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </HeaderContainer>
        <View style={[styles.bodyContainer, { marginTop: (Platform.OS == 'ios' ? statusBarHeight : 0), marginBottom: (Platform.OS == 'ios' ? 20 : 0) }]}>
          <ReaderBackgroundImageView />
          <ReaderXianGaoImageView />
          <Tab.Navigator initialRouteName='PrimaryWorld' 
            tabBar={(props) => <WorldTabBar {...props} />}
            screenOptions={{ swipeEnabled: !this.props.isStartPage }}
            sceneContainerStyle={{ backgroundColor: 'transparent' }}
            >
            <Tab.Screen name="LeftWorld" options={{ tabBarLabel: '现实' }} children={(props) => <OtherWorld {...this.props} {...props} />} />
            <Tab.Screen name="PrimaryWorld" options={{ tabBarLabel: '尘界' }} children={(props) => <PrimaryWorld {...this.props} {...props} />} />
            <Tab.Screen name="RightWorld" options={{ tabBarLabel: '灵修界' }} children={(props) => <OtherWorld {...this.props} {...props} />} />
          </Tab.Navigator>
        </View>
        <FooterContainer>
          <FooterTabBar />
        </FooterContainer>
        {/* 菜单选项 */}
        <LeftContainer ref={this.refMenuOptions} openScale={0.7}>
          <MenuOptions { ...this.props } />
        </LeftContainer>
        {/* 章节目录 */}
        <LeftContainer ref={this.refDirectory}>
          <DirectoryPage data={this.props.dirData} />
        </LeftContainer>
        {/* 章节目录地图 */}
        <RightContainer ref={this.refDirMap}>
          <DirMapPage key={this.refreshKey} data={this.props.dirData} />
        </RightContainer>
        {/* 角色属性 */}
        <RightContainer ref={this.refPropsContainer}>
          {(attrsConfig != null) ? <UserAttributesHolder config={attrsConfig} /> : <></>}
        </RightContainer>
        {/* <View style={styles.debugContainer} pointerEvents="box-none" >
          <View style={styles.debugView1} pointerEvents="box-none">
            <Text style={{ color: '#fff' }}>事件触发区域1</Text>
          </View>
          <View style={styles.debugView2} pointerEvents="box-none">
            <Text style={{ color: '#fff' }}>事件触发区域2</Text>
          </View>
          <View style={styles.debugView3} pointerEvents="box-none">
            <Text style={{ color: '#fff' }}>事件触发区域3</Text>
          </View>
        </View> */}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: "flex-start", 
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  debugContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugView1: {
    marginBottom: 35,
    borderWidth: 1, 
    borderColor: '#999', 
    width: '100%', 
    height: 200, 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  debugView2: {
    borderWidth: 1, 
    borderColor: '#999', 
    width: '100%', 
    height: 200, 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  debugView3: {
    marginTop: 35,
    borderWidth: 1, 
    borderColor: '#999', 
    width: '100%', 
    height: 200, 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  bannerStyle: {
    flex: 1, 
    flexDirection: 'row', 
    // flexWrap: 'wrap', 
    justifyContent: 'space-evenly', 
    alignItems: 'center', 
  },
  bannerButton: {
    width: 55,
    marginLeft: 2, 
    marginRight: 2,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerButtonText: {
    marginTop: 10,
    color: '#000',
    fontSize: 12,
  }, 
});

export default connect((state) => ({ ...state.ArticleModel }))(ArticlePage);