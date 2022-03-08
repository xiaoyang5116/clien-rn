
import { 
  action,
  delay,
  LocalCacheKeys,
} from "../constants";

import LocalStorage from '../utils/LocalStorage';
import * as RootNavigation from '../utils/RootNavigation';
import * as Themes from '../themes';

export default {
  namespace: 'AppModel',

  // 所有Model都接收到
  state: {
    // 视图相关
    themeId: 0,
    currentStyles: Themes.default.Normal,
  },

  effects: {
    *reload({ }, { call, put }) {
      const themeId = yield call(LocalStorage.get, LocalCacheKeys.THEME_ID);
      if (themeId != null) {
        yield put.resolve(action('changeTheme')({ themeId: parseInt(themeId) }));
      }
    },

    *changeTheme({ payload }, { call, put, select }) {
      const state = yield select(state => state.AppModel);
      const themeId = payload.themeId;
      let selectStyles = state.currentStyles;

      if (themeId == 0)
        selectStyles = Themes.default.Normal;
      else if (themeId == 1) {
        selectStyles = Themes.default.Dark;
      }
      yield put(action('updateState')({ 
        themeId: payload.themeId, 
        currentStyles: selectStyles 
      }));
      yield call(LocalStorage.set, LocalCacheKeys.THEME_ID, themeId);
    },

    *firstStep({ }, { put, select }) {
      const defaultSceneId = 'scene1';
      const state = yield select(state => state.SceneModel);
      const sceneId = (state.data.sceneId != '') ? state.data.sceneId : 'scene1';
      yield put.resolve(action('SceneModel/enterScene')({ sceneId: sceneId }));
    },

    *clearArchive({ }, { call, put, select }) {
      const state = yield select(state => state.SceneModel);
      state.data.sceneId = '';

      yield call(LocalStorage.clear);
      yield put.resolve(action('SceneModel/reload')({}));
      RootNavigation.navigate('First');
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
