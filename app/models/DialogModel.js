
import {
  action
} from "../constants";

export default {
  namespace: 'DialogModel',

  state: {
    data: {
      _disappearing: false,
      _actions: [],
    },
    title: '',
    content: '',
    visible: false,
  },

  effects: {
    // 显示普通对话框
    // 参数 dialog 标准配置结构
    *show({ payload }, { call, put }) {
      yield put(action('updateState')({ 
        data: {
          _disappearing: false,
          _actions: payload.confirm_actions,
        },
        title: payload.title, 
        content: payload.content, 
        visible: true,
      }));
    },

    // 响应点击事件
    *confirm({ payload }, { call, put, select }) {
      yield put.resolve(action('hide')());
    },

    // Modal隐藏后执行相应的动作，因iOS不支持多个Modal同时出现。
    *onActionsAfterModalHidden({ }, { put, select }) {
      let state = yield select(state => state.DialogModel);
      let actions = (state.data._actions != null && state.data._actions.length > 0)
                      ? { actions: [...state.data._actions] }
                      : null;
      if (actions != null && state.data._disappearing) {
        state.data._disappearing = false;
        state.data._actions = [];
        yield put.resolve(action('SceneModel/processActions')(actions));
      }
    },

    *hide({ payload }, { put, select }) {
      let state = yield select(state => state.DialogModel);
      state.data._disappearing = true;
      yield put(action('updateState')({ 
        visible: false,
      }));
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
