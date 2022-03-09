
import React from 'react';

import {
  action,
  connect,
  Component,
} from "../../constants";

import MaskModal from '../../components/MaskModal';
import { Button, Text, View, SectionList } from '../../constants/native-ui';

class Week {
  static convert(day) {
    if (day == 0)
      return '一';
    else if (day == 1)
      return '二';
    else if (day == 2)
      return '三';
    else if (day == 3)
      return '四';
    else if (day == 4)
      return '五';
    else if (day == 5)
      return '六';
    else if (day == 6)
      return '日';
  }
}

class Seasons {
  static convert(month) {
    switch(month+1) {
      case 3:
      case 4:
      case 5:
        return '春';
      case 6:
      case 7:
      case 8:
        return '夏';
      case 9:
      case 10:
      case 11:
        return '秋';
      case 12:
      case 1:
      case 2:
        return '冬';
      default:
        return '';
    }
  }
}

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
    let dt = new Date();
    dt.setTime(this.props.time);
    let fmtDateTime = "周{0} {1}年[{2}] {3}月{4}日".format(Week.convert(dt.getDay()), dt.getFullYear(), Seasons.convert(dt.getMonth()), dt.getMonth() + 1, dt.getDate());

    return (
      <View style={this.props.currentStyles.viewContainer}>
        <View style={[this.props.currentStyles.positionBar, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Text style={[this.props.currentStyles.positionLabel, {color: this.props.currentStyles.navigation.text}]}>位置: {this.props.position}</Text>
          <Text style={this.props.currentStyles.datetimeLabel}>{fmtDateTime}</Text>
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