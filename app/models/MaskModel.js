
import {
  action, delay
} from "../constants";

const DIALOG_TYPE = 1;
const ASIDE_TYPE = 2;

class Queue {
  constructor() {
    this._list = [];
  }

  addDialog(title, content, confirmActions) {
    this._list.push({
      mtype: DIALOG_TYPE,
      title: title,
      content: content,
      doneActions: [...confirmActions],
      //
      confirm: false,
      hidden: false,
    })
  }

  addAside(title, style, sections, finishActions) {
    this._list.push({
      mtype: ASIDE_TYPE,
      title: title,
      style: style,
      sections: [...sections],
      doneActions: [...finishActions],
      //
      sectionId: 0,
      hidden: false,
    });
  }

  next() {
    return this._list.shift();
  }
}

export default {
  namespace: 'MaskModel',

  state: {
    data: {
      _queue: new Queue(),
      _current: null,
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
    *showDialog({ payload }, { put, select }) {
      const state = yield select(state => state.MaskModel);
      state.data._queue.addDialog(payload.title, payload.content, payload.confirm_actions);
      yield put.resolve(action('_checkNext')({}));
    },

    // 显示旁白
    // 参数: aside 标准配置结构
    *showAside({ payload }, { put, select }) {
      const state = yield select(state => state.MaskModel);
      state.data._queue.addAside(payload.title, payload.style, payload.sections, payload.finish_actions);
      yield put.resolve(action('_checkNext')({}));
    },

    // 响应确认按钮
    *onDialogConfirm({ }, { put, select }) {
      const state = yield select(state => state.MaskModel);
      let current = state.data._current;
      if (current != null && current.mtype == DIALOG_TYPE) {
        current.confirm = true;
        yield put.resolve(action('hide')());
      }
    },

    // 响应下一段旁白
    *onNextAside({ }, { put, select }) {
      const state = yield select(state => state.MaskModel);
      let current = state.data._current;
      if (current != null && current.mtype == ASIDE_TYPE) {
        let nextSectionId = current.sectionId + 1;
        if (nextSectionId >= current.sections.length) {
          yield put.resolve(action('hide')());
          return;
        }

        current.sectionId = nextSectionId;
        yield put(action('updateState')({ 
          content: current.sections[nextSectionId], 
        }));
      }
    },

    // Modal隐藏后执行, 多Modal同时存在iOS会出现卡s
    *onActionsAfterModalHidden({ }, { put, select, call }) {
      let state = yield select(state => state.MaskModel);
      let current = state.data._current;

      if (current != null && !current.hidden) { // Modal回调2次？啥原因
        current.hidden = true;
        if (current.doneActions.length > 0
          && (current.mtype == ASIDE_TYPE || (current.mtype == DIALOG_TYPE && current.confirm))) {
          yield put.resolve(action('SceneModel/processActions')({ actions: [...current.doneActions] }));
        }
        state.data._current = null;
        yield put.resolve(action('_checkNext')({}));
      }
    },

    *_checkNext({}, { put, select }) {
      let state = yield select(state => state.MaskModel);
      if (state.data._current != null)
        return;

      let next = state.data._queue.next();
      if (next != undefined) {
        state.data._current = next;
        if (next.mtype == DIALOG_TYPE) {
          yield put(action('updateState')({ 
            mtype: DIALOG_TYPE,
            title: next.title, 
            content: next.content, 
            visible: true,
          }));
        } else if (next.mtype == ASIDE_TYPE) {
          yield put(action('updateState')({
            mtype: ASIDE_TYPE,
            title: next.title,
            content: next.sections[0],
            subStype: next.style,
            visible: true,
          }));
        }
      }
    },

    *hide({ }, { put }) {
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
