import { action, LocalCacheKeys, BOTTOM_TOP_SMOOTH } from '../constants';

import { GetAchievementDataApi } from '../services/GetAchievementDataApi';

import EventListeners from '../utils/EventListeners';
import LocalStorage from '../utils/LocalStorage';
import Toast from '../components/toast';
import { now } from '../utils/DateTimeUtils';

export default {
  namespace: 'AchievementModel',

  state: {
    achievementConfig: [],
    achievementData: [],
  },

  effects: {
    *reload({ }, { select, call, put }) {
      const { data } = yield call(GetAchievementDataApi);
      const achievementData = yield call(
        LocalStorage.get,
        LocalCacheKeys.ACHIEVEMENT_DATA,
      );
      if (achievementData !== null) {
        yield put(action('updateState')({ achievementConfig: data, achievementData }));
      } else {
        yield put(action('updateState')({ achievementConfig: data, achievementData: [] }));
      }
    },

    *getAchievementData({ }, { select, call, put }) {
      const { achievementData } = yield select(state => state.AchievementModel)
      return achievementData
    },

    *addAchievement({ payload }, { select, call, put }) {
      const { addAchievementId } = payload
      const { achievementData, achievementConfig } = yield select(state => state.AchievementModel)

      let newAchievementData = [...achievementData]
      let messages = []
      for (let index = 0; index < addAchievementId.length; index++) {
        const id = addAchievementId[index];
        // 跳过已获得的成就
        if (achievementData.find(item => item.id === id) != undefined) continue;

        const achievement = achievementConfig.find(item => item.id === id)
        if (achievement === undefined) return console.log("未找到成就")
        newAchievementData.push({ ...achievement, unlockTime: now() })
        messages.push({
          content: achievement.detail,
          title: achievement.title,
        })
      }

      // 提示获得成就
      yield put(action('ToastModel/toastShow')({ messages, type: "achievement" }));
      yield call(
        LocalStorage.set,
        LocalCacheKeys.ACHIEVEMENT_DATA,
        newAchievementData
      );
      yield yield put(action('updateState')({ achievementData: newAchievementData }));

    }

  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    registerReloadEvent({ dispatch }) {
      EventListeners.register('reload', msg => {
        return dispatch({ type: 'reload' });
      });
    },
  },
};
