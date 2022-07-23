import {
  action,
} from "../constants";

import { GetTreasureChestDataApi } from '../services/GetTreasureChestDataApi';
import EventListeners from '../utils/EventListeners';
import lo from 'lodash';
import Toast from "../components/toast";

export default {
  namespace: 'TreasureChestModel',

  state: {
    treasureChestData: []
  },

  effects: {
    *getTreasureChestData({ }, { select, call }) {
      const { treasureChestData } = yield select(state => state.TreasureChestModel);
      const { data } = yield call(GetTreasureChestDataApi)
      treasureChestData.push(...data)
    },
    *openTreasureChest({ payload }, { select, call, put }) {
      const { treasureChestData } = yield select(state => state.TreasureChestModel)

      const currentTreasureChest = treasureChestData.find(item => item.id === payload.id)
      if (currentTreasureChest === undefined) return console.debug("没有这个宝箱")

      const rateTargets = [];
      if (currentTreasureChest.products.props.p100 != undefined) rateTargets.push(...currentTreasureChest.products.props.p100.map(e => ({ ...e, rate: e.rate * 100 })));
      if (currentTreasureChest.products.props.p1000 != undefined) rateTargets.push(...currentTreasureChest.products.props.p1000.map(e => ({ ...e, rate: e.rate * 10 })));
      if (currentTreasureChest.products.props.p10000 != undefined) rateTargets.push(...currentTreasureChest.products.props.p10000.map(e => ({ ...e })));

      rateTargets.sort((a, b) => b.rate - a.rate);
      let prevRange = 0;
      rateTargets.forEach(e => {
        e.range = [prevRange, prevRange + e.rate];
        prevRange = e.range[1];
      });

      const rewards = []; // 记录获得的奖励
      const randValue = lo.random(0, prevRange, false);
      let hit = rateTargets.find(e => randValue >= e.range[0] && randValue < e.range[1]);
      if (hit == undefined) hit = rateTargets[rateTargets.length - 1];

      // 道具信息
      const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: hit.propId }));
      rewards.push({
        propId: hit.propId, num: hit.num,
        name: propConfig.name, quality: propConfig.quality, iconId: propConfig.iconId
      });

      // 批量发放道具
      yield put.resolve(action('PropsModel/sendPropsBatch')({ props: rewards }));
      return rewards;

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