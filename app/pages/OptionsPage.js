import React, { useRef } from 'react';

import {
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Text
} from 'react-native'

import {
  DeviceEventEmitter,
  EventKeys,
  statusBarHeight,
  connect
} from '../constants';
import Clues from '../components/cluesList';
import * as RootNavigation from '../utils/RootNavigation';

import {
  SafeAreaView,
  View
} from '../constants/native-ui';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StoryTabPage from './home/StoryTabPage';
import HeaderContainer from '../components/article/HeaderContainer';
import LeftContainer from '../components/article/LeftContainer';
import MenuOptions from '../components/article/MenuOptions';
import DirectoryPage from './article/DirectoryPage';
import RightContainer from '../components/article/RightContainer';
import DirMapPage from './article/DirMapPage';
import UserAttributesHolder from './article/UserAttributesHolder';


const OptionsPage = (props) => {

  const listeners = []
  const { attrsConfig } = props;
  const refMenuOptions = useRef()
  const refDirectory = useRef()
  const refDirMap = useRef()
  const refreshKey = useRef(0)
  const refPropsContainer = useRef()

  React.useEffect(() => {
    listeners.push(
      DeviceEventEmitter.addListener(EventKeys.OPTIONS_HIDE, () => {
        props.onClose();
      })
    );
    listeners.push(
      DeviceEventEmitter.addListener(EventKeys.ARTICLE_PAGE_PRESS, (e) => {
        refMenuOptions.current.close();
      })
    );
    listeners.push(
      DeviceEventEmitter.addListener(EventKeys.GOTO_DIRECTORY_MAP, (id) => {
        refDirectory.current.close();
        refDirMap.current.open();
      })
    );
    listeners.push(
      DeviceEventEmitter.addListener(EventKeys.BACK_DIRECTORY, (id) => {
        refDirectory.current.open();
        refDirMap.current.close();
      })
    );

    return () => {
      listeners.forEach(e => e.remove());
      listeners.length = 0;
    }
  }, []);

  const openDirectory = (e) => {
    DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
    setTimeout(() => {
      refDirectory.current.open();
    }, 500);
  }

  // 提供给需强制刷新的组件
  refreshKey.current += 1;

  return (
    <View style={{ flex: 1 }}>
      <HeaderContainer>
        <View style={[styles.bannerStyle, { marginTop: (Platform.OS == 'ios' ? statusBarHeight : 0) }]}>
          <TouchableWithoutFeedback onPress={() => {
            DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
            setTimeout(() => {
              refMenuOptions.current.open();
            }, 500);
          }}>
            <View style={styles.bannerButton}>
              <AntDesign name={'menufold'} color={"#111"} size={21} />
              <Text style={styles.bannerButtonText}>菜单选项</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={openDirectory}>
            <View style={styles.bannerButton}>
              <AntDesign name={'bars'} color={"#111"} size={23} />
              <Text style={styles.bannerButtonText}>章节目录</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => {
            refPropsContainer.current.open();
          }}>
            <View style={styles.bannerButton}>
              <AntDesign name={'hearto'} color={"#111"} size={21} />
              <Text style={styles.bannerButtonText}>角色属性</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => {
            DeviceEventEmitter.emit(EventKeys.OPTIONS_HIDE)
            RootNavigation.navigate('Home',{
              screen: "Profile"
            });
          }}>
            <View style={styles.bannerButton}>
              <AntDesign name={'setting'} color={"#111"} size={23} />
              <Text style={styles.bannerButtonText}>设置</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => {
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
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(255,255,255,1)' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <StoryTabPage />
        </View>
      </SafeAreaView>

      {/* 菜单选项 */}
      <LeftContainer ref={refMenuOptions} openScale={0.7}>
        <MenuOptions {...props} closeOptionPage={props.onClose} />
      </LeftContainer>

      {/* 章节目录 */}
      <LeftContainer ref={refDirectory}>
        <DirectoryPage data={props.dirData} />
      </LeftContainer>
      {/* 章节目录地图 */}
      <RightContainer ref={refDirMap}>
        <DirMapPage key={refreshKey.current} data={props.dirData} />
      </RightContainer>

      {/* 角色属性 */}
      <RightContainer ref={refPropsContainer}>
        {(attrsConfig != null) ? <UserAttributesHolder config={attrsConfig} /> : <></>}
      </RightContainer>

    </View>
  );
}

export default connect((state) => ({ ...state.ArticleModel }))(OptionsPage);

const styles = StyleSheet.create({
  bannerStyle: {
    flex: 1,
    flexDirection: 'row',
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
})