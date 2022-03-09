
import {
  action
} from "../constants";

const DIALOG_TYPE = 1;
const ASIDE_TYPE = 2;

class Queue {
  constructor() {
    this._list = [];
  }

  addDialog(title, content, confirmActions, varsOn) {
    this._list.push({
      mtype: DIALOG_TYPE,
      title: title,
      content: content,
      actions: [...confirmActions],
      varsOn: varsOn,
      //
      confirm: false,
      hidden: false,
    })
  }

  addAside(title, style, sections, finishActions, varsOn) {
    this._list.push({
      mtype: ASIDE_TYPE,
      title: title,
      style: style,
      sections: [...sections],
      actions: [...finishActions],
      varsOn: varsOn,
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
      const maskState = yield select(state => state.MaskModel);
      maskState.data._queue.addDialog(payload.title, payload.content, payload.confirm_actions, payload.varsOn);
      yield put.resolve(action('_checkNext')({}));
    },

    // 显示旁白
    // 参数: aside 标准配置结构
    *showAside({ payload }, { put, select }) {
      const maskState = yield select(state => state.MaskModel);
      maskState.data._queue.addAside(payload.title, payload.style, payload.sections, payload.finish_actions, payload.varsOn);
      yield put.resolve(action('_checkNext')({}));
    },

    // 响应确认按钮
    *onDialogConfirm({ }, { put, select }) {
      const maskState = yield select(state => state.MaskModel);
      const current = maskState.data._current;
      if (current != null && current.mtype == DIALOG_TYPE) {
        current.confirm = true;
        yield put.resolve(action('hide')());
      }
    },

    // 响应下一段旁白
    *onNextAside({ }, { put, select }) {
      const maskState = yield select(state => state.MaskModel);
      const current = maskState.data._current;
      if (current != null && current.mtype == ASIDE_TYPE) {
        const nextSectionId = current.sectionId + 1;
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
    *onActionsAfterModalHidden({ }, { put, select }) {
      const maskState = yield select(state => state.MaskModel);
      const current = maskState.data._current;

      if (current != null && !current.hidden) { // Modal回调2次？啥原因
        current.hidden = true;
        if (current.actions.length > 0
          && (current.mtype == ASIDE_TYPE || (current.mtype == DIALOG_TYPE && current.confirm))) {
          const pl = { actions: [...current.actions] };
          if (current.varsOn != undefined) pl.varsOn = current.varsOn;
          yield put.resolve(action('SceneModel/processActions')(pl));
        }
        maskState.data._current = null;
        yield put.resolve(action('_checkNext')({}));
      }
    },

    *_checkNext({}, { put, select }) {
      const maskState = yield select(state => state.MaskModel);
      if (maskState.data._current != null)
        return;

      const next = maskState.data._queue.next();
      if (next != undefined) {
        maskState.data._current = next;
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
        ...payload,
      };
    }
  },
}
