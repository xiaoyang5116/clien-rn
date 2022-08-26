
import React, { useContext } from 'react';

import {
  action,
  connect,
  Component,
  ThemeContext,
  EventKeys,
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
import { DeviceEventEmitter } from 'react-native';
import MissionBar from '../../components/mission/MissionBar';

const SCENE_BG = [
  { name: 'default', img: require('../../../assets/scene/bg_default.jpg') },
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
      <Text style={[themeStyle.datetimeLabel, {color: themeStyle.navigation.text}]}>{props.datetimes[0]}</Text>
      <Text style={[themeStyle.datetimeLabel, { textAlign: 'right', color: themeStyle.navigation.text }]}>{props.datetimes[1]}</Text>
    </View>
  );
}

const SceneMapWrapper = (props) => {
  const [mapCenterPoint, setMapCenterPoint] = React.useState(lo.isArray(props.mapCenterPoint) ? props.mapCenterPoint : [0,0]);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener(EventKeys.SCENE_MAP_MOVE, (point) => {
      if (lo.isArray(point)) {
        setMapCenterPoint(point);
      }
    });
    return () => {
      listener.remove();
    }
  }, []);

  return (
    <SceneMap data={props.mapData} initialCenterPoint={mapCenterPoint} />
  );
}

const StoryTabPage = (props) => {

  const theme = useContext(ThemeContext);
  const currentMapId = React.useRef('');
  const currentMapCenterPoint = React.useRef(null);
  const sceneMapRefreshKey = React.useRef(0);

  const refCurrentChatId = React.useRef('');
  const refCurrentScene = React.useRef(null);

  const completedProgressIds = React.useRef([]);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener(EventKeys.FORCE_UPDATE_STORY_CHAT, () => {
      if (!lo.isEmpty(refCurrentScene.current) && !lo.isEmpty(refCurrentChatId.current)) {
        props.dispatch(action('SceneModel/processActions')({ nextChat: refCurrentChatId.current, __sceneId: refCurrentScene.current.id }));
      }
    });
    return () => {
      listener.remove();
    }
  }, []);

  const onClickItem = (e) => {
    if (e.item != null && e.item.duration != undefined 
      && (completedProgressIds.current.indexOf(e.item.progressId) == -1)) {
      return // 倒计时选项没结束不能点击
    }
    props.dispatch(action('StoryModel/click')(e.item));
  }

  const onProgressStart = (data) => {
    completedProgressIds.current = completedProgressIds.current.filter(e => e != data.item.progressId);
  }

  const onProgressCompleted = (data) => {
    if (completedProgressIds.current.indexOf(data.item.progressId) == -1) {
      completedProgressIds.current.push(data.item.progressId);
    }
    props.dispatch(action('StoryModel/progressCompleted')(data.item));
  }

  const renderSectionHeader = ({ section: { title } }) => {
    return (
      <View>
        <Text style={[theme.chatHeader, { color: '#4F4F4F' }]}>{title}</Text>
      </View>
    );
  }

  const renderItem = (data) => {
    let progressView = <></>;
    // 进度条记录起来，倒计时没完成前不影响。
    if (data.item.progressId != undefined) {
      progressView = (
      <View style={{ position: 'absolute', left: 0, right: 0, top: 37, height: 4, paddingLeft: 3, paddingRight: 3 }}>
        <ProgressBar percent={100} toPercent={0} duration={data.item.duration} onStart={() => onProgressStart(data) } onCompleted={() => onProgressCompleted(data)} />
      </View>
      );
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
      <View style={theme.chatItem}>
        <TouchableWithoutFeedback onPress={() => onClickItem(data)}>
          <View style={{ height: px2pd(117), justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: '100%', height: '100%', position: 'absolute' }} source={theme.optionButtonImage} />
            <Text style={{ fontSize: 18, color: theme.options.fontColor }}>{data.item.title}</Text>
            {iconComponent}
          </View>
        </TouchableWithoutFeedback>
        {progressView}
      </View>
    );
  }

  const renderSceneProgress = () => {
    const checkVars = ['__PROGRESS1__', '__PROGRESS2__'];

    let uniqueId = 0;
    const progressViewList = [];
    checkVars.forEach((e) => {
      for (let key in props.sceneVars) {
        const v = props.sceneVars[key];
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
    <View style={{ position: 'absolute', left: 0, bottom: 20, width: '100%', height: '100%', justifyContent: 'flex-end' }} pointerEvents="box-none">
      <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
        {progressViewList}
      </View>
    </View>
    );
  }

  const renderMap = () => {
    if (lo.isEmpty(props.scene) || !lo.isArray(props.scene.mapData))
      return (<></>);

    if (!lo.isEqual(currentMapId.current, props.scene.mapId) || !lo.isEqual(currentMapCenterPoint.current, props.scene.mapCenterPoint)) {
      currentMapId.current = props.scene.mapId;
      currentMapCenterPoint.current = props.scene.mapCenterPoint;
      sceneMapRefreshKey.current += 1;
    }

    return (
      <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 'auto', justifyContent: 'flex-end', alignItems: 'center', zIndex: 10 }} pointerEvents='box-none'>
        <View style={{ marginBottom: 40 }} pointerEvents='box-none'>
          <SceneMapWrapper key={sceneMapRefreshKey.current} mapData={props.scene.mapData} mapCenterPoint={props.scene.mapCenterPoint} />
        </View>
      </View>
    );
  }

  const getFmtDateTimes = (time) => {
    let dt = new Date();
    dt.setTime(time);
    return [
      "{0}年[{1}] {2}月{3}日".format(dt.getFullYear(), DateTime.Seasons.format(dt.getMonth()), dt.getMonth() + 1, dt.getDate()),
      "周{0} {1}".format(DateTime.Week.format(dt.getDay()), DateTime.DayPeriod.format(dt.getHours())),
    ];
  }

  // 同步属性至副作用方法内
  refCurrentScene.current = props.scene;
  refCurrentChatId.current = props.chatId;

  return (
    <View style={props.currentStyles.viewContainer}>
      <TouchableWithoutFeedback onPress={()=>{DeviceEventEmitter.emit("ARTICLE_PAGE_PRESS")}}>
        <View style={props.currentStyles.viewContainer}>
          <View style={[props.currentStyles.positionBar, { flexDirection: 'row', justifyContent: 'space-between' }]}>
            <View>
              <Text style={[props.currentStyles.positionLabel, { color: props.currentStyles.navigation.text }]}>位置:</Text>
              <Text style={[props.currentStyles.positionLabel, { color: props.currentStyles.navigation.text }]}>{props.position}</Text>
            </View>
            <View>
              <SceneTimeLabel {...props} datetimes={(props.time > 0) ? getFmtDateTimes(props.time) : []} />
            </View>
          </View>
          <SceneImage {...props} />
          <View style={props.currentStyles.chatContainer}>
            <SectionList
              style={props.currentStyles.chatList}
              sections={props.sectionData}
              extraData={props}
              keyExtractor={(item, index) => item + index}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
            />
          </View>
        </View>
      </TouchableWithoutFeedback >
      {renderSceneProgress()}
      <MissionBar />
      {renderMap()}
    </View>
  );
}

export default connect((state) => ({ ...state.StoryModel, ...state.AppModel }))(StoryTabPage);