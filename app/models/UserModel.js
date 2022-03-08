
import { 
  action,
  LocalCacheKeys,
} from "../constants";

import LocalStorage from '../utils/LocalStorage';
import * as RootNavigation from '../utils/RootNavigation';
import * as Themes from '../themes';

export default {
  namespace: 'UserModel',

  state: {
    copper: 0,  // 铜币数量
  },

  effects: {
    *reload({ }, { call, put }) {
      const user = yield call(LocalStorage.get, LocalCacheKeys.USER);
      if (user != null) {
        yield put(action('updateState')({ ...user }));
      }
    },

    *alertCopper({ payload }, { put, select }) {
      const state = yield select(state => state.UserModel);
      const value = parseInt(payload.value);
      if (value == 0)
        return;

      let newValue = parseInt(state.copper + value);
      newValue = (newValue < 0) ? 0 : newValue;
      state.copper = newValue;

      yield put(action('updateState')({}));
      LocalStorage.set(LocalCacheKeys.USER, state);
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
