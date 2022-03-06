
import { 
  action,
  LocalCacheKeys,
} from "../constants";

import LocalStorage from '../utils/LocalStorage';
import * as RootNavigation from '../utils/RootNavigation';
import * as Themes from '../themes';

export default {
  namespace: 'AppModel',

  state: {
    // 全局状态，所有Model都接收到。
    themeId: 0,
    currentStyles: Themes.default.Normal,
  },

  effects: {
    *reload({ }, { call, put }) {
      let themeId = yield call(LocalStorage.get, LocalCacheKeys.THEME_ID);
      if (themeId != null) {
        yield put.resolve(action('changeTheme')({ themeId: parseInt(themeId) }));
      }
    },

    *changeTheme({ payload }, { call, put, select }) {
      let state = yield select(state => state.AppModel);
      let themeId = payload.themeId;
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
      let state = yield select(state => state.SceneModel);
      let sceneId = (state.data.sceneId != '') ? state.data.sceneId : 'scene1';
      yield put.resolve(action('SceneModel/enterScene')({ sceneId: sceneId }));
    },

    *clearArchive({ payload }, { call, put, select }) {
      let state = yield select(state => state.SceneModel);
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
