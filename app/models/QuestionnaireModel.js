import {
  action,
  LocalCacheKeys,
  BOTTOM_TOP_SMOOTH
} from '../constants';

import lo, { range } from 'lodash';
import { GetLianQiTuzhiApi } from '../services/GetLianQiTuzhiApi';

import EventListeners from '../utils/EventListeners';
import LocalStorage from '../utils/LocalStorage';
import Toast from '../components/toast';
import { now } from '../utils/DateTimeUtils';

export default {
  namespace: 'QuestionnaireModel',

  state: {
  },

  effects: {
    *getQuestionnaireData({ }, { put, call }) {
      const data = yield call(LocalStorage.get, LocalCacheKeys.QUESTIONNAIRE_DATA);
      return data
    },
    *saveQuestionnaireData({ payload }, { put, call }) {
      yield call(LocalStorage.set, LocalCacheKeys.QUESTIONNAIRE_DATA, payload);
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