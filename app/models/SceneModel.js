
import {
  action,
  delay,
  debugMessage,
  errorMessage,
  LocalCacheKeys
} from "../constants";

import {
  GetSceneDataApi,
} from "../services/GetSceneDataApi";

import LocalStorage from '../utils/LocalStorage';
import * as DateTime from '../utils/DateTimeUtils';
import * as RootNavigation from '../utils/RootNavigation';
import SceneConfigReader from "../utils/SceneConfigReader";

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

    return allActions;
  }
}

const ACTIONS_MAP = [
  { cmd: 'dialog',        handler: '__onDialogCommand'},
  { cmd: 'navigate',      handler: '__onNavigateCommand'},
  { cmd: 'chat',          handler: '__onChatCommand'},
  { cmd: 'scene',         handler: '__onSceneCommand'},
  { cmd: 'delay',         handler: '__onDelayCommand'},
  { cmd: 'copper',        handler: '__onCopperCommand'},
  { cmd: 'wtime',         handler: '__onWorldTimeCommand' },
  { cmd: 'var',           handler: '__onVarCommand'},
  { cmd: 'useProps',      handler: '__onUsePropsCommand'},
  { cmd: 'sendProps',     handler: '__onSendPropsCommand'},
];

const SCENES_LIST = [
  'scene_1', 'scene_2', 'scene_3', 
  'scene_4', 'scene_5', 'scene_6', 
  'scene_7', 'scene_8',
  'npc_1',
];

let PROGRESS_UNIQUE_ID = 1230000;

export default {
  namespace: 'SceneModel',

  state: {
    data: {
      // 场景自定义变量
      _vars: [],

      // 时间线
      _time: {
        scenes: [], // 场景时间(副本)
        worlds: [   // 世界出生点时间(2012/29998/49998)
          { worldId: 0, time: 1325376000000 }, 
          { worldId: 1, time: 884478240000000 }, 
          { worldId: 2, time: 1515617280000000 }
        ],
      },

      // 场景配置访问器
      _cfgReader: null,
    }
  },

  effects: {
    // 重新加载&初始化
    *reload({ }, { call, put, select }) {
      const sceneState = yield select(state => state.SceneModel);

      // 获取场景配置
      let scenes = [];
      for (let key in SCENES_LIST) {
        const sceneId = SCENES_LIST[key];
        const data = yield call(GetSceneDataApi, sceneId);
        if (data.scenes != undefined) {
          data.scenes.forEach((e) => {
            // 标注NPC场景
            if (e.isNpc == undefined) e.isNpc = false;
            // 标注进度条缺失的唯一ID
            if (e.chats != undefined) {
              for (let key in e.chats) {
                const chat = e.chats[key];
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
            //
            scenes.push(e);
          });
        }
      }

      // 加载本地缓存
      const sceneCache = yield call(LocalStorage.get, LocalCacheKeys.SCENES_DATA);
      if (sceneCache != null && sceneCache.time != null) {
        sceneState.data._time = sceneCache.time;
      }
      
      // 加载匹配的变量缓存
      sceneState.data._vars.length = 0;
      sceneState.data._cfgReader = new SceneConfigReader(scenes);
      sceneState.data._cfgReader.getSceneIds().forEach((sceneId) => {
        const vars = sceneState.data._cfgReader.getSceneVars(sceneId);
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
            sceneState.data._vars.push({ ...e, value: value, id: uniVarId });
          });
        }
      });
    },

    // 进入场景
    // 参数: { sceneId: 场景ID }
    *enterScene({ payload }, { put, call, select }) {
      const userState = yield select(state => state.UserModel);
      const sceneState = yield select(state => state.SceneModel);
      const sceneId = payload.sceneId;
      
      const scene = sceneState.data._cfgReader.getScene(sceneId);
      if (scene == null) {
        errorMessage("SceneId={0} not found.", sceneId);
        return;
      }

      // 场景必须在这里
      RootNavigation.navigate('Home');
      if (sceneId !== userState.sceneId) {
        // 只有场景发生变化才更新记录的上一个场景。
        userState.prevSceneId = userState.sceneId;
      }
      userState.sceneId = sceneId;
      
      yield put.resolve(action('raiseSceneEvents')({ sceneId: sceneId, eventType: 'enter' }));
      yield put.resolve(action('UserModel/syncData')({}));
    },

    // 设置世界时间
    // 参数：{ worldId:xxx, time: xxx }
    *setWorldTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const worldId = payload.worldId;
      const time = parseInt(payload.time);

      const wt = sceneState.data._time.worlds.find(e => e.worldId == worldId);
      if (wt != undefined) {
        wt.time = time;
      } else {
        sceneState.data._time.worlds.push({ worldId: worldId, time: time });
      }
    },

    // 修改世界时间
    // 参数: { worldId:xxx, alertValue: xxx }
    *alertWorldTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const worldId = payload.worldId;
      const alertValue = parseInt(payload.alertValue);

      const wt = sceneState.data._time.worlds.find(e => e.worldId == worldId);
      if (wt != undefined) {
        wt.time += alertValue;
      } else {
        sceneState.data._time.worlds.push({ worldId: worldId, time: alertValue });
      }
    },

    // 获取世界时间
    // 参数：{ worldId: xxx }
    *getWorldTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const worldId = payload.worldId;
      const wt = sceneState.data._time.worlds.find(e => e.worldId == worldId);
      return wt != undefined ? wt.time: undefined;
    },

    // 设置场景时间
    // 参数：{ sceneId:xxx, time: xxx }
    *setSceneTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const sceneId = payload.sceneId;
      const time = payload.time;

      const st = sceneState.data._time.scenes.find(e => e.sceneId == sceneId);
      if (st != undefined) {
        st.time = time;
      } else {
        sceneState.data._time.scenes.push({ sceneId: sceneId, time: time });
      }
    },

    // 修改场景时间
    // 参数：{ sceneId:xxx, time: xxx }
    *alertSceneTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const sceneId = payload.sceneId;
      const alertValue = payload.alertValue;

      const st = sceneState.data._time.scenes.find(e => e.sceneId == sceneId);
      if (st != undefined) {
        st.time += alertValue;
      } else {
        sceneState.data._time.scenes.push({ sceneId: sceneId, time: alertValue });
      }
    },

    // 获取场景时间
    // 参数：{ worldId: xxx }
    *getSceneTime({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const sceneId = payload.sceneId;
      const st = sceneState.data._time.scenes.find(e => e.sceneId == sceneId);
      return st != undefined ? st.time: undefined;
    },

    // 获取场景变量
    // 参数：{ sceneId: xxx }
    *getSceneVars({ payload }, { select }) {
      const sceneState = yield select(state => state.SceneModel);
      const { sceneId } = payload;
      return sceneState.data._vars.filter(e => e.id.indexOf("{0}/".format(sceneId.toUpperCase())) == 0 );
    },

    // 事件动作处理
    // 参数：{ actions=动作列表,如:['a1', 'a2' ...], ... }
    *processActions({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      const sceneState = yield select(state => state.SceneModel);
      const sceneId = userState.sceneId;

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
        const validActions = sceneState.data._cfgReader.getSceneActions(sceneId, predefineActions);
        if (validActions != null && validActions.length > 0) {
          allActions.push(...validActions);
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
      debugMessage("processActions: scene={0} action_list={1}", sceneId, actionIdList.join(', '));

      for (let key in allActions) {
        const item = allActions[key];
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
      const events = sceneState.data._cfgReader.getSceneEvents(sceneId);
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

    *__onDialogCommand({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      const sceneState = yield select(state => state.SceneModel);   
      let dialog = sceneState.data._cfgReader.getSceneDialog(userState.sceneId, payload.params);
      if (dialog != null) {
        yield put.resolve(action('MaskModel/showDialog')({ ...dialog }));
      }
    },

    *__onNavigateCommand({ payload }, { }) {
      RootNavigation.navigate(payload.params);
    },

    *__onChatCommand({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      yield put.resolve(action('raiseSceneEvents')({ sceneId: userState.sceneId, eventType: 'repeat' }));
      yield put.resolve(action('StoryModel/selectChat')({ chatId: payload.params }));
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
      const userState = yield select(state => state.UserModel);
      const sceneState = yield select(state => state.SceneModel);

      const params = [];
      payload.params.split(' ').forEach((s) => { 
        params.push(s.trim().toUpperCase()); 
      });
    
      const varRef = VarUtils.getVar(sceneState.data._vars, userState.sceneId, params[0]);
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
      const [propsId, num] = payload.params.split(',');
      yield put.resolve(action('PropsModel/use')({ propsId: parseInt(propsId), num: parseInt(num) }));
    },

    *__onSendPropsCommand({ payload }, { put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      const [propsId, num] = payload.params.split(',');
      yield put.resolve(action('PropsModel/sendProps')({ propsId: parseInt(propsId), num: parseInt(num) }));
    },

    *syncData({ }, { select, call }) {
      const sceneState = yield select(state => state.SceneModel);
      yield call(LocalStorage.set, LocalCacheKeys.SCENES_DATA, { 
        vars: sceneState.data._vars, 
        time: sceneState.data._time,
      });
    },

    // 获取场景配置
    // 参数: { sceneId: xxx}
    *getScene({ payload }, { select }) {
      const sceneState = yield select(state => state.SceneModel);
      return (sceneState.data._cfgReader != null)
                ? sceneState.data._cfgReader.getScene(payload.sceneId)
                : null;
    },

    // 获取对话配置
    // 参数: { sceneId: xxx, chatId: xxx }
    *getChat({ payload }, { call, put, select }) {
      const sceneState = yield select(state => state.SceneModel);
      return (sceneState.data._cfgReader != null)
                ? sceneState.data._cfgReader.getSceneChat(payload.sceneId, payload.chatId)
                : null;
    },

    // 获取对话框配置
    // 参数: { sceneId: xxx, dialogId: xxx }
    *getDialog({ payload }, { select }) {
      const sceneState = yield select(state => state.SceneModel);
      return (sceneState.data._cfgReader != null)
                ? sceneState.data._cfgReader.getSceneDialog(payload.sceneId, payload.dialogId)
                : null;
    },

    // 测试条件是否成立，支持andVarsOn,andVarsOff,andVarsValue,orVarsOn,orVarsOff,orVarsValue
    // 参数: { ... }
    *testCondition({ payload }, { call, put, select }) {
      const userState = yield select(state => state.UserModel);
      const sceneState = yield select(state => state.SceneModel);

      const varFinder = (id) => {
        for (let key in sceneState.data._vars) {
          const item = sceneState.data._vars[key];
          if (item.id == id)
            return item;
        }
        return null;
      };

      let failure = false;
      if (payload.andVarsOn != undefined) {
        for (let key in payload.andVarsOn) {
          const [v1, v2] = payload.andVarsOn[key].split('/');
          const [varId, sceneId] = (v2 != undefined) ? [v2, v1] : [v1, userState.sceneId];
          const varRef = VarUtils.getVar(sceneState.data._vars, sceneId, varId);
          if (varRef.value <= 0) {
            failure = true;
            break;
          }
        }
      }
      if (!failure && (payload.andVarsOff != undefined)) {
        for (let key in payload.andVarsOff) {
          const [v1, v2] = payload.andVarsOff[key].split('/');
          const [varId, sceneId] = (v2 != undefined) ? [v2, v1] : [v1, userState.sceneId];
          const varRef = VarUtils.getVar(sceneState.data._vars, sceneId, varId);
          if (varRef.value > 0) {
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
            const value = yield put.resolve(action('getSceneTime')({ sceneId: userState.sceneId }));
            compareValue = (value != undefined) ? DateTime.HourUtils.fromMillis(value) : 0;
          } else if (id.indexOf('@props_') == 0) {
            const [_k, v] = id.split('_');
            const propsId = parseInt(v);
            compareValue = yield put.resolve(action('PropsModel/getPropsNum')({ propsId: propsId }));
          } else if (id.indexOf('@') == 0) {
            debugMessage("Unknown '{0}' identifier!!!", id);
            continue;
          } else {
            const [v1, v2] = id.split('/');
            const [varId, sceneId] = (v2 != undefined) ? [v2, v1] : [v1, userState.sceneId];
            const varRef = VarUtils.getVar(sceneState.data._vars, sceneId, varId);
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
    setup({ dispatch }) {
      dispatch({ 'type':  'reload'});
    },
  }
}
