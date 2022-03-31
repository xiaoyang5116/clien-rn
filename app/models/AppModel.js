
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
      const appState = yield select(state => state.AppModel);
      const themeId = payload.themeId;
      let selectStyles = appState.currentStyles;

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
      // const defaultSceneId = 'wzkj';
      // const userState = yield select(state => state.UserModel);
      // const sceneId = (userState.sceneId != '') ? userState.sceneId : defaultSceneId;
      yield put.resolve(action('SceneModel/enterScene')({ sceneId: 'wzkj' }));
    },

    *clearArchive({ }, { call, put, select }) {
      const userState = yield select(state => state.UserModel);
      userState.sceneId = '';
      userState.prevSceneId = '';

      yield call(LocalStorage.clear);
      yield put.resolve(action('SceneModel/reload')({}));
      yield put.resolve(action('PropsModel/reload')({}));
      yield put.resolve(action('UserModel/reload')({}));
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
