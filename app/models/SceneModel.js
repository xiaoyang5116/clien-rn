
import {
  action,
  delay
} from "../constants";

import {
  GetStoryDataApi
} from "../services/GetStoryDataApi";

import ConfigParser from "../utils/ConfigParser";
import * as RootNavigation from '../utils/RootNavigation';

export default {
  namespace: 'SceneModel',

  state: {
    data: {
      sceneId: '',   // 当前场景ID
      _vars: [],    // 存放注册变量
      _parser: null,
    }
  },

  effects: {
    // 重新加载&初始化
    *reload({ payload }, { call, put, select }) {
      let state = yield select((state) => state.SceneModel);
      let data = yield call(GetStoryDataApi, payload);
      let parser = new ConfigParser(data.main);
      let initVars = [];

      // 注册场景变量
      parser.getSceneIds().forEach((sceneId) => {
        let varsConfig = parser.getSceneVars(sceneId);
        if (varsConfig != null) {
          varsConfig.forEach((e) => {
            initVars.push({ ...e, id: e.id.toUpperCase() });
          });
        }
      });

      // 注册NPC变量
      parser.getNpcIds().forEach((npcId) => {
        let varsConfig = parser.getNpcVars(npcId);
        if (varsConfig != null) {
          varsConfig.forEach((e) => {
            initVars.push({ ...e, id: e.id.toUpperCase() });
          });
        }
      });

      yield put.resolve(action('updateState')({ 
        data: {
          sceneId: state.data.sceneId,
          _vars: initVars,
          _parser: parser,
        }
      }));
    },

    // 触发NPC点击
    // 参数: { npcId: xxx }
    *triggerNpcClick({ payload }, { call, put, select }) {
      let npcId = payload.npcId;
      if (npcId == undefined)
        return;

      const state = yield select(state => state.SceneModel);
      const npc = state.data._parser.getNpc(npcId);
      if (npc == null)
        return;

      for (let key in npc.click_event.actions) {
        let item = npc.click_event.actions[key];
        yield put.resolve(action('action')({ ...item }));
      }
    },

    // 触发对话框确认
    *triggerDialogConfirmEvent({ payload }, { call, put, select }) {
      for (let key in payload.confirm_event.actions) {
        let item = payload.confirm_event.actions[key];
        yield put.resolve(action('action')({ ...item }));
      }
    },

    // 获取场景配置
    // 参数: { sceneId: xxx }
    *getScene({ payload }, { call, put, select }) {
      const state = yield select(state => state.SceneModel);
      return (state.data._parser != null)
                ? state.data._parser.getScene(payload.sceneId)
                : null;
    },

    // 获取对话配置
    // 参数: { chatId: xxx }
    *getChat({ payload }, { call, put, select }) {
      const state = yield select(state => state.SceneModel);
      return (state.data._parser != null)
                ? state.data._parser.getChat(payload.chatId)
                : null;
    },

    // 设置场景ID
    *setSceneId({ payload }, { call, put, select }) {
      const state = yield select(state => state.SceneModel);
      state.data.sceneId = payload.sceneId;
    },

    // 获取变量值
    // 参数: { varId: xxx }
    *getVarValue({ payload }, { call, put, select }) {
      const state = yield select(state => state.SceneModel);
      for (let key in state.data._vars) {
        let item = state.data._vars[key];
        if (item.id == payload.varId.toUpperCase())
          return item;
      }
      return null;
    },

    // 判断条件是否成立
    // 参数: { cond: xxx }
    *testCondition({ payload }, { call, put, select }) {
      if (payload.cond == undefined)
        return false;

      let params = [];
      payload.cond.split(' ').forEach((e) => {
        let item = e.trim();
        if (item != '') {
          params.push(item.toUpperCase());
        }
      });
      if (params.length <= 0)
        return false;

      let ifKeyword = params.shift();
      if (ifKeyword != 'IF')
        return false;
      
      let andList = [];
      let orList = [];
      let otherList = [];
      let prevList = null;
      for (let i = 0; i < params.length;) {
        let varId = params[i];
        let opt = params[i + 1];
        let value = params[i + 2];
        let result = false;

        let varRef = yield put.resolve(action('getVarValue')({ varId: varId }));
        if (varRef != null) {

          if (value == 'ON')
            value = 1;
          else if (value == 'OFF')
            value = 0;
          else
            value = parseInt(value);
          //
          let varValue = varRef.value;
          if (opt == '==')
            result = (varValue == value);
          else if (opt == '>=')
            result = (varValue >= value);
          else if (opt == '<=')
            result = (varValue <= value);
          else if (opt == '>')
            result = (varValue > value);
          else if (opt == '<')
            result = (varValue < value);
        }

        if ((i + 4) <= params.length) {
          let logic = params[i + 3];
          if (logic == 'AND') {
            andList.push(result);
            prevList = andList;
          } else if (logic == 'OR') {
            orList.push(result);
            prevList = orList;
          }
          i += 4;
        } else {
          if (prevList != null) {
            prevList.push(result);
          } else {
            otherList.push(result);
          }
          i += 3;
        }
      }

      if (otherList.length > 0 && andList.length == 0 && orList.length == 0) {
        let count = 0;
        otherList.forEach((e) => {
          if (e) count++;
        });
        return (count == otherList.length);
      } else if (andList.length > 0 && orList.length == 0) {
        let count = 0;
        andList.forEach((e) => {
          if (e) count++;
        });
        return (count == andList.length);
      } else if (orList.length > 0 && andList.length == 0) {
        let count = 0;
        andList.forEach((e) => {
          if (e) count++;
        });
        return (count > 0);
      }
      return false;
    },

    // 动作逻辑
    *action({ payload }, { call, put, select }) {
      const state = yield select(state => state.SceneModel);
      switch (payload.cmd) {
        case 'aside': // 旁白
          yield put(action('AsideModel/show')({ ...payload }));
          break;

        case 'dialog': // 普通对话框
          if (payload.title != undefined && payload.content != undefined) {
            yield put(action('DialogModel/show')({ 
              typeConfirm: 'SceneModel/action', 
              params: payload.action, 
              ...payload 
            }));
          }
          break;
        
        case 'scene': // 切换场景
          yield put(action('StoryModel/selectChat')({ path: payload.params }));
          break;

        case 'var': // 变量修改
          let params = [];
          payload.params.split(' ').forEach((s) => { 
            params.push(s.trim()); 
          });
          
          let varRef = yield put.resolve(action('getVarValue')({ varId: params[0] }));
          if (varRef == null)
            return;

          let newVarValue = 0;
          let varValue = varRef.value;

          if (params[1] == '+=') {
            newVarValue = varValue + parseInt(params[2]); 
          } else if (params[1] == '=') {
            newVarValue = parseInt(params[2]); 
          } else if (params[1] == '-=') {
            newVarValue = varValue - parseInt(params[2]); 
          }

          if (newVarValue < varRef.min) newVarValue = varRef.min;
          if (newVarValue > varRef.max) newVarValue = varRef.max;
          varRef.value = newVarValue;
          break;

        case 'navigate':  // 导航
          RootNavigation.navigate(payload.params);
          break;
      }
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
    }
  }
}
