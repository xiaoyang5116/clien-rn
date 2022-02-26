
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
      const storyState = yield select(state => state.StoryModel);

      let firstNpc = null;
      for (let key in storyState.stroysConfig.main.npcs) {
        let item = storyState.stroysConfig.main.npcs[key];
        if (item.id == 1) {
          firstNpc = item;
          break;
        } 
      }

      if (firstNpc == null)
        return;

      let params = { parent: firstNpc, ...firstNpc.action }
      yield put(action('AsideModel/show')(params));
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
