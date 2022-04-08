
import {
  action,
  delay,
  debugMessage,
  errorMessage,
  LocalCacheKeys,
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
import EventListeners from '../utils/EventListeners';
import * as RootNavigation from '../utils/RootNavigation';
import SceneConfigReader from "../utils/SceneConfigReader";
import Modal from "../components/modal";
import Shock from '../components/shock';

class VarUtils {
  static generateVarUniqueId(sceneId, varId) {
    return "{0}/{1}".format(sceneId, varId).toUpperCase();
  }

  static getVar(vars, sceneId, varId) {
    const uniVarId = VarUtils.generateVarUniqueId(sceneId, varId);
    for (let key in vars) {
      const item = vars[key];
      if (item.id == uniVarId)
        return item;
    }
    return null;
  }
}

// 提供便捷的属性指定动作配置, 如: { varsOn: [...] }
class PropertyActionBuilder {
  static build(payload) {
    let allActions = [];

    // 生成变量变动
    if (payload.varsOn != undefined && Array.isArray(payload.varsOn)) {
      let varsActions = [];
      payload.varsOn.forEach(e => {
        varsActions.push({ id: "__var_{0}_on".format(e), cmd: 'var', params: "{0} = ON".format(e) });
      });
      allActions.push(...varsActions);
    }
    if (payload.varsOff != undefined && Array.isArray(payload.varsOff)) {
      let varsActions = [];
      payload.varsOff.forEach(e => {
        varsActions.push({ id: "__var_{0}_off".format(e), cmd: 'var', params: "{0} = OFF".format(e) });
      });
      allActions.push(...varsActions);
    }

    // 生成铜币修改动作
    if (payload.alertCopper != undefined && typeof(payload.alertCopper) == 'string') {
      allActions.push({ id: "__copper_{0}".format(payload.alertCopper), cmd: 'copper', params: payload.alertCopper });
    }

    // 生成世界时间修改动作
    if (payload.alertWorldTime != undefined && typeof(payload.alertWorldTime) == 'string') {
      allActions.push({ id: "__wtime_{0}".format(payload.alertWorldTime), cmd: 'wtime', params: payload.alertWorldTime });
    }

    // 使用道具
    if (payload.useProps != undefined && typeof(payload.useProps) == 'string') {
      allActions.push({ id: "__useProps_{0}".format(payload.useProps), cmd: 'useProps', params: payload.useProps });
    }

    // 发送道具
    if (payload.sendProps != undefined && typeof(payload.sendProps) == 'string') {
      allActions.push({ id: "__sendProps_{0}".format(payload.sendProps), cmd: 'sendProps', params: payload.sendProps });
    }

    // 挂机序列
    if (payload.seqId != undefined && typeof(payload.seqId) == 'string') {
      allActions.push({ id: "__seqId_{0}".format(payload.seqId), cmd: 'seqId', params: payload.seqId });
    }

    // 生成对话框动作
    if (payload.dialogs != undefined && Array.isArray(payload.dialogs)) {
      let dialogActions = [];
      payload.dialogs.forEach(e => {
        dialogActions.push({ id: "__dialog_{0}".format(e), cmd: 'dialog', params: e });
      });
      allActions.push(...dialogActions);
    }

    // 生成对话跳转动作
    if (payload.nextChat != undefined && typeof(payload.nextChat) == 'string') {
      allActions.push({ id: "__chat_{0}".format(payload.nextChat), cmd: 'chat', params: payload.nextChat });
    }

    // 生成切换场景动作
    if (payload.toScene != undefined && typeof(payload.toScene) == 'string') {
      allActions.push({ id: "__scene_{0}".format(payload.toScene), cmd: 'scene', params: payload.toScene });
    }

    // 生成切换章节动作
    if (payload.toChapter != undefined && typeof(payload.toChapter) == 'string') {
      allActions.push({ id: "__chapter_{0}".format(payload.toChapter), cmd: 'chapter', params: payload.toChapter });
    }

    // 生成震屏动作
    if (payload.shock != undefined && typeof(payload.shock) == 'string') {
      allActions.push({ id: "__shock_{0}".format(payload.shock), cmd: 'shock', params: payload.shock });
    }

    return allActions;
  }
}

// 场景配置注入相应的属性
class ScenePropertyInjectBuilder {

  static injectProgressId(scene) {
    // 标注进度条缺失的唯一ID
    if (scene.chats != undefined) {
      for (let key in scene.chats) {
        const chat = scene.chats[key];
        if (chat.options != undefined) {
          chat.options.forEach(o => {
            if (o.duration != undefined 
              && o.duration > 0 
              && o.progressId == undefined) {
              o.progressId = PROGRESS_UNIQUE_ID++;
            }
          });
        }
      }
    }
  }

  static injectSceneId(scene) {
    const sceneId = scene.id;
    if (lo.isArray(scene.events)) {
      scene.events.forEach(e => e.__sceneId = sceneId);
    }
    if (lo.isArray(scene.actions)) {
      scene.actions.forEach(e => e.__sceneId = sceneId);
    }
    if (lo.isArray(scene.chats)) {
      scene.chats.forEach(e => {
        if (lo.isArray(e.options)) {
          e.options.forEach(x => x.__sceneId = sceneId);
        }
      });
    }
    if (lo.isArray(scene.dialogs)) {
      scene.dialogs.forEach(e => e.__sceneId = sceneId);
    }
  }

}

const ACTIONS_MAP = [
  { cmd: 'dialog',        handler: '__onDialogCommand' },
  { cmd: 'navigate',      handler: '__onNavigateCommand' },
  { cmd: 'chat',          handler: '__onChatCommand' },
  { cmd: 'scene',         handler: '__onSceneCommand' },
  { cmd: 'delay',         handler: '__onDelayCommand' },
  { cmd: 'copper',        handler: '__onCopperCommand' },
  { cmd: 'wtime',         handler: '__onWorldTimeCommand' },
  { cmd: 'var',           handler: '__onVarCommand' },
  { cmd: 'useProps',      handler: '__onUsePropsCommand' },
  { cmd: 'sendProps',     handler: '__onSendPropsCommand' },
  { cmd: 'seqId',         handler: '__onSeqIdCommand' },
  { cmd: 'chapter',       handler: '__onChapterCommand' },
  { cmd: 'shock',         handler: '__onShockCommand' },
];

let PROGRESS_UNIQUE_ID = 1230000;

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

            //
            scenes.push(e);
          });
        }
      }

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
    // 参数: { worldId:xxx, alertValue: xxx }
    *alertWorldTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const worldId = payload.worldId;
      const alertValue = parseInt(payload.alertValue);

      const wt = sceneState.__data.time.worlds.find(e => e.worldId == worldId);
      if (wt != undefined) {
        wt.time += alertValue;
      } else {
        sceneState.__data.time.worlds.push({ worldId: worldId, time: alertValue });
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
    *alertSceneTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const sceneId = payload.sceneId;
      const alertValue = payload.alertValue;

      const st = sceneState.__data.time.scenes.find(e => e.sceneId == sceneId);
      if (st != undefined) {
        st.time += alertValue;
      } else {
        sceneState.__data.time.scenes.push({ sceneId: sceneId, time: alertValue });
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
      const propertyActions = PropertyActionBuilder.build(payload);
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
      const timeoutActions = { chatId: payload.chatId, actions: payload.timeoutActions };
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
        Modal.show(dialog);
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
      let alertValue = 0;
      if (payload.params.indexOf('%') != -1) {
        alertValue = Math.ceil((parseFloat(payload.params.replace('%', '')) / 100) * userState.copper);
      } else {
        alertValue = parseInt(payload.params);
      }

      if (alertValue != 0) {
        yield put.resolve(action('UserModel/alertCopper')({ value: alertValue }));
      }
    },

    *__onWorldTimeCommand({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      let alertWorldTime = 0;

      if (payload.params.indexOf('@') == 0) {
        // 隔天隔月增减
        const [type, v1, v2] = payload.params.split('/');
        const wt = yield put.resolve(action('getWorldTime')({ worldId: userState.worldId }));
        if (wt == undefined)
          return;

        if (type == '@day') {
          const nwt = DateTime.toDays(wt, parseInt(v1), parseInt(v2)); // 到第几天的某个时间
          alertWorldTime = nwt - wt;
        }
      } else {
        // 直接增减时间
        alertWorldTime = parseInt(payload.params)
      }

      if (alertWorldTime != 0) {
        yield put.resolve(action('alertWorldTime')({ worldId: userState.worldId, alertValue: alertWorldTime }));
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
      const [propId, num] = payload.params.split(',');
      yield put.resolve(action('PropsModel/sendProps')({ propId: parseInt(propId), num: parseInt(num) }));
    },

    *__onSeqIdCommand({ payload }, { put }) {
      yield put.resolve(action('ArenaModel/start')({ seqId: payload.params }));
      RootNavigation.navigate('Arena');
    },

    *__onChapterCommand({ payload }, { put }) {
      const index = payload.params.indexOf('_');
      const id = payload.params.substring(0, index);
      const path = payload.params.substring(index + 1);
      yield put.resolve(action('ArticleModel/show')({ id, path }));
    },

    *__onShockCommand({ payload }, { put }) {
      let [type, delay, count] = payload.params.split('/');
      count = count == undefined ? 4 : parseInt(count)
      delay = delay == undefined ? 4 : parseInt(delay)
      Shock.shockShow(type, delay, count);
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
          
          const [id, operator, value] = params;
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
        dispatch({ 'type':  'reload'});
      });
    },
  }
}
