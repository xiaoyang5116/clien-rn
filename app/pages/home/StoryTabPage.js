
import React from 'react';

import {
  action,
  connect,
  Component,
  ThemeContext,
  DeviceEventEmitter,
  EventKeys,
} from "../../constants";

import { 
  Text, 
  View, 
  SectionList, 
  TouchableWithoutFeedback 
} from '../../constants/native-ui';

import ProgressBar from '../../components/ProgressBar';
import * as DateTime from '../../utils/DateTimeUtils';
import FastImage from 'react-native-fast-image';
import lo from 'lodash';

const SCENE_BG = [
  { name: 'default', img: require('../../../assets/scene/bg_default.jpg') },
];

const SceneImage = (props) => {
  const { scene } = props;
  const sceneImage = (scene != null && lo.isString(scene.sceneImage)) ? scene.sceneImage : '';

  if (lo.isEmpty(sceneImage)) {
    return (<></>);
  } else {
    const img = SCENE_BG.find(e => e.name == sceneImage).img;
    return (
      <View style={{ alignSelf: 'stretch', height: 100 }}>
        <View style={{ flex: 1, marginLeft: 10, marginRight: 10, borderColor: '#999', borderWidth: 2 }}>
          <FastImage style={{ width: '100%', height: '100%' }} source={img} resizeMode='cover'  />
        </View>
      </View>
      );
  }
}

const SceneTimeLabel = (props) => {
  const { scene } = props;
  const themeStyle = React.useContext(ThemeContext);
  const worldTimeHidden = (scene != null && lo.isBoolean(scene.worldTimeHidden)) ? scene.worldTimeHidden : false;

  return (
    <Text style={[themeStyle.datetimeLabel, { display: (worldTimeHidden ? 'none' : 'flex') }]}>{props.datetime}</Text>
  );
}

class StoryTabPage extends Component {

  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.progressViews = [];
    this.unsubscribe = null;
  }

  _onClickItem = (e) => {
    this.props.dispatch(action('StoryModel/click')(e.item))
      .then(() => {
        // 切换章节时通知关闭模态框
        if (e.item.toChapter != undefined) {
          DeviceEventEmitter.emit(EventKeys.OPTIONS_HIDE);
        }
      });
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
        <Text style={this.context.chatHeader}>{title}</Text>
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
      <View style={this.context.chatItem}>
        <TouchableWithoutFeedback onPress={() => this._onClickItem(data)}>
          <View style={{ height: 35, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: this.context.options.fontColor }}>{data.item.title}</Text>
          </View>
        </TouchableWithoutFeedback>
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

  componentDidMount() {
    if (this.props.navigation != null) {
      this.unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
        this.props.dispatch(action('StoryModel/reEnter')({}));
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe != null) {
      this.unsubscribe();
    }
  }

  _getFmtDateTime(time) {
    let dt = new Date();
    dt.setTime(time);
    return "周{0} {1}年[{2}] {3}月{4}日 {5}".format(
      DateTime.Week.format(dt.getDay()), 
      dt.getFullYear(), 
      DateTime.Seasons.format(dt.getMonth()), 
      dt.getMonth() + 1, 
      dt.getDate(),
      DateTime.DayPeriod.format(dt.getHours())
    );
  }

  render() {
    const fmtDateTime = (this.props.time > 0) 
                          ? this._getFmtDateTime(this.props.time) 
                          : '';
    return (
      <View style={this.props.currentStyles.viewContainer}>
        <View style={[this.props.currentStyles.positionBar, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Text style={[this.props.currentStyles.positionLabel, {color: this.props.currentStyles.navigation.text}]}>位置: {this.props.position}</Text>
          <SceneTimeLabel {...this.props} datetime={fmtDateTime} />
        </View>
        <SceneImage {...this.props} />
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
      </View>
    );
  }
}

export default connect((state) => ({ ...state.StoryModel, ...state.AppModel }))(StoryTabPage);