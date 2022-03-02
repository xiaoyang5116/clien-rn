
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

    // 隐藏旁白
    // 参数：无
    *hide({ payload }, { put, select }) {
      const state = yield select(state => state.AsideModel);
      if (state.actions != null && state.actions.length > 0) {
        yield put.resolve(action('SceneModel/processActions')({ actions: state.actions }));
      }
      yield put(action('resetState')());
    }
  },
  
  reducers: {
    updateState(state, { payload }) {
      return { 
        ...state,
        ...payload
      };
    },

    resetState(state, { }) {
      return {
        ...state,

        confirmEvents: [],
        visible: false,
        sectionId: -1,
      };
    }
  },
}
