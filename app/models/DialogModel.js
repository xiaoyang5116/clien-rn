
import { createAction } from "../constants";

export default {
  namespace: 'DialogModel',

  state: {
    title: '',
    content: '',
    visible: false,
    typeConfirm: null,
    params: null
  },

  effects: {
    *show({ payload }, { call, put }) {
      yield put(createAction('updateState')({ 
        title: payload.title, 
        content: payload.content, 
        visible: true,
        typeConfirm: payload.typeConfirm,
        params: payload.params
      }));
    },

    *hide({ payload }, { call, put }) {
      yield put(createAction('updateState')({ visible: false }));
    },

    *action({ payload }, { call, put, select }) {
      const state = yield select(state => state.DialogModel);
      if (state.typeConfirm != null) {
        yield put(createAction(state.typeConfirm)(state.params));
      }

      yield put(createAction('hide')());
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
