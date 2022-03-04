
import {
  action
} from "../constants";

export default {
  namespace: 'MaskModel',

  state: {
    data: {
      _actions: [],
      _disappearing: false,
      _aside: {
        _sectionId: -1,
        _sections: [],
        _actions: [],
      },
    },
    mtype: 0, // 1: 对话框, 2: 旁白
    title: '',
    content: '',
    subStype: 0,
    visible: false,
  },

  effects: {
    // 显示普通对话框
    // 参数 dialog 标准配置结构
    *showDialog({ payload }, { call, put, select }) {
      const state = yield select(state => state.MaskModel);
      state.data._disappearing = false;
      state.data._actions = payload.confirm_actions;
      //
      yield put(action('updateState')({ 
        mtype: 1,
        title: payload.title, 
        content: payload.content, 
        visible: true,
      }));
    },

    // 显示旁白
    // 参数: aside 标准配置结构
    *showAside({ payload }, { put, select }) {
      const state = yield select(state => state.MaskModel);
      state.data._disappearing = false;
      state.data._actions = payload.confirm_actions;
      state.data._aside._sectionId = 0;
      state.data._aside._sections = payload.sections;
      //
      yield put(action('updateState')({
        mtype: 2,
        title: payload.title,
        content: payload.sections[0],
        style: payload.style,
        visible: true,
      }));
    },

    // 响应确认按钮
    *onDialogConfirm({ payload }, { call, put, select }) {
      yield put.resolve(action('hide')());
    },

    // 响应下一段旁白
    *onNextAside({ }, { put, select }) {
      const state = yield select(state => state.MaskModel);
      if (state.data._aside._sectionId == -1)
        return;
      
      let nextSectionId = state.data._aside._sectionId + 1
      if (nextSectionId >= state.data._aside._sections.length) {
        yield put.resolve(action('hide')());
        return;
      }

      state.data._aside._sectionId = nextSectionId;
      yield put(action('updateState')({
        content: state.data._aside._sections[nextSectionId],
      }));
    },

    // Modal隐藏后执行, 多Modal同时存在iOS会出现卡s
    *onActionsAfterModalHidden({ }, { put, select }) {
      let state = yield select(state => state.MaskModel);
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
      let state = yield select(state => state.MaskModel);
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
