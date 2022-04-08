
import { 
  action,
  LocalCacheKeys,
  DeviceEventEmitter,
} from "../constants";

import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';

export default {
  namespace: 'UserModel',

  state: {
    copper: 0,  // 铜币数量
    sceneId: '',  // 当前场景ID(该状态在异步操作中状态不确定，请使用__sceneId)
    prevSceneId: '',  // 前一个场景ID
    worldId: 0, // 用户当前世界ID
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
        dispatch({ 'type':  'reload'});
      });
    },
  }
}
