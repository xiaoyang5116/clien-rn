
import { 
  action,
  LocalCacheKeys,
} from "../constants";

import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import lo from 'lodash';

export default {
  namespace: 'StateModel',

  // 所有Model都接收到
  state: {
    articleState: null,           // 文章状态
    articleBtnClickState: null,   // 文章按钮最近一次点击
  },

  effects: {
    *reload({ }, { call, put, select }) {
      const state = yield select(state => state.StateModel);
      const cache = yield call(LocalStorage.get, LocalCacheKeys.STATE_DATA);
      if (cache != null) {
        lo.assign(state, cache);
      }
    },

    *getAllStates({}, { call, put, select }) {
      const state = yield select(state => state.StateModel);
      return state;
    },

    *getArticleState({}, { call, put, select }) {
      const state = yield select(state => state.StateModel);
      return state.articleState;
    },

    *saveArticleState({ payload }, { call, put, select }) {
      const state = yield select(state => state.StateModel);
      state.articleState = lo.cloneDeep(payload);
      yield put(action('saveAll')());
    },

    *getArticleBtnClickState({}, { call, put, select }) {
      const state = yield select(state => state.StateModel);
      return state.articleBtnClickState;
    },

    *saveArticleBtnClickState({ payload }, { call, put, select }) {
      const state = yield select(state => state.StateModel); 
      state.articleBtnClickState = lo.cloneDeep(payload);
      yield put(action('saveAll')());
    },

    *saveAll({}, { call, put, select }) {
      const state = yield select(state => state.StateModel);
      yield call(LocalStorage.set, LocalCacheKeys.STATE_DATA, state);
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
