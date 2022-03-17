
import React from 'react';

import {
  action,
  connect,
  Component,
} from "../../constants";

import MaskModal from '../../components/MaskModal';
import ProgressBar from '../../components/ProgressBar';
import * as DateTime from '../../utils/DateTimeUtils';
import { Button, Text, View, SectionList } from '../../constants/native-ui';

class StoryTabPage extends Component {

  componentDidMount() {
  }

  _onClickItem = (e) => {
    this.props.dispatch(action('StoryModel/click')(e.item));
  }

  _onProgressCompleted = (e) => {
    this.props.dispatch(action('StoryModel/progressCompleted')(e.item));
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
        {(data.item.duration != undefined && data.item.duration > 0) 
          ?  <View style={{ position: 'absolute', left: 0, right: 0, top: 37, height: 4 }}>
                <ProgressBar percent={100} toPercent={0} duration={data.item.duration} onCompleted={() => this._onProgressCompleted(data)} />
            </View> 
          : <></>
        }
      </View>
    );
  }

  render() {
    let dt = new Date();
    dt.setTime(this.props.time);
    
    const fmtDateTime = "周{0} {1}年[{2}] {3}月{4}日 {5}".format(
      DateTime.Week.format(dt.getDay()), 
      dt.getFullYear(), 
      DateTime.Seasons.format(dt.getMonth()), 
      dt.getMonth() + 1, 
      dt.getDate(),
      DateTime.DayPeriod.format(dt.getHours())
    );

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