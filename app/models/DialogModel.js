
import {
  action
} from "../constants";

export default {
  namespace: 'DialogModel',

  state: {
    title: '',
    content: '',
    visible: false,
    typeConfirm: null, // 点击确认后的动作类型
    params: null  // 动作参数
  },

  effects: {
    *show({ payload }, { call, put }) {
      yield put(action('updateState')({ 
        title: payload.title, 
        content: payload.content, 
        visible: true,
        typeConfirm: payload.typeConfirm,
        params: payload.params
      }));
    },

    *hide({ payload }, { call, put }) {
      yield put(action('updateState')({ visible: false }));
    },

    *action({ payload }, { call, put, select }) {
      const state = yield select(state => state.DialogModel);
      if (state.typeConfirm != null) {
        yield put(action(state.typeConfirm)(state.params));
      }

      yield put(action('hide')());
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
