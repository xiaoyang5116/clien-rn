
import { 
  action
} from "../constants";

export default {
  namespace: 'AppModel',

  state: {
      name: '12345',
      age: 18,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put(action('updateState')({ age: 1 }));
    },

    *firstStep({ payload }, { call, put, select }) {
      yield put(action('SceneModel/triggerNpcClick')({ npcId: 'npc1' }));
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
