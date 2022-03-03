
import {
  action
} from "../constants";

export default {
  namespace: 'AsideModel',

  state: {
    title: '',
    content: '',
    style: 1,
    visible: false,
    sectionId: -1,
    sections: [],
    actions: [],
  },

  effects: {
    // 显示旁白
    // 参数: aside 标准配置结构
    *show({ payload }, { put, select }) {
      const state = yield select(state => state.AsideModel);
      if (state.sectionId != -1) {
        yield put(action('hide')());
        return;
      }

      yield put(action('updateState')({
        title: payload.title,
        content: payload.sections[0],
        style: payload.style,
        sections: payload.sections,
        actions: payload.confirm_actions,
        sectionId: 0,
        visible: true,
      }));
    },

    // 点击下一段旁白
    // 参数：无
    *next({ }, { put, select }) {
      const state = yield select(state => state.AsideModel);
      if (state.sectionId == -1)
        return;
      
      let nextSectionId = state.sectionId + 1
      if (nextSectionId >= state.sections.length) {
        yield put(action('hide')());
        return;
      }

      yield put(action('updateState')({
        content: state.sections[nextSectionId],
        sectionId: nextSectionId,
      }));
    },

    // Modal隐藏后执行相应的动作，因iOS不支持多个Modal同时出现。
    *onActionsAfterModalHidden({ }, { put, select }) {
      let state = yield select(state => state.AsideModel);
      let actions = (state.actions != null && state.actions.length > 0)
                      ? { actions: [...state.actions] }
                      : null;
      if (actions != null) {
        yield put(action('SceneModel/processActions')(actions));
      }
    },

    // 隐藏旁白
    // 参数：无
    *hide({ }, { put }) {
      yield put(action('updateState')({
        visible: false,
        sectionId: -1,
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
