
import { 
  action
} from "../constants";

export default {
  namespace: 'AppModel',

  state: {
  },

  effects: {
    *login({ payload }, { call, put, select }) {
    },

    *firstStep({ payload }, { call, put, select }) {
      yield put.resolve(action('SceneModel/enterScene')({ sceneId: 'scene1' }));
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
