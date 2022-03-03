
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
      yield put.resolve(action('hide')());
    },

    // Modal隐藏后执行相应的动作，因iOS不支持多个Modal同时出现。
    *onActionsAfterModalHidden({ }, { put, select }) {
      let state = yield select(state => state.DialogModel);
      let actions = (state.actions != null && state.actions.length > 0)
                      ? { actions: [...state.actions] }
                      : null;
      if (actions != null) {
        yield put.resolve(action('SceneModel/processActions')(actions));
      }
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
