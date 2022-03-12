
import { 
  action,
  LocalCacheKeys,
} from "../constants";

import LocalStorage from '../utils/LocalStorage';

export default {
  namespace: 'UserModel',

  state: {
    copper: 0,  // 铜币数量
    sceneId: '',  // 当前场景ID
    prevSceneId: '',  // 前一个场景ID
    worldId: 0, // 用户当前世界ID
  },

  effects: {
    *reload({ }, { call, put }) {
      const userCache = yield call(LocalStorage.get, LocalCacheKeys.USER_DATA);
      if (userCache != null) {
        yield put(action('updateState')({ ...userCache }));
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
    setup({ dispatch }) {
      dispatch({ 'type':  'reload'});
    },
  }
}
