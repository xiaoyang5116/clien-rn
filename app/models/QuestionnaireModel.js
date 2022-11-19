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
    },

    *getAward({ payload }, { put, call, select }) {
      const dropsState = yield select(state => state.DropsModel);
      // 保存答题记录
      yield call(LocalStorage.set, LocalCacheKeys.QUESTIONNAIRE_DATA, {
        isFinish: payload.isFinish,
        problemKey: payload.toKey,
      });

      const { dropIds } = payload;
      if (lo.isEmpty(dropIds) || !lo.isArray(dropIds)) return

      for (let key in dropIds) {
        const dropId = dropIds[key];

        const found = dropsState.__data.config.find(e => lo.isEqual(e.id, dropId));
        if (found == undefined)
          continue

        if (lo.indexOf(dropsState.ids, dropId) != -1)
          return

        const actions = lo.pick(found, ['sendProps', 'alterAttrs']);
        if (lo.keys(actions).length > 0) {
          if (actions.sendProps != undefined) {
            yield put.resolve(action('SceneModel/processActions')({ ...actions }));
          }
          if (actions.alterAttrs != undefined) {
            const affects = [];
            actions.alterAttrs.forEach(e => {
              let [key, value] = e.split(',');
              key = lo.trim(key);
              value = parseInt(lo.trim(value));
              affects.push({ key, value });
            });

            yield put.resolve(action('UserModel/alterAttrs')({ affects, source: "questionnaire" }));
          }
        }

        // 记录完成
        dropsState.ids.push(dropId);
      }
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

}