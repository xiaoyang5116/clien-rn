
import {
  action,
  LocalCacheKeys,
  BOTTOM_TOP_SMOOTH
} from '../constants';
// import React from 'react';

import lo, { constant, range } from 'lodash';
import { GetDanFangDataApi } from '../services/GetDanFangDataApi';

import EventListeners from '../utils/EventListeners';
import LocalStorage from '../utils/LocalStorage';
import Toast from '../components/toast';
import { now } from '../utils/DateTimeUtils';
import RootView from '../components/RootView';
import LongTimeToast from '../components/toast/LongTimeToast';


export default {
  namespace: "ToastModel",

  state: {
    toastMessages: [],

    _isToastShow: false
  },

  effects: {
    *toastShow({ payload }, { put, call, select }) {
      const { _isToastShow, toastMessages } = yield select(state => state.ToastModel);

      if (!_isToastShow) {
        Toast.longTimeToast()
        yield put(action('updateState')({ _isToastShow: true }))
      }

      if (Array.isArray(payload)) {
        const newMessage = payload.map(item => ({ ...item, isShow: true }))
        yield put(action('updateState')({ toastMessages: [...toastMessages, ...newMessage] }))
      }
      else {
        yield put(action('updateState')({ toastMessages: [...toastMessages, { ...payload, isShow: true }] }))
      }
    },

    // 清除消息
    *clearToastMessages({ payload }, { put, call, select }) {
      const { _isToastShow } = yield select(state => state.ToastModel);
      if (_isToastShow === true) {
        yield put(action('updateState')({ toastMessages: [], _isToastShow: false }))
      }
    },

    *getToastMessages({ payload }, { put, call, select }) {

    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },

  // subscriptions: {
  //   registerReloadEvent({ dispatch }) {
  //     EventListeners.register('reload', (msg) => {
  //       return dispatch({ 'type': 'reload' });
  //     });
  //   },
  // }
}