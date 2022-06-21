
import React from 'react';

import {
  action,
  connect,
  Component,
  ThemeContext,
} from "../../constants";

import { 
  Text, 
  View, 
  Image,
  SectionList, 
  TouchableWithoutFeedback 
} from '../../constants/native-ui';

import ProgressBar from '../../components/ProgressBar';
import * as DateTime from '../../utils/DateTimeUtils';
import FastImage from 'react-native-fast-image';
import lo from 'lodash';
import { px2pd } from '../../constants/resolution';
import SceneMap from '../../components/maps/SceneMap';

const SCENE_BG = [
  { name: 'default', img: require('../../../assets/scene/bg_default.jpg') },
];

const SCENE_MAP_DATA = [
  { point: [0, 0], title: '神兽', toScene: 'pomiao', links: [[0, 1], [0, -1], [-1, 0], [1, 0]] },
  { point: [0, 1], title: '原神', toScene: 'wzkj', links: [] },
  { point: [1, 0], title: '天仙', toScene: 'pomiaomk', links: [[0, -1], [0, 1]] },
  { point: [0, -1], title: '五行', toScene: 'pomiao', links: [] },
  { point: [-1, 0], title: '天使', toScene: 'pomiao', links: [[0, 1], [0, -1]] },
  { point: [-2, 0], title: '老者', toScene: 'pomiao', links: [[-1, 0]] },
  { point: [-1, -1], title: '地主', toScene: 'pomiao', links: [[-1, 0], [0, -1]] },
];

const ICONS = [
  { id: 1, img: require('../../../assets/button_icon/1.png'), top: 0, left: 10 },
  { id: 2, img: require('../../../assets/button_icon/2.png'), top: -1, left: 10 },
  { id: 3, img: require('../../../assets/button_icon/3.png'), top: 0, left: 10 },
  { id: 4, img: require('../../../assets/button_icon/4.png'), top: 0, left: 10 },
  { id: 5, img: require('../../../assets/button_icon/5.png'), top: 0, right: 0 },
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
    <View style={{ display: (worldTimeHidden ? 'none' : 'flex') }}>
      <Text style={[themeStyle.datetimeLabel]}>{props.datetimes[0]}</Text>
      <Text style={[themeStyle.datetimeLabel, { textAlign: 'right' }]}>{props.datetimes[1]}</Text>
    </View>
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
    let iconComponent = <></>;
    if (lo.isObject(data.item.icon) && lo.isBoolean(data.item.icon.show) && data.item.icon.show) {
      const icon = ICONS.find(e => e.id == data.item.icon.id);
      const attrs = {};
      if (icon.top != undefined) attrs.top = icon.top;
      if (icon.left != undefined) attrs.left = icon.left;
      if (icon.right != undefined) attrs.right = icon.right;

      iconComponent = (<View style={{ position: 'absolute', ...attrs }}>
                          <Image source={icon.img} style={{ width: px2pd(100), height: px2pd(100) }} />
                      </View>);
  }
    return (
      <View style={this.context.chatItem}>
        <TouchableWithoutFeedback onPress={() => this._onClickItem(data)}>
          <View style={{ height: px2pd(117), justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: '100%', height: '100%', position: 'absolute' }} source={this.context.optionButtonImage} />
            <Text style={{ fontSize: 18, color: this.context.options.fontColor }}>{data.item.title}</Text>
            {iconComponent}
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

  _renderMap() {
    if (lo.isEmpty(this.props.scene) || !lo.isArray(this.props.scene.mapData))
      return (<></>);
    return (
      <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 'auto', justifyContent: 'flex-end', alignItems: 'center', zIndex: 10 }} pointerEvents='box-none'>
        <View style={{ marginBottom: 40 }} pointerEvents='box-none'>
          <SceneMap data={this.props.scene.mapData} initialCenterPoint={lo.isArray(this.props.scene.mapCenterPoint) ? this.props.scene.mapCenterPoint : [0,0]} />
        </View>
      </View>
    );
  }

  componentDidMount() {
    if (this.props.navigation != null) {
      this.unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
        // this.props.dispatch(action('StoryModel/reEnter')({}));
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe != null) {
      this.unsubscribe();
    }
  }

  _getFmtDateTimes(time) {
    let dt = new Date();
    dt.setTime(time);
    return [
      "{0}年[{1}] {2}月{3}日".format(dt.getFullYear(), DateTime.Seasons.format(dt.getMonth()), dt.getMonth() + 1, dt.getDate()),
      "周{0} {1}".format(DateTime.Week.format(dt.getDay()), DateTime.DayPeriod.format(dt.getHours())),
    ];
  }

  render() {
    const fmtDateTimes = (this.props.time > 0) 
                          ? this._getFmtDateTimes(this.props.time) 
                          : [];
    return (
      <View style={this.props.currentStyles.viewContainer}>
        <View style={[this.props.currentStyles.positionBar, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <View>
            <Text style={[this.props.currentStyles.positionLabel, {color: this.props.currentStyles.navigation.text}]}>位置:</Text>
            <Text style={[this.props.currentStyles.positionLabel, {color: this.props.currentStyles.navigation.text}]}>{this.props.position}</Text>
          </View>
          <View>
            <SceneTimeLabel {...this.props} datetimes={fmtDateTimes} />
          </View>
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
        {this._renderMap()}
      </View>
    );
  }
}

export default connect((state) => ({ ...state.StoryModel, ...state.AppModel }))(StoryTabPage);