
import React from 'react';

import {
  action,
  connect,
  Component,
} from "../../constants";

import MaskModal from '../../components/MaskModal';
import { Button, Text, View, SectionList } from '../../constants/native-ui';

class StoryTabPage extends Component {

  componentDidMount() {
  }

  _onClickItem = (e) => {
    this.props.dispatch(action('StoryModel/click')(e.item));
  }

  _renderSectionHeader = ({ section: { title } }) => {
    return (
      <View>
        <Text style={this.props.currentStyles.chatHeader}>{title}</Text>
      </View>
    );
  }

  _renderItem = (data) => {
    return (
      <View style={this.props.currentStyles.chatItem}>
        <Button title={data.item.title} onPress={() => this._onClickItem(data)} color={this.props.currentStyles.button.color} />
      </View>
    );
  }

  render() {
    return (
      <View style={this.props.currentStyles.viewContainer}>
        <View style={this.props.currentStyles.positionBar}>
          <Text style={[this.props.currentStyles.positionLabel, {color: this.props.currentStyles.navigation.text}]}>位置: {this.props.position}</Text>
        </View>
        <View style={this.props.currentStyles.chatContainer}>
          <SectionList
            style={this.props.currentStyles.chatList}
            sections={this.props.sectionData}
            extraData={this.props}
            keyExtractor={(item, index) => item + index}
            renderItem={this._renderItem}
            renderSectionHeader={this._renderSectionHeader}
          />
        </View>
        <MaskModal />
      </View>
    );
  }
}

export default connect((state) => ({ ...state.StoryModel, ...state.AppModel }))(StoryTabPage);