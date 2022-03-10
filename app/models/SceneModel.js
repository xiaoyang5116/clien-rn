
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
    return "{0}_{1}".format(sceneId, varId).toUpperCase();
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

const ACTIONS_MAP = [
  { cmd: 'aside',         handler: '__onAsideCommand'},
  { cmd: 'dialog',        handler: '__onDialogCommand'},
  { cmd: 'navigate',      handler: '__onNavigateCommand'},
  { cmd: 'chat',          handler: '__onChatCommand'},
  { cmd: 'scene',         handler: '__onSceneCommand'},
  { cmd: 'delay',         handler: '__onDelayCommand'},
  { cmd: 'copper',        handler: '__onCopperCommand'},
  { cmd: 'wtime',         handler: '__onWorldTimeCommand' },
  { cmd: 'var',           handler: '__onVarCommand'},
];

const SCENES_LIST = [
  'scene_1', 'scene_2', 'scene_3', 
  'scene_4', 'scene_5', 'scene_6', 
  'scene_7', 'scene_8'
];

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
            scenes.push(e);
          });
        }
      }

      // 加载本地缓存
      const cacheData = yield call(LocalStorage.get, LocalCacheKeys.SCENES_DATA);
      if (cacheData != null && cacheData.time != null) {
        sceneState.data._time = cacheData.time;
      }
      
      // 加载匹配的变量缓存
      sceneState.data._vars.length = 0;
      sceneState.data._cfgReader = new SceneConfigReader(scenes);
      sceneState.data._cfgReader.getSceneIds().forEach((sceneId) => {
        const vars = sceneState.data._cfgReader.getSceneVars(sceneId);
        if (vars != null) {
          vars.forEach((e) => {
            let value = e.defaulValue;
            const uniVarId = "{0}_{1}".format(sceneId, e.id).toUpperCase();
            if (cacheData != null && cacheData.vars != null) {
              const varCache = VarUtils.getVar(cacheData.vars, sceneId, e.id);
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
      userState.sceneId = sceneId;
      
      yield put.resolve(action('processActions')({ actions: scene.enter_actions }));
      yield put.resolve(action('syncData')({}));
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

    // 事件动作处理
    // 参数：{ actions=动作列表,如:['a1', 'a2' ...] }
    *processActions({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      const sceneState = yield select(state => state.SceneModel);
      const sceneId = userState.sceneId;

      let allActions = [];

      const predefineActions = sceneState.data._cfgReader.getSceneActions(sceneId, payload.actions);
      if (predefineActions != null) {
        allActions.push(...predefineActions);
      }
      
      // 生成自动变量动作
      if (payload.varsOn != undefined && Array.isArray(payload.varsOn)) {
        let autoVars = [];
        payload.varsOn.forEach(e => {
          autoVars.push({ id: "__auto_{0}_on".format(e), cmd: 'var', params: "{0} = ON".format(e) });
        });
        allActions.unshift(...autoVars);
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

    *__onAsideCommand({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      const sceneState = yield select(state => state.SceneModel);
      let aside = sceneState.data._cfgReader.getSceneAside(userState.sceneId, payload.params);
      if (aside != null && (yield put.resolve(action('testCondition')(aside)))) {
        yield put.resolve(action('MaskModel/showAside')({ ...aside }));
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

    *__onChatCommand({ payload }, { put }) {
      yield put.resolve(action('StoryModel/selectChat')({ chatId: payload.params }));
    },

    *__onSceneCommand({ payload }, { put }) {
      yield put.resolve(action('enterScene')({ sceneId: payload.params }));
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

    *__onWorldTimeCommand({ payload }, { put }) {
      const [worldId, millis] = payload.params.split(',');
      yield put.resolve(action('alertWorldTime')({ worldId: worldId, alertValue: parseInt(millis) }));
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

    *syncData({ }, { select, call }) {
      const sceneState = yield select(state => state.SceneModel);
      yield call(LocalStorage.set, LocalCacheKeys.SCENES_DATA, { 
        vars: sceneState.data._vars, 
        times: sceneState.data._time,
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
          const varId = payload.andVarsOn[key];
          const varRef = VarUtils.getVar(sceneState.data._vars, userState.sceneId, varId);
          if (varRef.value <= 0) {
            failure = true;
            break;
          }
        }
      }
      if (!failure && (payload.andVarsOff != undefined)) {
        for (let key in payload.andVarsOff) {
          const varId = payload.andVarsOff[key];
          const varRef = VarUtils.getVar(sceneState.data._vars, userState.sceneId, varId);
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
          
          const [varId, operator, value] = params;
          let compareValue = 0;

          if (varId == '@world_time_hours') {
            const value = yield put.resolve(action('getWorldTime')({ worldId: userState.worldId }));
            compareValue = (value != undefined) ? DateTime.HourUtils.fromMillis(value) : 0;
          } else if (varId == '@scene_time_hours') {
            const value = yield put.resolve(action('getSceneTime')({ sceneId: userState.sceneId }));
            compareValue = (value != undefined) ? DateTime.HourUtils.fromMillis(value) : 0;
          } else if (varId.indexOf('@') == 0) {
            debugMessage("Unknown '{0}' variable!!!", varId);
            continue;
          } else {
            const varRef = VarUtils.getVar(sceneState.data._vars, userState.sceneId, varId);
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
