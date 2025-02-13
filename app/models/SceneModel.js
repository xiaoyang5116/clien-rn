
import {
  action,
  delay,
  debugMessage,
  errorMessage,
  LocalCacheKeys,
  AppDispath,
  DeviceEventEmitter,
  EventKeys,
  inReaderMode,
} from "../constants";

import {
  GetSceneDataApi,
} from "../services/GetSceneDataApi";

import {
  GetBooksDataApi,
} from "../services/GetBooksDataApi";

import {
  GetBookConfigDataApi,
} from "../services/GetBookConfigDataApi";

import {
  GetNpcDataApi,
} from "../services/GetNpcDataApi";

import lo from 'lodash';
import LocalStorage from '../utils/LocalStorage';
import * as DateTime from '../utils/DateTimeUtils';
import CollectUtils from '../utils/CollectUtils';
import EventListeners from '../utils/EventListeners';
import * as RootNavigation from '../utils/RootNavigation';
import SceneConfigReader from "../utils/SceneConfigReader";
import Modal from "../components/modal";
import Shock from '../components/shock';
import { CarouselUtils } from "../components/carousel";
import { playSound, stopBGM } from "../components/sound/utils";
import Games from "../components/games";
import EffectAnimations from "../components/effects";
import ShopsUtils from '../utils/ShopsUtils';
import { VarUtils } from "./scene/utils";
import { ScenePropertyInjectBuilder } from "./scene/builders";
import { ACTIONS_MAP, PropertyActions } from "./scene/actions";
import OpenUI from "../pages/OpenUI";
import ArenaUtils from "../utils/ArenaUtils";

export default {
  namespace: 'SceneModel',

  state: {
    __data: {
      // 场景自定义变量
      vars: [],

      // 时间线
      time: {
        missions: [], // 副本时间
        worlds: [   // 世界出生点时间(2012/29998/49998) =>（尘界, 现实, 灵修界）
          { worldId: 0, time: 1325376000000 }, 
          { worldId: 1, time: 884478240000000 }, 
          { worldId: 2, time: 1515617280000000 }
        ],
      },

      // 场景列表
      sceneList: [],

      // 场景配置访问器
      cfgReader: null,
    }
  },

  effects: {
    // 重新加载&初始化
    *reload({ }, { call, put, select }) {
      const sceneState = yield select(state => state.SceneModel);

      // 从书本目录获取场景列表
      sceneState.__data.sceneList.length = 0;
      if (sceneState.__data.scenesConfig == null) {
        const booksConfig = yield call(GetBooksDataApi);
        for (let k in booksConfig.books.list) {
          const bookId = booksConfig.books.list[k];
          const bookConfig = yield call(GetBookConfigDataApi, bookId);
          if (bookConfig != null) {
            const sceneList = bookConfig.book.scene_list.map(e => `${bookId}/SCENE/${e}`);
            sceneState.__data.sceneList.push(...sceneList);
          }
        }
      }

      // 获取场景配置
      let scenes = [];
      let maps = [];
      for (let key in sceneState.__data.sceneList) {
        const sceneId = sceneState.__data.sceneList[key];
        const data = yield call(GetSceneDataApi, sceneId);
        if (data.scenes != undefined) {
          data.scenes.forEach((e) => {
            // 标注NPC场景
            if (e.isNpc == undefined) e.isNpc = false;

            // 进度条自动注入唯一ID
            ScenePropertyInjectBuilder.injectProgressId(e);

            // 动作条目注入当前场景ID
            ScenePropertyInjectBuilder.injectSceneId(e);

            // 地图数据
            if (lo.isArray(e.maps)) maps.push(...e.maps);

            //
            scenes.push(e);
          });
        }
      }

      // 自动载入选用的地图数据(scene.mapData属性)
      scenes.forEach(e => {
        if (lo.isString(e.mapId)) {
            const map = maps.find(m => m.id == e.mapId);
            if (map != undefined) {
              e.mapData = map.data;
              e.mapImages = map.images;
            }
        }
      });

      // 加载本地缓存
      const sceneCache = yield call(LocalStorage.get, LocalCacheKeys.SCENES_DATA);
      if (sceneCache != null && sceneCache.time != null) {
        sceneState.__data.time = sceneCache.time;
      }
      
      // 加载匹配的变量缓存
      sceneState.__data.vars.length = 0;
      sceneState.__data.cfgReader = new SceneConfigReader(scenes);
      sceneState.__data.cfgReader.getSceneIds().forEach((sceneId) => {
        const vars = sceneState.__data.cfgReader.getSceneVars(sceneId);
        if (vars != null) {
          vars.forEach((e) => {
            let value = (e.defaultValue != undefined) ? e.defaultValue : 0;
            const uniVarId = VarUtils.generateVarUniqueId(sceneId, e.id);
            if (sceneCache != null && sceneCache.vars != null) {
              const varCache = VarUtils.getVar(sceneCache.vars, sceneId, e.id);
              if (varCache != null && varCache.min >= e.min && varCache.max <= e.max) {
                value = varCache.value;
              }
            }
            sceneState.__data.vars.push({ ...e, value: value, id: uniVarId });
          });
        }
      });
    },

    // 进入场景
    // 参数: { sceneId: 场景ID }
    *enterScene({ payload }, { put, call, select }) {
      const userState = yield select(state => state.UserModel);
      const sceneState = yield select(state => state.SceneModel);
      const {sceneId, quiet} = payload;
      
      const scene = sceneState.__data.cfgReader.getScene(sceneId);
      if (scene == null) {
        errorMessage("SceneId={0} not found.", sceneId);
        return;
      }

      let needSync = false;
      if (sceneId !== userState.sceneId) {
        // 前一个场景响应退出事件
        yield put.resolve(action('raiseSceneEvents')({ sceneId: userState.sceneId, eventType: 'leave' }));

        // 只有场景发生变化才更新记录的上一个场景。
        userState.prevSceneId = userState.sceneId;
        needSync = true;
      }
      userState.sceneId = sceneId;
      
      if (quiet == undefined || !quiet) {
        yield put.resolve(action('raiseSceneEvents')({ sceneId: sceneId, eventType: 'enter' }));
      }
      if (needSync) {
        yield put.resolve(action('UserModel/syncData')({}));
      }

      // 广播进入场景事件
      DeviceEventEmitter.emit(EventKeys.ENTER_SCENE, scene);
    },

    // 设置世界时间
    // 参数：{ worldId:xxx, time: xxx }
    *setWorldTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const worldId = payload.worldId;
      const time = parseInt(payload.time);

      const wt = sceneState.__data.time.worlds.find(e => e.worldId == worldId);
      if (wt != undefined) {
        wt.time = time;
      } else {
        sceneState.__data.time.worlds.push({ worldId: worldId, time: time });
      }
      yield put.resolve(action('syncData')({}));
    },

    // 修改世界时间
    // 参数: { worldId:xxx, alterValue: xxx }
    *alterWorldTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const worldId = payload.worldId;
      const alterValue = parseInt(payload.alterValue);

      const wt = sceneState.__data.time.worlds.find(e => e.worldId == worldId);
      if (wt != undefined) {
        wt.time += alterValue;
      } else {
        sceneState.__data.time.worlds.push({ worldId: worldId, time: alterValue });
      }
      yield put.resolve(action('syncData')({}));
    },

    // 获取世界时间
    // 参数：{ worldId: xxx }
    *getWorldTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const worldId = payload.worldId;
      const wt = sceneState.__data.time.worlds.find(e => e.worldId == worldId);
      return wt != undefined ? wt.time: undefined;
    },

    // 设置副本时间
    // 参数：{ missionId:xxx, time: xxx }
    *setMissionTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const { missionId, time } = payload;

      const st = sceneState.__data.time.missions.find(e => e.missionId == missionId);
      if (st != undefined) {
        st.time = time;
      } else {
        sceneState.__data.time.missions.push({ missionId: missionId, time: time });
      }
    },

    // 修改副本时间
    // 参数：{ missionId:xxx, time: xxx }
    *alterMissionTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const { missionId, alterValue } = payload;

      let oldTime = 0;
      let newTime = 0;

      const st = sceneState.__data.time.missions.find(e => e.missionId == missionId);
      if (st != undefined) {
        oldTime = st.time;
        st.time += alterValue;
        newTime = st.time;
      } else {
        sceneState.__data.time.missions.push({ missionId: missionId, time: alterValue });
      }

      if (oldTime > 0 && newTime > 0) {
        let dt = new Date();
        dt.setTime(oldTime);
        const oldTimeName = DateTime.DayPeriod.format(dt.getHours());

        dt.setTime(newTime);
        const newTimeName = DateTime.DayPeriod.format(dt.getHours());

        if (!lo.isEqual(oldTimeName, newTimeName)) {
          DeviceEventEmitter.emit(EventKeys.MISSION_TIME_CHANGED, { hours: [oldTimeName, newTimeName] });
        }
      }

      const sceneIds = sceneState.__data.cfgReader.getSceneIdsForMission(missionId);
      if (sceneIds.length > 0) {
        for (let key in sceneIds) {
          const sceneId = sceneIds[key];
          yield put.resolve(action('raiseSceneEvents')({ sceneId: sceneId, eventType: 'timeChanged' }));
        }
      }
    },

    // 获取副本时间
    // 参数：{ missionId: xxx }
    *getMissionTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const { missionId } = payload;

      const st = sceneState.__data.time.missions.find(e => e.missionId == missionId);
      return st != undefined ? st.time: null;
    },

    // 获取场景变量
    // 参数：{ sceneId: xxx }
    *getSceneVars({ payload }, { select }) {
      const sceneState = yield select(state => state.SceneModel);
      const { sceneId } = payload;
      return sceneState.__data.vars.filter(e => e.id.indexOf("{0}/".format(sceneId.toUpperCase())) == 0 );
    },

    // 事件动作处理
    // 参数：{ actions=动作列表,如:['a1', 'a2' ...], ... }
    *processActions({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);

      let allActions = [];
      // 属性动作: item.property
      const propertyActions = PropertyActions.parse(payload);
      if (propertyActions.length > 0) {
        allActions.push(...propertyActions);
      }

      // 预定义配置(在actions段设定)
      const predefineActions = [];
      if (payload.actions != undefined && payload.actions.length > 0) 
        predefineActions.push(...payload.actions);
      else if (payload.clickActions != undefined && payload.clickActions.length > 0) 
        predefineActions.push(...payload.clickActions);
      else if (payload.finishActions != undefined && payload.finishActions.length > 0) 
        predefineActions.push(...payload.finishActions);
      else if (payload.confirmActions != undefined && payload.confirmActions.length > 0) 
        predefineActions.push(...payload.confirmActions);
      else if (payload.eventActions != undefined && payload.eventActions.length > 0) 
        predefineActions.push(...payload.eventActions);

      if (predefineActions.length > 0) {
        const validActions = sceneState.__data.cfgReader.getSceneActions(payload.__sceneId, predefineActions);
        if (validActions != null && validActions.length > 0) {
          // 将预定义动作里面的'变量修改指令'提前执行。
          const varActions = validActions.filter(e => e.cmd == 'var');
          if (varActions.length > 0) {
            allActions.unshift(...varActions);
            const otherActions = validActions.filter(e => e.cmd != 'var');
            if (otherActions.length > 0) allActions.push(...otherActions);
          } else {
            allActions.push(...validActions);
          }
        }
      }

      // 如果没有指定刷新当前选项动作，则默认执行刷新当前选项框。
      if (allActions.find(e => (e.cmd == 'chat' || e.cmd == 'scene' || e.cmd == 'navigate')) == undefined 
        && payload.chatId != undefined 
        && payload.chatId != '') {
        allActions.push({ id: "__chat_{0}".format(payload.chatId), cmd: 'chat', params: payload.chatId });
      }

      let actionIdList = [];
      allActions.forEach(e => { actionIdList.push(e.id) });
      debugMessage("processActions: scene={0} action_list={1}", payload.__sceneId, actionIdList.join(', '));

      for (let key in allActions) {
        const item = allActions[key];
        item.__sceneId = payload.__sceneId;
        debugMessage("---> detail: cmd={0} params=({1})", item.cmd, item.params);
        
        const result = ACTIONS_MAP.find(e => e.cmd == item.cmd);
        if (result != undefined) {
          yield put.resolve(action(result.handler)(item));
        }
      }
    },

    *processTimeoutActions({ payload }, { put }) {
      const timeoutActions = { chatId: payload.chatId, actions: payload.timeoutActions, __sceneId: payload.__sceneId };
      yield put.resolve(action('processActions')(timeoutActions));
    },

    *raiseSceneEvents({ payload }, { put, select }) {
      const sceneId = payload.sceneId;
      const eventType = payload.eventType;
      const sceneState = yield select(state => state.SceneModel);
      const events = sceneState.__data.cfgReader.getSceneEvents(sceneId);
      if (events == null)
        return;

      for (let key in events) {
        const ev = events[key];
        if (!lo.isEqual(ev.type, eventType))
          continue;
        //
        if (!(yield put.resolve(action('testCondition')({ ...ev }))))
          continue;
        //
        yield put.resolve(action('processActions')(ev));
      }
    },

    *__onDialogCommand({ payload }, { select, put }) {
      const sceneState = yield select(state => state.SceneModel);
      const dialog = sceneState.__data.cfgReader.getSceneDialog(payload.__sceneId, payload.params);
      if (dialog != null) {
        if (Array.isArray(dialog.sections)) {
          for (let index = 0; index < dialog.sections.length; index++) {
            const item = dialog.sections[index];
            if (item.btn === undefined) continue
            if (item.btn != undefined && Array.isArray(item.btn)) {
              // 遍历按钮 插入场景id
              for (let b = 0; b < item.btn.length; b++) {
                const btn = item.btn[b];
                btn.__sceneId = dialog.__sceneId
              }
              // 获得有效 按钮数组
              item.btn = yield put.resolve(action('ArticleModel/getValidOptions')({ options: item.btn }))
            }
          }
        } else if ( dialog.sections != undefined ) {
          if(dialog.sections.btn != undefined && Array.isArray(dialog.sections.btn)) {
            // 遍历按钮 插入场景id
            for (let index = 0; index < dialog.sections.btn.length; index++) {
              const btn = dialog.sections.btn[index];
              btn.__sceneId = dialog.__sceneId
            }
            // 获得有效 按钮数组
            dialog.sections.btn = yield put.resolve(action('ArticleModel/getValidOptions')({ options: dialog.sections.btn }))
          }
        }
        Modal.show({ ...dialog, __tokey: payload.__tokey });
      }
    },

    *__onNavigateCommand({ payload }, { }) {
      RootNavigation.navigate(payload.params);
    },

    *__onChatCommand({ payload }, { put }) {
      yield put.resolve(action('raiseSceneEvents')({ sceneId: payload.__sceneId, eventType: 'repeat' }));
      yield put.resolve(action('StoryModel/selectChat')({ chatId: payload.params, ...payload }));
    },

    *__onSceneCommand({ payload }, { put, select }) {
      let sceneId = payload.params;
      if (sceneId == '@previous') {
        const userState = yield select(state => state.UserModel);
        sceneId = (userState.prevSceneId != '') ? userState.prevSceneId : sceneId;
      }
      yield put.resolve(action('enterScene')({ sceneId: sceneId }));
    },

    *__onDelayCommand({ payload }, { call }) {
      yield call(delay, parseInt(payload.params));
    },

    *__onCopperCommand({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      let alterValue = 0;
      if (payload.params.indexOf('%') != -1) {
        alterValue = Math.ceil((parseFloat(payload.params.replace('%', '')) / 100) * userState.copper);
      } else {
        alterValue = parseInt(payload.params);
      }

      if (alterValue != 0) {
        yield put.resolve(action('UserModel/alterCopper')({ value: alterValue }));
      }
    },

    *__onAttrsCommand({ payload }, { put, select }) {
      const affects = [];
      payload.params.forEach(e => {
        let [ key, value ] = e.split(',');
        key = lo.trim(key);
        value = parseInt(lo.trim(value));
        affects.push({ key, value });
      });

      yield put.resolve(action('UserModel/alterAttrs')({ affects, source: "scene" }));
    },

    *__onXiuWeiCommand({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      const alterValue = parseInt(payload.params);

      if (alterValue != 0) {
        yield put.resolve(action('XiuXingModel/addXiuWei')({ value: alterValue }));
      }
    },

    *__onSetWorldTimeCommand({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      yield put.resolve(action('setWorldTime')({ worldId: userState.worldId, time: Date.parse(payload.params) }));
    },

    *__onAlterWorldTimeCommand({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      let alterWorldTime = 0;

      if (payload.params.indexOf('@') == 0) {
        // 隔天隔月增减
        const [type, v1, v2] = payload.params.split('/');
        const wt = yield put.resolve(action('getWorldTime')({ worldId: userState.worldId }));
        if (wt == undefined)
          return;

        if (type == '@day') {
          const nwt = DateTime.toDays(wt, parseInt(v1), parseInt(v2)); // 到第几天的某个时间
          alterWorldTime = nwt - wt;
        }
      } else {
        // 直接增减时间
        alterWorldTime = parseInt(payload.params)
      }

      if (alterWorldTime != 0) {
        yield put.resolve(action('alterWorldTime')({ worldId: userState.worldId, alterValue: alterWorldTime }));
      }
    },

    *__onMissionTimeCommand({ payload }, { put, select }) {
      const { missionId } = payload.params;
      if (payload.params.setTime != undefined) {
        const { setTime } = payload.params;
        const timestamp = DateTime.parseFormat(setTime);
        yield put.resolve(action('setMissionTime')({ missionId: missionId, time: timestamp }));
      } else if (payload.params.alterSeconds != undefined) {
        const { alterSeconds } = payload.params;
        yield put.resolve(action('alterMissionTime')({ missionId: missionId, alterValue: (alterSeconds * 1000) }));
      }
    },

    *__onVarCommand({ payload }, { put, select, call }) {
      const sceneState = yield select(state => state.SceneModel);

      const params = [];
      payload.params.split(' ').forEach((s) => { 
        params.push(s.trim().toUpperCase()); 
      });
    
      const [v1, v2] = params[0].split('/');
      const [varId, sceneId] = (v2 != undefined) ? [v2, v1] : [v1, payload.__sceneId];
      const varRef = VarUtils.getVar(sceneState.__data.vars, sceneId, varId);
      if (varRef == null)
        return;

      const operator = params[1];
      let newVarValue = params[2];

      if (newVarValue == 'OFF')
        newVarValue = 0;
      else if (newVarValue == 'ON')
        newVarValue = 1;
      else
        newVarValue = parseInt(newVarValue);

      let updateValue = varRef.value;
      if (operator == '+=') {
        updateValue += newVarValue; 
      } else if (params[1] == '=') {
        updateValue = newVarValue; 
      } else if (params[1] == '-=') {
        updateValue -= newVarValue; 
      }

      // 整 级 修改好感度
      if (varId === "HAO_GAN_DU" && (operator == '++' || operator == '--')) {
        const { data: npc_config } = yield call(GetNpcDataApi)
        const current_npc_config = npc_config.find(item => item.npcId === payload.__sceneId)
        const npcData = yield put.resolve(action("getNpcData")({ sceneId: payload.__sceneId }))
        let newNpcData = null
        if (operator == '++') {
          newNpcData = current_npc_config.level.find(item => item.grade === (npcData.grade + newVarValue))
        } else {
          newNpcData = current_npc_config.level.find(item => item.grade === (npcData.grade - newVarValue))
        }
        if (newNpcData != null && newNpcData != undefined) {
          updateValue = newNpcData.value
        }
      }

      if (updateValue < varRef.min) updateValue = varRef.min;
      if (updateValue > varRef.max) updateValue = varRef.max;

      if (varRef.value != updateValue) {
        varRef.value = updateValue;
        yield put.resolve(action('syncData')({}));
      }
    },

    *__onUsePropsCommand({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const [propId, num] = payload.params.split(',');
      yield put.resolve(action('PropsModel/use')({ propId: parseInt(propId), num: parseInt(num) }));
    },

    *__onSendPropsCommand({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const [propId, num, showBag] = payload.params.split(',');
      yield put.resolve(action('PropsModel/sendProps')({ propId: parseInt(propId), num: parseInt(num) }));
      
      // 通知界面显示背包动效
      if (showBag != undefined && lo.isEqual(showBag, 'showBag')) {
        DeviceEventEmitter.emit(EventKeys.ARTICLE_SHOW_BAG_ANIMATION);
      }
      // 如果当前场景存在剧情道具，则通知刷新
      if (!lo.isEmpty(payload.__sceneId)) {
        const scene = sceneState.__data.cfgReader.getScene(payload.__sceneId);
        if (scene != null && lo.isArray(scene.plotPropsId) && scene.plotPropsId.length > 0) {
          DeviceEventEmitter.emit(EventKeys.REFRESH_MISSION_PROPSBAR);
        }
      }
    },

    *__onChallengeCommand({ payload }, { put }) {
      ArenaUtils.show({ challengeId: payload.params });
    },

    *__onChapterCommand({ payload }, { put }) {
      const index = payload.params.indexOf('_');
      const id = payload.params.substring(0, index);
      const path = payload.params.substring(index + 1);
      yield put.resolve(action('ArticleModel/cleanup')({}));
      yield put.resolve(action('ArticleModel/show')({ id, path }));
    },

    *__onSelectorCommand({ payload }, { put }) {
      const data = payload.params.data;
      CarouselUtils.show({ 
        data, 
        initialIndex: Math.floor(data.length / 2), 
        onSelect: (p) => {
          if (p.item.toChapter != undefined) {
            AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: p.item.toChapter, __sceneId: payload.__sceneId } });
          }
        }
      });
    },

    *__onShockCommand({ payload }, { put }) {
      let [type, delay, count] = payload.params.split('/');
      count = count == undefined ? 4 : parseInt(count)
      delay = delay == undefined ? 4 : parseInt(delay)
      Shock.shockShow(type, delay, count);
    },

    *__onSoundsCommand({ payload }, { put }) {
      const type = inReaderMode() ? 'readerVolume' : 'masterVolume';
      payload.params.forEach(e => {
        if (e.stopBGM != undefined && e.stopBGM) {
          stopBGM();
          return
        }
        playSound({ ...e, type });
      });
    },

    *__onCollectCommand({ payload }, { put }) {
      const collectId = payload.params;
      CollectUtils.show(collectId);
    },

    *__onMapPointCommand({ payload }, { put }) {
      DeviceEventEmitter.emit(EventKeys.SCENE_MAP_MOVE, payload.params);
    },

    *__onGamesCommand({ payload }, { put }) {
      payload.params.__sceneId = payload.__sceneId; // 传入场景ID，用于一些列的跳转动作。
      Games.show(payload.params);
    },

    *__onAnimationsCommand({ payload }, { put }) {
      EffectAnimations.show(payload.params, payload.__sceneId);
    },

    *__onDropIdsCommand({ payload }, { put }) {
      yield put.resolve(action('DropsModel/process')({ dropIds: payload.params }));
    },

    *__onShopCommand({ payload }, { put }) {
      ShopsUtils.show(payload.params);
    },

    *__onOpenUICommand({ payload }, { put }) {
      const name = payload.params;
      OpenUI.open(lo.trim(name));
    },

    *__onMsgCommand({ payload }, { put }) {
      const p = payload.params;
      yield put.resolve(action(p.action)(p.params));
    },

    *syncData({ }, { select, call }) {
      const sceneState = yield select(state => state.SceneModel);
      yield call(LocalStorage.set, LocalCacheKeys.SCENES_DATA, { 
        vars: sceneState.__data.vars, 
        time: sceneState.__data.time,
      });
    },

    // 获取场景配置
    // 参数: { sceneId: xxx}
    *getScene({ payload }, { select }) {
      const sceneState = yield select(state => state.SceneModel);
      return (sceneState.__data.cfgReader != null)
                ? sceneState.__data.cfgReader.getScene(payload.sceneId)
                : null;
    },

    // 获取 NPC 数据
    // 参数: { sceneId: xxx}
    *getNpcData({ payload }, { select,call }) {
      const { sceneId } = payload;
      const sceneState = yield select(state => state.SceneModel);
      const npc_SceneConfig = (sceneState.__data.cfgReader != null)
        ? sceneState.__data.cfgReader.getScene(payload.sceneId)
        : null;
      if (npc_SceneConfig === null) return null
      const npc_SceneVars = sceneState.__data.vars.filter(e => e.id.indexOf("{0}/".format(sceneId.toUpperCase())) == 0);
      const hao_gan_du = npc_SceneVars.find(
        item => item.id === `${sceneId.toUpperCase()}/HAO_GAN_DU`,
      ).value;

      // npc 配置数据
      const { data: npc_ConfigData } = yield call(GetNpcDataApi)
      const npc_data = npc_ConfigData.find(item => item.npcId === sceneId)
      if (npc_data == undefined) return null
      const npc_level = npc_data.level.filter(item => item.value <= hao_gan_du).sort((a, b) => a.grade - b.grade)

      return {
        name: npc_SceneConfig?.name,
        avatarId: npc_SceneConfig?.avatarId,
        hao_gan_du,
        ...npc_level[npc_level.length - 1]
      }
    },

    // 获取对话配置
    // 参数: { sceneId: xxx, chatId: xxx }
    *getChat({ payload }, { call, put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      return (sceneState.__data.cfgReader != null)
                ? sceneState.__data.cfgReader.getSceneChat(payload.sceneId, payload.chatId)
                : null;
    },

    // 获取对话框配置
    // 参数: { sceneId: xxx, dialogId: xxx }
    *getDialog({ payload }, { select }) {
      const sceneState = yield select(state => state.SceneModel);
      return (sceneState.__data.cfgReader != null)
                ? sceneState.__data.cfgReader.getSceneDialog(payload.sceneId, payload.dialogId)
                : null;
    },

    // 测试条件是否成立，支持andVarsOn,andVarsOff,andVarsValue,orVarsOn,orVarsOff,orVarsValue
    // 参数: { ... }
    *testCondition({ payload }, { call, put, select }) {
      const userState = yield select(state => state.UserModel);
      const sceneState = yield select(state => state.SceneModel);

      const varFinder = (id) => {
        for (let key in sceneState.__data.vars) {
          const item = sceneState.__data.vars[key];
          if (item.id == id)
            return item;
        }
        return null;
      };

      let failure = false;
      if (payload.andVarsOn != undefined) {
        for (let key in payload.andVarsOn) {
          const [v1, v2] = payload.andVarsOn[key].split('/');
          const [varId, sceneId] = (v2 != undefined) ? [v2, v1] : [v1, payload.__sceneId];
          const varRef = VarUtils.getVar(sceneState.__data.vars, sceneId, varId);
          if (varRef == null || varRef.value <= 0) {
            failure = true;
            break;
          }
        }
      }
      if (!failure && (payload.andVarsOff != undefined)) {
        for (let key in payload.andVarsOff) {
          const [v1, v2] = payload.andVarsOff[key].split('/');
          const [varId, sceneId] = (v2 != undefined) ? [v2, v1] : [v1, payload.__sceneId];
          const varRef = VarUtils.getVar(sceneState.__data.vars, sceneId, varId);
          if (varRef == null || varRef.value > 0) {
            failure = true;
            break;
          }
        }
      }
      if (!failure && (payload.andVarsValue != undefined)) {
        for (let key in payload.andVarsValue) {
          const cond = payload.andVarsValue[key];

          let params = [];
          cond.split(' ').forEach(e => params.push(e.trim()));
          if (params.length != 3) continue;
          
          const [id, operator, _value] = params;
          const value = parseInt(_value);
          let compareValue = 0;

          if (id == '@world_time_hours') {
            const value = yield put.resolve(action('getWorldTime')({ worldId: userState.worldId }));
            compareValue = (value != undefined) ? DateTime.HourUtils.fromMillis(value) : 0;
          } else if (id.indexOf('@missionTime_') == 0) {
            const [_k, v] = id.split('_');
            const missionId = lo.trim(v);
            const value = yield put.resolve(action('getMissionTime')({ missionId: missionId }));
            compareValue = (value != undefined) ? DateTime.HourUtils.fromMillis(value) : 0;
          } else if (id.indexOf('@props_') == 0) {
            const [_k, v] = id.split('_');
            const propId = parseInt(v);
            compareValue = yield put.resolve(action('PropsModel/getPropNum')({ propId: propId }));
          } else if (id.indexOf('@clues_') == 0) { // 线索条件判断
            const [_k, v] = id.split('_');
            const clueId = lo.trim(v);
            const validList = yield put.resolve(action('CluesModel/getUnusedClues')({}));
            if (lo.isArray(validList)) {
              const found = validList.find(e => lo.isEqual(e.id, clueId));
              if (found != undefined) {
                compareValue = found.status;
              }
            } else {
              debugMessage("Invalid (CluesModel/getUnusedClues) result");
              continue;
            }
          } else if (id.indexOf('@attr_') == 0) { // 属性条件判断
            const attrs = yield put.resolve(action('UserModel/getAttrs')({}));
            const [_k, v] = id.split('_');
            const attr = lo.trim(v);
            const currentAttr = attrs.find(item => item.key === attr)
            if ( currentAttr != undefined ){
              compareValue = currentAttr.value
            } else {
              debugMessage("Invalid (属性名 无效) result");
              continue;
            }
          } else if (id.indexOf('@') == 0) {
            debugMessage("Unknown '{0}' identifier!!!", id);
            continue;
          } else {
            const [v1, v2] = id.split('/');
            const [varId, sceneId] = (v2 != undefined) ? [v2, v1] : [v1, payload.__sceneId];
            const varRef = VarUtils.getVar(sceneState.__data.vars, sceneId, varId);
            if (varRef == null) {
              failure = true;
              break;
            }
            compareValue = varRef.value;
          }

          if ((operator == '==' && !(compareValue == value))
              || ((operator == '>') && !(compareValue > value))
              || ((operator == '<') && !(compareValue < value))
              || ((operator == '>=') && !(compareValue >= value))
              || ((operator == '<=') && !(compareValue <= value))
              || ((operator == '!=') && !(compareValue != value))) {
              failure = true;
              break;
          }
        }
      }
      return !failure;
    },

    // 批量测试条件是否成立
    *testConditionArray({ payload }, { call, put, select }) {
      if (!lo.isArray(payload))
        return false;
      
      const result = [];
      for (let key in payload) {
        const item = payload[key];
        result.push(yield put.resolve(action('testCondition')({ ...item })));
      }
      return result;
    }

  },
  
  reducers: {
    updateState(state, { payload }) {
      return { 
        ...state,
        ...payload
      };
    },
  },

  subscriptions: {
    registerReloadEvent({ dispatch }) {
      EventListeners.register('reload', (msg) => {
        return dispatch({ 'type':  'reload'});
      });
    },
  }
}
