import React, { Component, PureComponent } from 'react';

import type {Node} from 'react';
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
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

const { width, height, scale, fontScale } = Dimensions.get('window');

export default class StoryPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sectionData: [], // [{title:'', data:[{...title:'', action:''}]}]
      stroysConfig: [], // Yaml config file.
      position: "新手村"
    };
  }

  _selectChat(path) {
    // 生成新的对话数据
    var newSectionData = [];
    for (var chatKey in this.state.stroysConfig.main.chats) {
      var chat = this.state.stroysConfig.main.chats[chatKey];
      if (chat.path == path) {
        var sectionItem = {title: chat.desc, data: []};
        for (var itemKey in chat.items) {
          var chatItem = chat.items[itemKey];
          sectionItem.data.push({title: chatItem.title, action: chatItem.action});
        }
        newSectionData.push(sectionItem);
      }
    }
    // 生成位置信息
    var newPosition = "";
    var pathArray = path.split('/');
    if (pathArray.length > 0) {
      var sceneId = pathArray[1];
      var scenes = this.state.stroysConfig.main.scenes;
      for (var key in scenes) {
        var scene = scenes[key];
        if (scene.id == sceneId) {
          newPosition = scene.desc;
          break;
        }
      }
    }
    this.setState({ sectionData: newSectionData, stroysConfig: this.state.stroysConfig, position: newPosition });
  }

  componentDidMount() {
    fetch("http://localhost:8081/Storys.yml")
      .then(r => r.text())
      .then(text => {
        var rawData = yaml.load(text);
        this.setState({ 
          sectionData: this.state.sectionData, 
          stroysConfig: rawData, 
          position: this.state.position
        });
        this._selectChat(this.state.stroysConfig.main.default_chat);
      });
  }

  _onPressSectionItem=(e)=> {
    var action = e.item.action;
    if (action.indexOf("SCENE ") != -1) {
      var path = action.substring(6).trim();
      this._selectChat(path);
    }
  }

  _renderItem=(data)=> {
    return (
      <View style={{backgroundColor: "#003964", paddingTop: 2, paddingBottom: 2, marginVertical: 2}}>
        <Button title={data.item.title} onPress={() => this._onPressSectionItem(data)} color="#bcfefe" path="XX" />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.viewContainer}>
        <Text style={{fontSize: 18, width: width-20, paddingTop: 10, paddingBottom: 10, textAlign:'left'}}>位置: {this.state.position}</Text>
        <View style={styles.chatContainer}>
          <SectionList
            sections={this.state.sectionData}
            extraData={this.state}
            keyExtractor={(item, index) => item + index}
            renderItem={this._renderItem}
            renderSectionHeader={({ section: { title } }) => (
              <View>
                <Text style={{fontSize: 18, width: width-20, paddingTop: 10, paddingBottom: 10, textAlign:'center', backgroundColor: "#fff"}}>{title}</Text>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
};
