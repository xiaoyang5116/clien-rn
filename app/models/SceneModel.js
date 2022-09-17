
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
import { playSound } from "../components/sound/utils";
import Games from "../components/games";
import EffectAnimations from "../components/effects";
import ShopsUtils from '../utils/ShopsUtils';
import { VarUtils } from "./scene/utils";
import { ScenePropertyInjectBuilder } from "./scene/builders";
import { ACTIONS_MAP, PropertyActions } from "./scene/actions";
import OpenUI from "../pages/OpenUI";

export default {
  namespace: 'SceneModel',

  state: {
    __data: {
      // 场景自定义变量
      vars: [],

      // 时间线
      time: {
        scenes: [], // 场景时间(副本)
        worlds: [   // 世界出生点时间(2012/29998/49998)
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
    },

    // 获取世界时间
    // 参数：{ worldId: xxx }
    *getWorldTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const worldId = payload.worldId;
      const wt = sceneState.__data.time.worlds.find(e => e.worldId == worldId);
      return wt != undefined ? wt.time: undefined;
    },

    // 设置场景时间
    // 参数：{ sceneId:xxx, time: xxx }
    *setSceneTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const sceneId = payload.sceneId;
      const time = payload.time;

      const st = sceneState.__data.time.scenes.find(e => e.sceneId == sceneId);
      if (st != undefined) {
        st.time = time;
      } else {
        sceneState.__data.time.scenes.push({ sceneId: sceneId, time: time });
      }
    },

    // 修改场景时间
    // 参数：{ sceneId:xxx, time: xxx }
    *alterSceneTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const sceneId = payload.sceneId;
      const alterValue = payload.alterValue;

      const st = sceneState.__data.time.scenes.find(e => e.sceneId == sceneId);
      if (st != undefined) {
        st.time += alterValue;
      } else {
        sceneState.__data.time.scenes.push({ sceneId: sceneId, time: alterValue });
      }
    },

    // 获取场景时间
    // 参数：{ worldId: xxx }
    *getSceneTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const sceneId = payload.sceneId;
      const st = sceneState.__data.time.scenes.find(e => e.sceneId == sceneId);
      return st != undefined ? st.time: undefined;
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
        if (ev.type != eventType)
          continue;
        //
        if (!(yield put.resolve(action('testCondition')({ ...ev }))))
          continue;
        //
        yield put.resolve(action('processActions')(ev));
      }
    },

    *__onDialogCommand({ payload }, { select }) {
      const sceneState = yield select(state => state.SceneModel);
      const dialog = sceneState.__data.cfgReader.getSceneDialog(payload.__sceneId, payload.params);
      if (dialog != null) {
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

      yield put.resolve(action('UserModel/alterAttrs')(affects));
    },

    *__onXiuXingCommand({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      const alterValue = parseInt(payload.params);

      if (alterValue != 0) {
        yield put.resolve(action('UserModel/addXiuXing')({ value: alterValue }));
      }
    },

    *__onWorldTimeCommand({ payload }, { put, select }) {
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

    *__onVarCommand({ payload }, { put, select }) {
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

    *__onSeqIdCommand({ payload }, { put }) {
      yield put.resolve(action('ArenaModel/start')({ seqId: payload.params }));
      RootNavigation.navigate('Arena');
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
      EffectAnimations.show(payload.params);
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
          } else if (id == '@scene_time_hours') {
            const value = yield put.resolve(action('getSceneTime')({ sceneId: payload.__sceneId }));
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
