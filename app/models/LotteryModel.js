
import { 
  action,
} from "../constants";

import { GetLotteryDataApi } from '../services/GetLotteryDataApi';
import EventListeners from '../utils/EventListeners';
import lo from 'lodash';
import Toast from "../components/toast";

export default {
  namespace: 'LotteryModel',

  state: {
    __data: {
      lotteries_config: [],
    }
  },

  effects: {

    *reload({ }, { select, call, put }) {
      const lotteryState = yield select(state => state.LotteryModel);
      const data_v1 = yield call(GetLotteryDataApi, 'v1');
      
      lotteryState.__data.lotteries_config.length = 0;
      if (lo.isArray(data_v1.lotteries)) {
        lotteryState.__data.lotteries_config.push(...data_v1.lotteries);
      }
    },

    *lottery({ payload }, { select, call, put }) {
      const lotteryState = yield select(state => state.LotteryModel);
      const { id } = payload;

      const lottery = lotteryState.__data.lotteries_config.find(e => e.id == id);
      if (lottery == undefined) {
        Toast.show('抽奖配置异常！');
        return;
      }

      const result = yield put.resolve(action('PropsModel/reduce')({ ...lottery.useProps, mode: 1 }));
      if (result && lo.isObject(lottery.products) && lo.isObject(lottery.products.props)) {
        const rateTargets = [];
        if (lottery.products.props.p100 != undefined) rateTargets.push(...lottery.products.props.p100.map(e => ({ ...e, rate: e.rate * 100 })));
        if (lottery.products.props.p1000 != undefined) rateTargets.push(...lottery.products.props.p1000.map(e => ({ ...e, rate: e.rate * 10 })));
        if (lottery.products.props.p10000 != undefined) rateTargets.push(...lottery.products.props.p10000.map(e => ({ ...e })));

        rateTargets.sort((a, b) => b.rate - a.rate);
        let prevRange = 0;
        rateTargets.forEach(e => {
          e.range = [prevRange, prevRange + e.rate];
          prevRange = e.range[1];
        });

        const rewards = []; // 记录获得的奖励
        for (let i = 0; i < lottery.times; i++) {
          const randValue = lo.random(0, prevRange, false);
          let hit = rateTargets.find(e => randValue >= e.range[0] && randValue < e.range[1]);
          if (hit == undefined) hit = rateTargets[rateTargets.length - 1];

          // 道具信息
          const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: hit.propId }));
          rewards.push({ 
            propId: hit.propId, num: hit.num, 
            name: propConfig.name, quality: propConfig.quality, iconId: propConfig.iconId 
          });
        }

        // 批量发放道具
        yield put.resolve(action('PropsModel/sendPropsBatch')({ props: rewards }));
        return rewards;
      }
    },

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
        dispatch({ 'type':  'reload'});
      });
    },
  }
}
