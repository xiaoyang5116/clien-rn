
import React from 'react';
import { ImageBackground } from 'react-native'

import {
  action,
  connect,
  Component,
  ThemeContext
} from "../constants";

import { 
  View, 
  Text, 
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image
} from '../constants/native-ui';

import { TextButton } from '../constants/custom-ui';
import * as DateTime from '../utils/DateTimeUtils';
import { confirm } from '../components/dialog';
import DarkBlurView from '../components/extends/DarkBlurView';

class ArchivePage extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super(props);
    this.times = 0;
    this.timer = null;
    this.mummy = null;
  }

  _renderItem = (data) => {
    const item = data.item;
    const bgColor = (this.props.currentArchiveIndex == item.id) ? '#ffa997' : '#ddd';
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => this._onDoubleClick(item)}>
          <View style={{ width: '100%', height: 50, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
                          marginTop: 5, marginBottom: 5, borderColor: '#999', borderWidth: 1, backgroundColor: bgColor }}>
              <Text style={{ width: 60, textAlign: 'center' }}>ID：{item.id}</Text>
              <Text style={{ flex: 1, paddingLeft: 5, color: '#669900' }}>{item.desc.sceneName}</Text>
              <Text style={{ width: 160, textAlign: 'center' }}>{DateTime.format(item.dt, 'yyyy-MM-dd hh:mm:ss')}</Text>
          </View>
      </TouchableOpacity>
    )
  }

  _onClearArchive() {
    confirm('确认清档？', 
    () => {
      this.props.dispatch(action('AppModel/clearArchive')());
    });
  }

  _onArchive() {
    confirm('确认存档？', 
    () => {
      this.props.dispatch(action('AppModel/archive')({ title: '手动存档' }));
    });
  }

  _onDoubleClick = (item) => {
    clearTimeout(this.timer);
    if (++this.times >= 2) { // 双击触发
        this.times = 0;
        this.props.dispatch(action('AppModel/selectArchive')({ archiveId: item.id }));
    }
    this.timer = setTimeout(() => {
        this.times = 0;
    }, 500);
  }

  render() {
    return (
      <DarkBlurView style={{ zIndex: 99, flex:1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: '90%', height: '70%', position: "absolute", zIndex: 0, }} source={this.context.dialogBg_2_img} />
            <View style={{ margin: 10, padding: 5, width: '90%', height: '70%', }}>
              <ImageBackground 
                source={this.context.dialogBg_2_header_img}
                style={{ alignSelf: 'stretch', flexDirection: 'row', backgroundColor: '#999' }}>
                <Text style={{ lineHeight: 26, fontWeight: 'bold', margin: 10 }}>存档列表:（双击选择）</Text>
              </ImageBackground>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                  <FlatList
                      data={this.props.archiveList}
                      renderItem={this._renderItem}
                      keyExtractor={item => item.id}
                  />
              </View>
              <View style={{ position: 'absolute' }}>
              </View>
              <ImageBackground
              source={this.context.dialogBg_2_footer_img}
              style={{ paddingTop: 10, paddingBottom: 10, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', 
                  borderColor: '#999', borderWidth: 1, }}>
                  {/* <Image style={{ width: '100%', height: '100%', position: "absolute", zIndex: 0, }} source={this.context.dialogBg_2_footer_img} /> */}
                  <TextButton {...this.props} title="返回" onPress={() => { this.props.onClose() }} />
                  <TextButton {...this.props} title="存档" onPress={() => { this._onArchive() }} />
                  <TextButton {...this.props} title="清档" onPress={() => { this._onClearArchive() }} />
              </ImageBackground>
            </View>
          </View>
        </SafeAreaView>
      </DarkBlurView>
    );
  }

}

export default connect((state) => ({ ...state.AppModel }))(ArchivePage);