
import {
  action
} from "../constants";

export default {
  namespace: 'AsideModel',

  state: {
    data: {
      _disappearing: false,
      _sectionId: -1,
      _sections: [],
      _actions: [],
    },
    title: '',
    content: '',
    style: 1,
    visible: false,
  },

  effects: {
    // 显示旁白
    // 参数: aside 标准配置结构
    *show({ payload }, { put, select }) {
      const state = yield select(state => state.AsideModel);
      if (state.data._sectionId != -1) {
        yield put.resolve(action('hide')());
        return;
      }

      yield put(action('updateState')({
        data: {
          _disappearing: false,
          _sectionId: 0,
          _sections: payload.sections,
          _actions: payload.confirm_actions,
        },
        title: payload.title,
        content: payload.sections[0],
        style: payload.style,
        visible: true,
      }));
    },

    // 点击下一段旁白
    // 参数：无
    *next({ }, { put, select }) {
      const state = yield select(state => state.AsideModel);
      if (state.data._sectionId == -1)
        return;
      
      let nextSectionId = state.data._sectionId + 1
      if (nextSectionId >= state.data._sections.length) {
        yield put.resolve(action('hide')());
        return;
      }

      state.data._sectionId = nextSectionId;
      yield put(action('updateState')({
        content: state.data._sections[nextSectionId],
      }));
    },

    // Modal隐藏后执行相应的动作，因iOS不支持多个Modal同时出现。
    *onActionsAfterModalHidden({ }, { put, select }) {
      let state = yield select(state => state.AsideModel);
      let actions = (state.data._actions != null && state.data._actions.length > 0)
                      ? { actions: [...state.data._actions] }
                      : null;
      if (actions != null && state.data._disappearing) {
        state.data._disappearing = false;
        yield put.resolve(action('SceneModel/processActions')(actions));
      }
    },

    // 隐藏旁白
    // 参数：无
    *hide({ }, { put, select }) {
      let state = yield select(state => state.AsideModel);
      state.data._sectionId = -1;
      state.data._disappearing = true;
      yield put(action('updateState')({
        visible: false,
      }));
    }
  },
  
  reducers: {
    updateState(state, { payload }) {
      return { 
        ...state,
        ...payload
      };
    },
  },
}
