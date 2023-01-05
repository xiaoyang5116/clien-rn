
import {
  action
} from "../constants";
import lo from 'lodash';

const DIALOG_TYPE = 1;
const ASIDE_TYPE = 2;

class Queue {
  constructor() {
    this._list = [];
  }

  add(payload, primaryType) {
    this._list.push({
      ...payload,
      //
      primaryType: primaryType,
      confirm: false,
      sectionId: 0,
      hidden: false,
    })
  }

  next() {
    return this._list.shift();
  }
}

export default {
  namespace: 'MaskModel',

  state: {
    __data: {
      queue: new Queue(), // 支持：一次性添加多个弹窗
      current: null,
    },

    primaryType: 0,   // 主类: 1: 对话框, 2: 旁白
    style: 0,         // 样式ID
    title: '',
    content: '',
    visible: false,
    viewData: null,   // 完整的视图数据
  },

  effects: {
    // 显示对话框
    // 参数 dialog 标准配置结构
    *showDialog({ payload }, { put, select }) {
      const maskState = yield select(state => state.MaskModel);
      //
      let primaryType = 0;
      if (payload.content != undefined)
        primaryType = DIALOG_TYPE;
      else if (payload.sections != undefined)
        primaryType = ASIDE_TYPE;
      //
      if (primaryType != 0) {
        maskState.__data.queue.add(payload, primaryType);
        yield put.resolve(action('_checkNext')({}));
      }
    },

    // 响应确认按钮
    *onDialogConfirm({ }, { put, select }) {
      const maskState = yield select(state => state.MaskModel);
      const current = maskState.__data.current;
      if (current != null && current.primaryType == DIALOG_TYPE) {
        current.confirm = true;
        yield put.resolve(action('hide')());
      }
    },

    // 响应下一段旁白
    *onNextAside({ }, { put, select }) {
      const maskState = yield select(state => state.MaskModel);
      const current = maskState.__data.current;
      if (current != null && current.primaryType == ASIDE_TYPE) {
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
      const current = maskState.__data.current;

      if (current != null && !current.hidden) { // Modal回调2次？啥原因
        current.hidden = true;
        if (current.primaryType == ASIDE_TYPE || (current.primaryType == DIALOG_TYPE && current.confirm)) {
          yield put.resolve(action('SceneModel/processActions')(current));
        }

        maskState.__data.current = null;
        maskState.primaryType = 0;
        maskState.style = 0;
        maskState.title = '';
        maskState.content = '';
        maskState.viewData = null;
        yield put.resolve(action('_checkNext')({}));
      }
    },

    *_checkNext({ }, { put, select }) {
      const maskState = yield select(state => state.MaskModel);
      if (maskState.__data.current != null)
        return;

      const next = maskState.__data.queue.next();
      if (next != undefined) {
        maskState.__data.current = next;

        let content = '';
        if (next.primaryType == DIALOG_TYPE)
          content = next.content;
        else if (next.primaryType == ASIDE_TYPE)
          content = next.sections[0]
        //
        yield put(action('updateState')({
          primaryType: next.primaryType,
          title: next.title,
          content: content,
          style: next.style,
          visible: true,
          viewData: next,
        }));
      }
    },

    *hide({ }, { put }) {
      yield put(action('updateState')({
        visible: false,
      }));
    },

    // 获取选项按钮数组,返回新的状态数组 
    *getOptionBtnStatus({ payload }, { call, put, select }) {
      const { optionBtnArr, __sceneId } = payload
      const newBtnArr =  yield put.resolve(action('ArticleModel/getValidOptions')({ options: optionBtnArr }));
      return newBtnArr
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

  subscriptions: {
    registerReloadEvent({ dispatch }) {
      // EventListeners.register('reload', (msg) => {
      //   return dispatch({ 'type':  'reload'});
      // });
    },
  }
}
