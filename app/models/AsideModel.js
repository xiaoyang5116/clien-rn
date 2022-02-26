
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
    npcId: -1,
    sectionId: -1,
    sections: []
  },

  effects: {
    *show({ payload }, { call, put, select }) {
      const state = yield select(state => state.AsideModel);

      if (state.npcId > 0 && state.npcId != payload.parent.id) {
        yield put(action('hide')());
        return;
      }

      if (state.npcId > 0) {
        yield put(action('next')());
        return;
      }

      yield put(action('updateState')({
        title: payload.title,
        content: payload.sections[0],
        style: payload.style,
        visible: true,
        npcId: payload.parent.id,
        sectionId: 0,
        sections: payload.sections
      }));
    },

    *next({ payload }, { call, put, select }) {
      const state = yield select(state => state.AsideModel);
      if (state.npcId <= 0)
        return;
      
      let nextSectionId = state.sectionId + 1
      if (nextSectionId >= state.sections.length) {
        // 旁白结束
        yield put(action('hide')());
        return;
      }

      yield put(action('updateState')({
        content: state.sections[nextSectionId],
        sectionId: nextSectionId,
      }));
    },

    *hide({ payload }, { call, put }) {
      yield put(action('updateState')({ visible: false, npcId: -1, sectionId: -1 }));
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
