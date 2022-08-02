
import {
  action,
  LocalCacheKeys,
  DeviceEventEmitter,
  EventKeys,
} from "../constants";

import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import { GetClueDataApi } from "../services/GetClueDataApi";
import { GetClueConfigDataApi } from "../services/GetClueConfigDataApi";


export default {
  namespace: 'CluesModel',

  state: {
    // 已获得的线索
    cluesList: [],
    // 线索配置数据
    cluesConfigData: {},
    // 所有的线索数据
    __allCluesData: []
  },

  effects: {
    *reload({ }, { call, put, select }) {
      // 获取本地存储的线索
      let cluesList = yield call(LocalStorage.get, LocalCacheKeys.CLUES_DATA);
      // 获取线索配置数据
      const { cluesConfigData } = yield call(GetClueConfigDataApi);
      // 获取 所有的线索数据
      let __allCluesData = []
      for (let index = 0; index < cluesConfigData.config_List.length; index++) {
        const path = cluesConfigData.config_List[index];
        const { clues } = yield call(GetClueDataApi, path)
        __allCluesData.push(clues)
      }

      // 本地存储的线索 不为空时
      if (cluesList !== null) {
        yield put.resolve(action('updateState')({ cluesList, cluesConfigData, __allCluesData }));
      }
      // 当本地 线索数据 为 null 时, 根据配置文件获取默认的线索 id,找到对应的线索数据,更新线索列表并存储到本地
      if (cluesList === null) {
        const { defaultClues } = cluesConfigData;
        let newCluesList = [];
        for (let index = 0; index < defaultClues.length; index++) {
          const item = defaultClues[index]
          const data = __allCluesData.find(i => i.id === item)
          if (data !== undefined) {
            newCluesList.push({ ...data, status: 0 });
          }
        }
        yield call(LocalStorage.set, LocalCacheKeys.CLUES_DATA, newCluesList);
        yield put(action('updateState')({ cluesConfigData, cluesList: newCluesList, __allCluesData }));
      }
    },

    // 添加线索
    *addClues({ payload }, { call, put, select }) {
      // payload {"cluesId": "xiansuo4"}
      const { cluesId } = payload
      const { cluesList, __allCluesData, cluesConfigData } = yield select(state => state.CluesModel);

      if (!Array.isArray(cluesId)) return console.debug("cluesId 是一个数组")

      let newCluesList = [];
      for (let index = 0; index < cluesId.length; index++) {
        // 跳过已经存在的线索
        if (cluesList.filter(item => item.id === cluesId[index]).length !== 0) continue;

        const clues = __allCluesData.find(item => item.id === cluesId[index])
        if (clues === undefined) return console.debug("未找到线索")
        newCluesList.push({ ...clues, status: 0 })
      }
      yield put.resolve(action('saveCluesList')([...newCluesList, ...cluesList]));
    },

    // 保存并更新线索
    * saveCluesList({ payload }, { call, put, select }) {
      yield call(LocalStorage.set, LocalCacheKeys.CLUES_DATA, payload);
      yield put(action('updateState')({ cluesList: payload }));
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

  subscriptions: {
    registerReloadEvent({ dispatch }) {
      EventListeners.register('reload', (msg) => {
        return dispatch({ 'type': 'reload' });
      });
    },
  }
}
