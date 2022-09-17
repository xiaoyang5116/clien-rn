
import { 
  action,
  LocalCacheKeys,
} from "../constants";

import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import * as DateTime from '../utils/DateTimeUtils';
import lo from 'lodash';

export default {
  namespace: 'StateModel',

  // 所有Model都接收到
  state: {
    articleState: null,           // 文章状态
    articleBtnClickState: null,   // 文章按钮最近一次点击
    articleSceneClickState: null, // 文章弹出场景选项点击状态
    dialogBtnClickState: null,    // 对话框最近一次动作
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

    *resetStates({ payload }, { call, put, select }) {
      const state = yield select(state => state.StateModel);
      const { keys } = payload;

      if (!lo.isArray(keys))
        return

      lo.forEach(keys, (v, k) => {
        if (state[v] != undefined) {
          state[v] = null;
        }
      });

      yield put(action('saveAll')());
    },

    *getArticleState({}, { call, put, select }) {
      const state = yield select(state => state.StateModel);
      return state.articleState;
    },

    *saveArticleState({ payload }, { call, put, select }) {
      const state = yield select(state => state.StateModel);
      if (payload == null || payload == undefined || !lo.isObject(payload))
        return;

      state.articleState = lo.cloneDeep(payload);
      state.articleState.__time = DateTime.now();
      yield put(action('saveAll')());
    },

    *getArticleBtnClickState({}, { call, put, select }) {
      const state = yield select(state => state.StateModel);
      return state.articleBtnClickState;
    },

    *saveArticleBtnClickState({ payload }, { call, put, select }) {
      const state = yield select(state => state.StateModel);
      if (payload == null || payload == undefined || !lo.isObject(payload))
        return;

      state.articleBtnClickState = lo.cloneDeep(payload);
      state.articleBtnClickState.__time = DateTime.now();
      state.articleSceneClickState = null;
      state.dialogBtnClickState = null;
      yield put(action('saveAll')());
    },

    *getArticleSceneClickState({}, { call, put, select }) {
      const state = yield select(state => state.StateModel);
      return state.articleSceneClickState;
    },

    *saveArticleSceneClickState({ payload }, { call, put, select }) {
      const state = yield select(state => state.StateModel);
      if (payload == null || payload == undefined || !lo.isObject(payload))
        return;

      state.articleSceneClickState = lo.cloneDeep(payload);
      state.articleSceneClickState.__time = DateTime.now();
      yield put(action('saveAll')());
    },

    *saveDialogBtnClickState({ payload }, { call, put, select }) {
      const state = yield select(state => state.StateModel);
      if (payload == null || payload == undefined || !lo.isObject(payload))
        return;

      state.dialogBtnClickState = lo.cloneDeep(payload);
      state.dialogBtnClickState.__time = DateTime.now();

      // 更新对话框操作
      if (state.dialogBtnClickState.tokey != undefined 
        && state.articleBtnClickState != null 
        && state.articleBtnClickState.dialogs != undefined) {
        state.articleBtnClickState.__tokey = state.dialogBtnClickState.tokey;
      }

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
