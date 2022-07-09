
import { 
  action,
  LocalCacheKeys,
  DeviceEventEmitter,
  getTheme,
  EventKeys,
} from "../constants";

import LocalStorage from '../utils/LocalStorage';
import * as RootNavigation from '../utils/RootNavigation';
import EventListeners from '../utils/EventListeners';
import Toast from '../components/toast';
import * as Themes from '../themes';
import lo from 'lodash';

export default {
  namespace: 'AppModel',

  // 所有Model都接收到
  state: {
    // 当前风格
    currentStyles: Themes.default.themes[0].style,

    // 存档列表
    archiveList: {},

    // 当前存档ID
    currentArchiveIndex: 0,

    // 黑夜模式设置
    darkLightSettings: {},
  },

  effects: {
    *reload({ }, { call, put, select }) {
      const appState = yield select(state => state.AppModel);
      const themeId = yield call(LocalStorage.get, LocalCacheKeys.THEME_ID);

      const theme = getTheme(themeId != null ? parseInt(themeId) : Themes.default.themeId);
      if (theme != undefined) {
        Themes.default.themeId = theme.id;
        appState.currentStyles = theme.style;
      }

      // 存档相关
      appState.archiveList = lo.reverse([...LocalStorage.metadata.descriptors].filter(e => e.archived));
      appState.currentArchiveIndex = LocalStorage.metadata.currentArchiveIndex;

      // 黑夜模式
      const darkLightSettings = yield call(LocalStorage.get, LocalCacheKeys.DARK_LIGHT_MODE);
      if (!lo.isEmpty(darkLightSettings)) {
        appState.darkLightSettings = darkLightSettings;
      }
    },

    *changeTheme({ payload }, { call, put, select }) {
      const appState = yield select(state => state.AppModel);
      const themeId = payload.themeId;
      let selectStyles = appState.currentStyles;

      if (themeId >= 0) {
        const selectTheme = getTheme(themeId);
        if (selectTheme != undefined) {
          Themes.default.themeId = themeId;
          selectStyles = selectTheme.style;

          DeviceEventEmitter.emit(EventKeys.APP_SET_STATE, { themeStyle: selectTheme.style });
          yield call(LocalStorage.set, LocalCacheKeys.THEME_ID, themeId);
        }
      }

      yield put(action('updateState')({ 
        currentStyles: selectStyles 
      }));
    },

    *archive({ payload }, { call, put, select }) {
      const userState = yield select(state => state.UserModel);
      let sceneName = '';
      if (!lo.isEmpty(userState.sceneId)) {
        const sceneConfig = yield put.resolve(action('SceneModel/getScene')({ sceneId: userState.sceneId }));
        sceneName = (sceneConfig != null) ? sceneConfig.name : '';
      }

      const archiveId = yield call(LocalStorage.archive, { ...payload, sceneName });
      Toast.show('存档成功！！！', 'CenterToTop');
      
      yield put(action('updateState')({ 
        archiveList: lo.reverse([...LocalStorage.metadata.descriptors].filter(e => e.archived)),
        currentArchiveIndex: LocalStorage.metadata.currentArchiveIndex,
      }));
    },

    *selectArchive({ payload }, { call, put, select }) {
      const { archiveId } = payload;
      yield call(LocalStorage.select, archiveId);
      EventListeners.raise('reload');
      Toast.show(`已切换存档`, 'CenterToTop');
    },

    *clearArchive({ }, { call, put, select }) {
      const userState = yield select(state => state.UserModel);
      userState.sceneId = '';
      userState.prevSceneId = '';

      yield call(LocalStorage.clear);
      EventListeners.raise('reload');
      RootNavigation.navigate('First');
    },

    *setDarkLightMode({ payload }, { call, put, select }) {
      const appState = yield select(state => state.AppModel);
      const { reader, app } = payload;
      
      if (lo.isBoolean(reader)) {
        appState.darkLightSettings.reader = reader;
      }
      if (lo.isBoolean(app)) {
        appState.darkLightSettings.app = app;
      }

      yield call(LocalStorage.set, LocalCacheKeys.DARK_LIGHT_MODE, appState.darkLightSettings);
      yield put(action('updateState')({ }));
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
