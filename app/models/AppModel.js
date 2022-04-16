
import { 
  action,
  LocalCacheKeys,
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
    // 风格ID
    themeId: 0,

    // 当前风格
    currentStyles: Themes.default.Normal,

    // 存档列表
    archiveList: {},

    // 当前存档ID
    currentArchiveIndex: 0,
  },

  effects: {
    *reload({ }, { call, put, select }) {
      const appState = yield select(state => state.AppModel);
      const themeId = yield call(LocalStorage.get, LocalCacheKeys.THEME_ID);
      if (themeId != null) {
        yield put.resolve(action('changeTheme')({ themeId: parseInt(themeId) }));
      }

      yield call(LocalStorage.init);
      yield put(action('updateState')({ 
        archiveList: lo.reverse([...LocalStorage.metadata.descriptors]),
        currentArchiveIndex: LocalStorage.metadata.currentArchiveIndex,
      }));
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

    *archive({ payload }, { call, put, select }) {
      const archiveId = yield call(LocalStorage.archive, payload);
      Toast.show(`存档成功！！！ID=${archiveId}`, 'CenterToTop');
      
      yield put(action('updateState')({ 
        archiveList: lo.reverse([...LocalStorage.metadata.descriptors]),
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
