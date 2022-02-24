import React, { Component, PureComponent } from 'react';

import type { Node } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  SectionList,
  View,
  Dimensions,
  Alert,
} from 'react-native';

import yaml from 'js-yaml';
import DialogModal from './DialogModal';

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const { width, height, scale, fontScale } = Dimensions.get('window');

export default class StoryPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sectionData: [], // [{title:'', data:[{...title:'', action:''}]}]
      stroysConfig: [], // Yaml配置.
      sceneId: 0,   // 当前场景ID
      position: "", // 位置信息
    };
  }

  _selectChat(path) {
    let pathArrays = path.split('/');
    if (pathArrays.length <= 0)
      return;

    let sceneId = this.state.sceneId;
    let chatId = 0;
    if (pathArrays[0] != '.') {   // 相对路径 ./chatId 或者绝对路径 /sceneId/chatId
      sceneId = parseInt(pathArrays[1]);
      chatId = parseInt(pathArrays[2]);
    } else {
      chatId = parseInt(pathArrays[1]);
    }

    if (sceneId <= 0 || chatId <= 0)
      return;

    let scene = null;
    for (let key in this.state.stroysConfig.main.scenes) {
      let item = this.state.stroysConfig.main.scenes[key];
      if (item.id == sceneId) {
        scene = item;
        break;
      }
    }

    if ((scene == null) || (scene.nodes.indexOf(chatId) == -1))
      return;

    // 生成新的对话数据
    let newSectionData = [];
    for (let key in this.state.stroysConfig.main.chats) {
      let chat = this.state.stroysConfig.main.chats[key];
      if (chat.id == chatId) {
        let sectionItem = { title: chat.desc, data: [] };
        chat.items.forEach((item) => {
          sectionItem.data.push({ title: item.title, action: item.action });
        });
        newSectionData.push(sectionItem);
        break;
      }
    }

    if (newSectionData.length <= 0 || sceneId <= 0)
      return;

    // 重新渲染
    this.setState({
      stroysConfig: this.state.stroysConfig,
      sectionData: newSectionData,
      sceneId: sceneId,
      position: scene.name
    });
  }

  componentDidMount() {
    fetch("http://localhost:8081/Storys.yml")
      .then(r => r.text())
      .then(text => {
        let rawData = yaml.load(text);
        this.setState({
          stroysConfig: rawData,
          sectionData: this.state.sectionData,
          sceneId: this.state.sceneId,
          position: this.state.position
        });
        this._selectChat(this.state.stroysConfig.main.default_chat);
      });
  }

  _doAction(action) {
    // 跳转场景
    switch (action.cmd) {
      case 'scene':
        let path = action.params;
        this._selectChat(path);
        break;

      case 'dialog':
        if (action.title != undefined && action.content != undefined) {
          this._dialog.show(action.title, action.content, this._onPressDialogButton.bind(this), action.action);
        }
        break;

      case 'navigate':
        this.props.navigation.navigate(action.params);
        break;
    }
  }

  _onPressSectionItem = (e) => {
    let action = e.item.action;
    if (action == null)
      return;

    this._doAction(action);
  }

  _onPressDialogButton(status, args) {
    if (status == 'OK') {
      this._doAction(args);
    }
  }

  _renderItem = (data) => {
    return (
      <View style={{ backgroundColor: "#003964", paddingTop: 2, paddingBottom: 2, marginVertical: 2 }}>
        <Button title={data.item.title} onPress={() => this._onPressSectionItem(data)} color="#bcfefe" />
      </View>
    );
  }

  _renderSectionHeader = ({ section: { title } }) => {
    return (
      <View>
        <Text style={{ fontSize: 18, width: width - 20, paddingTop: 10, paddingBottom: 10, textAlign: 'center', backgroundColor: "#fff" }}>{title}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.viewContainer}>
        <Text style={{ fontSize: 18, width: width - 20, paddingTop: 10, paddingBottom: 10, textAlign: 'left' }}>位置: {this.state.position}</Text>
        <View style={styles.chatContainer}>
          <SectionList
            sections={this.state.sectionData}
            extraData={this.state}
            keyExtractor={(item, index) => item + index}
            renderItem={this._renderItem}
            renderSectionHeader={this._renderSectionHeader}
          />
        </View>
        <DialogModal ref={ref => (this._dialog = ref)} />
      </View>
    );
  }
};
