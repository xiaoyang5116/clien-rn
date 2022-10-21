import { action, LocalCacheKeys, BOTTOM_TOP_SMOOTH } from '../constants';

import lo, { range } from 'lodash';
import { GetGongFaDataApi } from '../services/GetGongFaDataApi';

import EventListeners from '../utils/EventListeners';
import LocalStorage from '../utils/LocalStorage';
import Toast from '../components/toast';
import { now } from '../utils/DateTimeUtils';

// gongFaStatus: 0-未修炼 || 1-已修炼 || 2-圆满
export default {
  namespace: 'GongFaModel',

  state: {
    gongFaConfig: [],
    gongFaProgressData: [],
  },

  effects: {
    *reload({ }, { select, call, put }) {
      const { data } = yield call(GetGongFaDataApi);
      const gongFaProgressData = yield call(
        LocalStorage.get,
        LocalCacheKeys.GONG_FA_DATA,
      );

      if (gongFaProgressData === null) {
        // 初始化 功法进度数据
        const { gonFaData } = data;
        const initGongFaProgressData = gonFaData.map(item => ({
          gongFaId: item.gongFaId,
          gongFaLayer: 0,
          gongFaGrade: 0,
          gongFaStatus: 0,
        }));
        yield call(
          LocalStorage.set,
          LocalCacheKeys.GONG_FA_DATA,
          initGongFaProgressData,
        );
        yield put(
          action('updateState')({
            gongFaConfig: data,
            gongFaProgressData: initGongFaProgressData,
          }),
        );
      } else {
        // 加载 本地功法进度数据
        yield put(
          action('updateState')({
            gongFaConfig: data,
            gongFaProgressData,
          }),
        );
      }
    },

    // 获取 功法阶级 数据
    *getGongFaLevelData({ }, { select, call, put }) {
      const { gongFaConfig } = yield select(state => state.GongFaModel);
      const { gongFaLevelData, gonFaData } = gongFaConfig;
      for (let index = 0; index < gongFaLevelData.length; index++) {
        const gongFaLevel = gongFaLevelData[index];
        gongFaLevel.gongFaConfig = [];
        for (let i = 0; i < gongFaLevel.gongFaId.length; i++) {
          const gongFaId = gongFaLevel.gongFaId[i];
          const gongFaConfig = gonFaData.find(
            item => (item.gongFaId === gongFaId),
          );
          gongFaLevel.gongFaConfig.push({ ...gongFaConfig });
        }
      }
      return gongFaLevelData
    },

    // 打开功法
    *openGongFa({ payload }, { select, call, put }) {
      const { gongFaId } = payload
      const { gongFaConfig, gongFaProgressData } = yield select(state => state.GongFaModel);
      const currentGongFa = gongFaConfig.gonFaData.find(item => item.gongFaId === gongFaId)
      const currentGongFaProgress = gongFaProgressData.find(item => item.gongFaId === gongFaId)
      if (currentGongFaProgress.gongFaStatus === 0) {
        const message = []
        if (currentGongFa.conditions.needProps !== undefined) {
          const { needProps } = currentGongFa.conditions
          for (let index = 0; index < needProps.length; index++) {
            const prop = needProps[index].split(',');
            const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: Number(prop[0]) }));
            const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: Number(prop[0]) }));
            const isOK = propNum >= Number(prop[1])
            message.push({ isOK: isOK,msg: `拥有${propConfig.name}数量: ${propNum}/${Number(prop[1])}` })
          }
        }
        return message
      }
    },

    // 进入功法
    *enterGongFa({ payload }, { select, call, put }){
      const { gongFaId } = payload
      const { gongFaConfig, gongFaProgressData } = yield select(state => state.GongFaModel);

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
};
