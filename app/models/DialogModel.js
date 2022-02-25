
import { createAction } from "../constants";

export default {
  namespace: 'DialogModel',

  state: {
    title: 'KK',
    content: 'Hello',
    visible: false
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put(createAction('updateState')({ visible: true }));
    }
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
