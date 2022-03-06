
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
import SceneConfigReader from "../utils/SceneConfigReader";
import * as RootNavigation from '../utils/RootNavigation';

class VarUtils {

  static generateVarUniqueId(sceneId, varId) {
    return "{0}_{1}".format(sceneId, varId).toUpperCase();
  }

  static getVar(vars, sceneId, varId) {
    let uniVarId = VarUtils.generateVarUniqueId(sceneId, varId);
    for (let key in vars) {
      let item = vars[key];
      if (item.id == uniVarId)
        return item;
    }
    return null;
  }

}

export default {
  namespace: 'SceneModel',

  state: {
    data: {
      _scenesCfgReader: null,
      _vars: [],
      sceneId: '',
    }
  },

  effects: {
    // 重新加载&初始化
    *reload({ }, { call, put, select }) {
      let sceneIdList = ['scene_1', 'scene_2', 'scene_3'];
      const state = yield select(state => state.SceneModel);

      let scenes = [];
      let initVars = [];

      for (let key in sceneIdList) {
        let sceneId = sceneIdList[key];
        let data = yield call(GetSceneDataApi, sceneId);
        if (data.scenes != undefined) {
          data.scenes.forEach((e) => {
            scenes.push(e);
          });
        }
      }

      // 加载本地缓存
      let sceneIdCache = yield call(LocalStorage.get, LocalCacheKeys.SCENE_ID);
      let varsCache = yield call(LocalStorage.get, LocalCacheKeys.SCENES_VARS);
      // debugMessage(sceneIdCache);
      // debugMessage(varsCache);
      
      let reader = new SceneConfigReader(scenes);
      reader.getSceneIds().forEach((sceneId) => {
        let vars = reader.getSceneVars(sceneId);
        if (vars != null) {
          vars.forEach((e) => {
            let value = e.defaulValue;
            let uniVarId = "{0}_{1}".format(sceneId, e.id).toUpperCase();
            if (varsCache != null) {
              let varCache = VarUtils.getVar(varsCache, sceneId, e.id);
              if (varCache != null && varCache.min >= e.min && varCache.max <= e.max) {
                value = varCache.value;
              }
            }
            initVars.push({ ...e, value: value, id: uniVarId });
          });
        }
      });

      yield put(action('updateState')({ 
        data: {
          _scenesCfgReader: reader,
          _vars: initVars,
          sceneId: ((sceneIdCache != null) ? sceneIdCache : state.data.sceneId),          
        }
      }));
    },

    // 进入场景
    // 参数: sceneId: 场景ID
    *enterScene({ payload }, { call, put, select }) {
      const state = yield select(state => state.SceneModel);
      let sceneId = payload.sceneId;
      let reader = state.data._scenesCfgReader;
      
      let scene = reader.getScene(sceneId);
      if (scene == null) {
        errorMessage("SceneId={0} not found.", sceneId);
        return;
      }

      // 场景必须在这里
      RootNavigation.navigate('Home');

      state.data.sceneId = sceneId;
      yield put.resolve(action('processActions')({ actions: scene.enter_actions }));
      yield call(LocalStorage.set, LocalCacheKeys.SCENE_ID, sceneId);
    },

    // 事件动作处理
    // 参数：actions=动作列表,如:['a1', 'a2' ...]
    *processActions({ payload }, { call, put, select }) {
      const state = yield select(state => state.SceneModel);
      let sceneId = state.data.sceneId;
      let reader = state.data._scenesCfgReader;
      let actions = reader.getSceneActions(sceneId, payload.actions);
      debugMessage("processActions: scene={0} action_list={1}", sceneId, payload.actions.join(', '));

      for (let key in actions) {
        let item = actions[key];
        debugMessage("---> detail: cmd={0} params=({1})", item.cmd, item.params);

        switch (item.cmd) {
          case 'aside': // 旁白显示
            let aside = reader.getSceneAside(sceneId, item.params);
            if (aside != null && (yield put.resolve(action('testCondition')(aside)))) {
              yield put.resolve(action('MaskModel/showAside')({ ...aside }));
            }
            break;

          case 'dialog': // 对话框
            let dialog = reader.getSceneDialog(sceneId, item.params);
            if (dialog != null) {
              yield put.resolve(action('MaskModel/showDialog')({ ...dialog }));
            }
            break;

          case 'navigate': // 导航跳转
            RootNavigation.navigate(item.params);
            break;

          case 'chat': // 选择对话框
            yield put.resolve(action('StoryModel/selectChat')({ chatId: item.params }));
            break;

          case 'scene': // 切换场景
            yield put.resolve(action('enterScene')({ sceneId: item.params }));
            break;

          case 'delay': // 延时
            yield call(delay, parseInt(item.params));
            break;

          case 'var': // 变量修改
            let params = [];
            item.params.split(' ').forEach((s) => { 
              params.push(s.trim().toUpperCase()); 
            });
          
            let varRef = VarUtils.getVar(state.data._vars, sceneId, params[0]);
            if (varRef == null)
              return;

            let operator = params[1];
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
              LocalStorage.set(LocalCacheKeys.SCENES_VARS, state.data._vars);
            }
            break;
        }
      }
    },

    // 获取场景配置
    // 参数: { sceneId: xxx}
    *getScene({ payload }, { call, put, select }) {
      const state = yield select(state => state.SceneModel);
      return (state.data._scenesCfgReader != null)
                ? state.data._scenesCfgReader.getScene(payload.sceneId)
                : null;
    },

    // 获取对话配置
    // 参数: { sceneId: xxx, chatId: xxx }
    *getChat({ payload }, { call, put, select }) {
      const state = yield select(state => state.SceneModel);
      return (state.data._scenesCfgReader != null)
                ? state.data._scenesCfgReader.getSceneChat(payload.sceneId, payload.chatId)
                : null;
    },

    // 获取对话框配置
    // 参数: { sceneId: xxx, dialogId: xxx }
    *getDialog({ payload }, { call, put, select }) {
      const state = yield select(state => state.SceneModel);
      return (state.data._scenesCfgReader != null)
                ? state.data._scenesCfgReader.getSceneDialog(payload.sceneId, payload.dialogId)
                : null;
    },

    // 测试条件是否成立，支持andVarsOn,andVarsOff,andVarsValue,orVarsOn,orVarsOff,orVarsValue
    // 参数: { ... }
    *testCondition({ payload }, { call, put, select }) {
      const state = yield select(state => state.SceneModel);
      let sceneId = state.data.sceneId;

      let varFinder = (id) => {
        for (let key in state.data._vars) {
          let item = state.data._vars[key];
          if (item.id == id)
            return item;
        }
        return null;
      };

      let failure = false;
      if (payload.andVarsOn != undefined) {
        for (let key in payload.andVarsOn) {
          let varId = payload.andVarsOn[key];
          let varRef = VarUtils.getVar(state.data._vars, sceneId, varId);
          if (varRef.value <= 0) {
            failure = true;
            break;
          }
        }
      }
      if (!failure && (payload.andVarsOff != undefined)) {
        for (let key in payload.andVarsOff) {
          let varId = payload.andVarsOff[key];
          let varRef = VarUtils.getVar(state.data._vars, sceneId, varId);
          if (varRef.value > 0) {
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
