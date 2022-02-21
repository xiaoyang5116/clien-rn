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
    justifyContent: 'center'
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

export default class SectionListPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sectionData: [], // [{title:'', data:[{...title:'', action:''}]}]
      rawStorysData: []
    };
  }

  selectStory(path) {
    var newSectionData = [];
    for (var storyKey in this.state.rawStorysData.storys) {
      var story = this.state.rawStorysData.storys[storyKey];
      if (story.path == path) {
        var sectionItem = {title: story.desc, data: []};
        for (var itemKey in story.items) {
          var storyItem = story.items[itemKey];
          sectionItem.data.push({title: storyItem.title, action: storyItem.action});
        }
        newSectionData.push(sectionItem);
      }
    }
    this.setState({ sectionData: newSectionData, rawStorysData: this.state.rawStorysData });
  }

  componentDidMount() {
    fetch("http://localhost:8081/Storys.yml")
      .then(r => r.text())
      .then(text => {
        var rawData = yaml.load(text);
        this.setState({ sectionData: this.state.sectionData, rawStorysData: rawData});
        this.selectStory('/');
      });
  }

  _onPressSectionItem=(e)=> {
    var action = e.item.action;
    if (action.indexOf("TO ") != -1) {
      var path = action.substring(3).trim();
      this.selectStory(path);
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
    );
  }
};
