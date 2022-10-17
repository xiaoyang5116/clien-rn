import LocalStorage from '../../utils/LocalStorage';
import { action, LocalCacheKeys } from '../../constants';
import EventListeners from '../../utils/EventListeners';
import { GetTurnLattice } from '../../services/GetTurnLattice';

export default {
  namespace: 'TurnLatticeModel',
  state: {
    turnLatticeData: []
  },
  effects: {
    *getTurnLatticeData({ payload }, { call, put, select }) {
      const historyData = yield call(LocalStorage.get, LocalCacheKeys.TURN_LATTICE_DATA);
      if (historyData === null) {
        const { data } = yield call(GetTurnLattice)
        yield put(action("updateState")({ turnLatticeData: data }))
        return data
      } else {
        yield put(action("updateState")({ turnLatticeData: historyData }))
        return historyData
      }
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

  // subscriptions: {
  //   registerReloadEvent({ dispatch }) {
  //     EventListeners.register('reload', msg => {
  //       return dispatch({ type: 'reload' });
  //     });
  //   },
  // },
} 