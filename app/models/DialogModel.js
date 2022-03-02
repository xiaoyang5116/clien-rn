
import {
  action
} from "../constants";

export default {
  namespace: 'DialogModel',

  state: {
    title: '',
    content: '',
    visible: false,
    actions: [],
  },

  effects: {
    // 显示普通对话框
    // 参数 dialog 标准配置结构
    *show({ payload }, { call, put }) {
      yield put(action('updateState')({ 
        title: payload.title, 
        content: payload.content, 
        visible: true,
        actions: payload.confirm_actions,
      }));
    },

    // 响应点击事件
    *confirm({ payload }, { call, put, select }) {
      const state = yield select(state => state.DialogModel);
      if (state.actions != null && state.actions.length > 0) {
        yield put.resolve(action('SceneModel/processActions')({ actions: state.actions }));
      }

      yield put(action('hide')());
    },

    *hide({ payload }, { call, put }) {
      yield put(action('updateState')({ visible: false }));
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
