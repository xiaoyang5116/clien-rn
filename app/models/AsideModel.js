
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
    action: null,
  },

  effects: {
    *show({ payload }, { call, put, select }) {
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
        action: payload,
        sectionId: 0,
        visible: true,
      }));
    },

    *next({ payload }, { call, put, select }) {
      const state = yield select(state => state.AsideModel);
      if (state.sectionId == -1)
        return;
      
      let nextSectionId = state.sectionId + 1
      if (nextSectionId >= state.sections.length) {
        yield put(action('hide')()); // 旁白结束
        return;
      }

      yield put(action('updateState')({
        content: state.sections[nextSectionId],
        sectionId: nextSectionId,
      }));
    },

    *hide({ payload }, { call, put, select }) {
      const state = yield select(state => state.AsideModel);
      if (state.action != null) {
        console.debug(state.action);
        yield put.resolve(action('SceneModel/triggerDialogConfirmEvent')(state.action));
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

    resetState(state, { payload }) {
      return {
        ...state,
        visible: false,
        sectionId: -1,
      };
    }
  },
}
