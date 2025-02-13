
import { 
  action,
  LocalCacheKeys,
  DeviceEventEmitter,
  EventKeys,
  errorMessage,
} from "../constants";

import lo from 'lodash';

import { 
  GetAttrsDataApi 
} from '../services/GetAttrsDataApi';

import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import WorldUtils from "../utils/WorldUtils";
import Toast from "../components/toast";

export default {
  namespace: 'UserModel',

  state: {
    __data: {
    },

    sceneId: '',  // 当前场景ID(该状态在异步操作中状态不确定，请使用__sceneId)
    prevSceneId: '',  // 前一个场景ID
    worldId: 0, // 用户当前世界ID

    copper: 0,  // 铜币数量
    attrs: [], // 普通（阅读器）属性，不参与战斗计算。
    persistedStates: [], // 持久状态，记录一次性状态, 值为KEY

    userToken: {},  // 用户token
  },

  effects: {
    
    *reload({ }, { select, call, put }) {
      const userState = yield select(state => state.UserModel);
      const cache = yield call(LocalStorage.get, LocalCacheKeys.USER_DATA);
      const attrsData = yield call(GetAttrsDataApi);
      const userAttrs = (cache != null) ? cache.attrs : [];

      const allAttrs = [];
      attrsData.data.attrs.forEach(e => {
        e.data.forEach(e => {
          e.forEach(e => {
            allAttrs.push(e);
          })
        })
      });

      // 初始化默认值
      allAttrs.forEach(e => {
        if (userAttrs.find(x => lo.isEqual(x.key, e.key)) == undefined) {
          userAttrs.push({ key: e.key, value: e.value });
        }
      });

      // 清理缓存
      userState.persistedStates.length = 0;

      if (cache != null) {
        yield put(action('updateState')({ ...cache }));
      } else {
        yield put(action('updateState')({ attrs: userAttrs }));
      }
    },

    // 修改铜币属性
    *alterCopper({ payload }, { put, call, select }) {
      const userState = yield select(state => state.UserModel);
      const value = parseInt(payload.value);
      if (value == 0)
        return;

      let newValue = parseInt(userState.copper + value);
      newValue = (newValue < 0) ? 0 : newValue;
      userState.copper = newValue;

      yield put(action('updateState')({}));
      yield put.resolve(action('syncData')({}));
    },

    // 修改阅读器属性
    *alterAttrs({ payload }, { put, call, select }) {
      const userState = yield select(state => state.UserModel);

      const { affects, source } = payload
      
      let messages = []
      affects.forEach(e => {
        const { key, value } = e;
        if (lo.isEmpty(key) || value == 0)
          return;

          let entry = userState.attrs.find(x => x.key == key);
          if (entry == undefined) {
            entry = { key: key, value: 0 };
            userState.attrs.push(entry);
          }

          entry.value += value;
          // entry.value = (entry.value < 0) ? 0 : entry.value;
          messages.push({
            key:e.key,
            value: entry.value,
            changeValue: e.value
          })
      });

      // 提示属性改变
      yield put(action('ToastModel/toastShow')({ messages, type: source === "scene" ? "attr": "questionnaire" }));

      yield put(action('updateState')({}));
      yield put.resolve(action('syncData')({}));
      
      // 通知角色属性刷新
      DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);
    },

    // 阅读器属性
    *getAttrs({}, { select }) {
      const userState = yield select(state => state.UserModel);
      return userState.attrs;
    },

    // 世界设置
    *setWorld({ payload }, { put, call, select }) {
      const userState = yield select(state => state.UserModel);
      const { name } = payload;
      const worldId = WorldUtils.getWorldIdByName(name);

      if (worldId < 0) {
        errorMessage('世界设置错误，请检查世界名称！');
        return
      }

      if (worldId == userState.worldId)
        return // 没更改

      userState.worldId = worldId;
      
      yield put(action('updateState')({}));
      yield put.resolve(action('syncData')({}));
    },

    // 获取叠加后所有的最终属性值(装备、修行等)
    *getFinalAttrs({}, { select, put }) {
      // 所有加成
      const all = [];

      // 装备加成
      all.push(...(yield put.resolve(action('EquipModel/getAddValues')({}))));

      // 修行加成
      all.push(...(yield put.resolve(action('XiuXingModel/getAddValues')({}))));

      // 合并属性值
      let result = [];
      all.forEach(e => {
        const found = result.find(x => lo.isEqual(x.key, e.key));
        if (found != undefined) {
          found.value += e.value;
        } else {
          result.push({ ...e });
        }
      });
      return result;
    },

    // 获取指定的叠加后最终属性值
    *getFinalAttr({ payload }, {}) {
      const { key } = payload;
      const all = yield put.resolve(action('getFinalAttrs')({}));
      const found = lo.find(all, (e) => lo.isEqual(e.key, key));
      return (found != undefined) ? found.value : undefined;
    },

    // 判断是否存在指定持久化状态
    *hasPersistedState({ payload }, { select, call, put }) {
      const userState = yield select(state => state.UserModel);
      const { key } = payload;
      return lo.indexOf(userState.persistedStates, key) != -1;
    },

    // 判断是否存在指定的多个持久化状态
    *havePersistedStates({ payload }, { select, call, put }) {
      const userState = yield select(state => state.UserModel);
      const { keys } = payload;
      
      const result = [];
      if (lo.isArray(keys)) {
        lo.forEach(keys, (k) => {
          if (lo.indexOf(userState.persistedStates, k) != -1) {
            result.push(k);
          }
        });
      }
      return result;
    },

    // 设置指定的持久化状态
    *setPersistedState({ payload }, { select, call, put }) {
      const userState = yield select(state => state.UserModel);
      const { key } = payload;

      if (lo.indexOf(userState.persistedStates, key) == -1) {
        userState.persistedStates.push(key);
        yield put.resolve(action('syncData')({}));
      }
    },

    // 当指定的持久化状态不存在时则设置，否则直接返回false
    *checkAndSetPersistedState({ payload }, { select, call, put }) {
      const { key } = payload;
      const v = yield put.resolve(action('hasPersistedState')({ key }));
      if (!v) {
        yield put.resolve(action('setPersistedState')({ key }));
        return true;
      }
      return false;
    },

    *syncData({ }, { select, call }) {
      const userState = yield select(state => state.UserModel);
      const serialize = lo.pickBy(userState, (v, k) => {
        return !lo.isEqual(k, '__data');
      });
      yield call(LocalStorage.set, LocalCacheKeys.USER_DATA, serialize);
    },

    // 注册
    *register({ payload }, { put, call, select }) {
      const { code, data, msg } = payload
      if (code === 200) {
        if (data.datas.login.succ === false || data.datas.login?.errorMsg === "bean") {
          Toast.show("注册失败")
          return false
        }
        if (data.datas.login.succ === true) {
          Toast.show("注册成功")
          yield call(LocalStorage.set, LocalCacheKeys.USER_TOKEN_DATA, data.datas.login);
          yield put(action('updateState')({ userToken: data.datas.login }));
          return true
        }
      }
    },
    // 登录
    *login({ payload }, { put, call, select }) {
      const { code, data, msg } = payload
      if (code === 200) {
        if (data.datas.login.succ === false || data.datas.login?.errorMsg === "bean") {
          Toast.show("登录失败")
          return false
        }
        if (data.datas.login.succ === true) {
          Toast.show("登录成功")
          yield call(LocalStorage.set, LocalCacheKeys.USER_TOKEN_DATA, data.datas.login);
          yield put(action('updateState')({ userToken: data.datas.login }));
          return true
        }
      }
    }
  },
  
  reducers: {
    updateState(state, { payload }) {
      return { 
        ...state,
        ...payload
      };
    }
  },

  subscriptions: {
    registerReloadEvent({ dispatch }) {
      EventListeners.register('reload', (msg) => {
        return dispatch({ 'type':  'reload'});
      });
    },
  }
}