
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

  constructor(props) {
    super(props);
    this.progressViews = [];
  }

  _onClickItem = (e) => {
    this.props.dispatch(action('StoryModel/click')(e.item));
  }

  _onProgressCompleted = (data) => {
    if (data.item.progressId != undefined) {
      this.progressViews = this.progressViews.filter(e => e.progressId != data.item.progressId);
    }
    this.props.dispatch(action('StoryModel/progressCompleted')(data.item));
  }

  _renderSectionHeader = ({ section: { title } }) => {
    return (
      <View>
        <Text style={this.props.currentStyles.chatHeader}>{title}</Text>
      </View>
    );
  }

  _renderItem = (data) => {
    let progressView = <></>;
    // 进度条记录起来，倒计时没完成前不影响。
    if (data.item.progressId != undefined) {
      const progress = this.progressViews.find(e => e.progressId == data.item.progressId);
      if (progress != undefined) {
        progressView = progress.view;
      } else {
        progressView = (<View style={{ position: 'absolute', left: 0, right: 0, top: 37, height: 4 }}>
                          <ProgressBar percent={100} toPercent={0} duration={data.item.duration} onCompleted={() => this._onProgressCompleted(data)} />
                        </View>);
        this.progressViews.push({ progressId: data.item.progressId, view: progressView });
      }
    }
    return (
      <View style={this.props.currentStyles.chatItem}>
        <Button title={data.item.title} onPress={() => this._onClickItem(data)} color={this.props.currentStyles.button.color} />
        {progressView}
      </View>
    );
  }

  _renderSceneProgress() {
    const checkVars = ['__PROGRESS1__', '__PROGRESS2__'];

    let uniqueId = 0;
    const progressViewList = [];
    checkVars.forEach((e) => {
      for (let key in this.props.sceneVars) {
        const v = this.props.sceneVars[key];
        const [ sceneId, varId ] = v.id.split('/');
        if (varId == e) {
          progressViewList.push(
            <View key={uniqueId} style={{ height: 40, marginLeft: 10, marginRight: 10, marginBottom: 20 }}>
              <Text style={{ textAlign: 'center', color: '#555', padding: 3 }}>{v.alias}</Text>
              <ProgressBar percent={v.value} />
            </View>
          );
          uniqueId++;
        }
      }
    });

    return (
    <View style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', justifyContent: 'flex-end' }} pointerEvents="box-none">
      <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
        {progressViewList}
      </View>
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
        {this._renderSceneProgress()}
        <MaskModal />
      </View>
    );
  }
}

export default connect((state) => ({ ...state.StoryModel, ...state.AppModel }))(StoryTabPage);