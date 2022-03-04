
import { 
  action,
  LocalCacheKeys
} from "../constants";

import LocalStorage from '../utils/LocalStorage';
import * as RootNavigation from '../utils/RootNavigation';

export default {
  namespace: 'AppModel',

  state: {
  },

  effects: {
    *login({ payload }, { call, put, select }) {
    },

    *firstStep({ payload }, { call, put, select }) {
      const defaultSceneId = 'scene1';
      let state = yield select(state => state.SceneModel);
      let sceneId = (state.data.sceneId != '') ? state.data.sceneId : 'scene1';
      yield put.resolve(action('SceneModel/enterScene')({ sceneId: sceneId }));
    },

    *clearArchive({ payload }, { call, put, select }) {
      let state = yield select(state => state.SceneModel);
      state.data.sceneId = '';

      yield call(LocalStorage.remove, LocalCacheKeys.SCENE_ID, LocalCacheKeys.SCENES_VARS);
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
}
