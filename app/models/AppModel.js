
import { createAction } from "../constants";

export default {
  namespace: 'AppModel',

  state: {
      name: '123',
      age: 18,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put(createAction('updateState')({ age: 1 }));
    }
  },
  
  reducers: {
    updateState(state, { payload }) {
      return { 
        ...state,
        age: state.age + payload.age
      };
    }
  },
}
