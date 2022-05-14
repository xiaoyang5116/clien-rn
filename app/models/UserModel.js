
import { 
  action,
  LocalCacheKeys,
  DeviceEventEmitter,
  EventKeys,
} from "../constants";

import lo from 'lodash';

import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';

export default {
  namespace: 'UserModel',

  state: {
    copper: 0,  // 铜币数量
    sceneId: '',  // 当前场景ID(该状态在异步操作中状态不确定，请使用__sceneId)
    prevSceneId: '',  // 前一个场景ID
    worldId: 0, // 用户当前世界ID
    attrs: [], // 角色属性
  },

  effects: {
    *reload({ }, { call, put }) {
      const userCache = yield call(LocalStorage.get, LocalCacheKeys.USER_DATA);
      if (userCache != null) {
        yield put(action('updateState')({ ...userCache }));
      } else {
        yield put(action('updateState')({
          copper: 0,
          sceneId: '',
          prevSceneId: '',
          worldId: 0,
          attrs: [],
        }));
      }
    },

    *alertCopper({ payload }, { put, call, select }) {
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

    *alertAttrs({ payload }, { put, call, select }) {
      const userState = yield select(state => state.UserModel);
      
      payload.forEach(e => {
        const { key, value } = e;
        if (lo.isEmpty(key) || value == 0)
          return;

          let entry = userState.attrs.find(x => x.key == key);
          if (entry == undefined) {
            entry = { key: key, value: 0 };
            userState.attrs.push(entry);
          }

          entry.value += value;
          entry.value = (entry.value < 0) ? 0 : entry.value;
      });

      yield put(action('updateState')({}));
      yield put.resolve(action('syncData')({}));
      
      // 通知角色属性刷新
      DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);
    },

    *getAttrs({}, { select }) {
      const userState = yield select(state => state.UserModel);
      return userState.attrs;
    },

    *syncData({ }, { select, call }) {
      const userState = yield select(state => state.UserModel);
      yield call(LocalStorage.set, LocalCacheKeys.USER_DATA, userState);
    },
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
