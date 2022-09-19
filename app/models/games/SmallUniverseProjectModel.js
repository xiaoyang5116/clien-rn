import LocalStorage from '../../utils/LocalStorage';
import { action, LocalCacheKeys } from '../../constants';
import EventListeners from '../../utils/EventListeners';
// import { now } from '../utils/DateTimeUtils';
import { GetSmallUniverseProjectDataApi } from '../../services/GetSmallUniverseProjectDataApi';
// import lo from 'lodash';

export default {
  namespace: 'SmallUniverseProject',
  state: {
    smallUniverseProject_configData: [],
    smallUniverseProject_data: []
  },
  effects: {
    *reload({ payload }, { call, put, select }) {
      const { data } = yield call(GetSmallUniverseProjectDataApi)
      const SmallUniverseProjectData = yield call(LocalStorage.get, LocalCacheKeys.SMALL_UNIVERSE_PROJECT_DATA);
      if (SmallUniverseProjectData != null) {
        yield put(action('updateState')({
          smallUniverseProject_configData: data,
          smallUniverseProject_data: SmallUniverseProjectData
        }))

      } else {
        // 主属性
        const mainAttrs = data.mainAttrs.map(item => ({ name: item.name, desc: item.desc, ...item.levelConfig[0] }))
        // 副属性
        let allSubAttrs = []
        for (let index = 0; index < data.allSubAttrs.length; index++) {
          const item = data.allSubAttrs[index];
          const key = item.key
          let value = 0
          for (let mainAttrsIndex = 0; mainAttrsIndex < data.mainAttrs.length; mainAttrsIndex++) {
            const subAttrs = data.mainAttrs[mainAttrsIndex].levelConfig[0].subAttrs;
            for (let index = 0; index < subAttrs.length; index++) {
              const subAttr = subAttrs[index].split(',');
              if (key === subAttr[0]) {
                value += Number(subAttr[1])
              }
            }
          }
          allSubAttrs.push({
            key,
            value
          })
        }

        const smallUniverseProject_data = {
          mainAttrs,
          allSubAttrs,
          levelProgress: parseInt((4 / data.overallGrade) * 100)
        }
        yield call(LocalStorage.set, LocalCacheKeys.SMALL_UNIVERSE_PROJECT_DATA, smallUniverseProject_data);
        yield put(action('updateState')({
          smallUniverseProject_configData: data,
          smallUniverseProject_data,
        }))
      }
    },



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
} 