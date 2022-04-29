
import { 
  action,
  AppDispath,
  LocalCacheKeys,
} from "../constants";
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import { GetExploreDataApi } from '../services/GetExploreDataApi';
import { GetSeqDataApi } from '../services/GetSeqDataApi';
import { GetQiYuApi } from '../services/GetQiYuApi';
import lo from 'lodash';

const EVENT_NAME = [
  { event: 'slot', name: '获得一次自动抽奖机会' },
  { event: 'xunbao', name: '随机获得一张寻宝卡片' },
  { event: 'boss', name: '随机获得一次挑战BOSS的机会' },
  { event: 'xiansuo', name: '随机获得一次奖励线索' },
  { event: 'qiyu', name: '随机获得一张奇遇卡片' },
  { event: 'pk', name: '你遇到一个轻而易举就能必败的对手' },
];

const MYSELF_ATTRS = {
  uid: 1,
  userName: '你',
  life: 8000,// 生命
  speed: 100, // 速度
  power: 600, // 攻击力
  agile: 300, // 敏捷
  defense: 100, // 防御
  crit: 10, // 暴击
  dodge: 15, // 闪避
  skillIds: [1, 2],
};

export default {
  namespace: 'ExploreModel',

  state: {
    __data: {
      config: [],
    },

    // 探索地图列表
    maps: [],

    // 当前进入哪个地图
    mapId: -1,

    // 地图里面的那个区域
    areaId: 1,

    // 当前探索获得道具
    rewards: [],

    // 寻宝、战斗、线索、奇遇事件
    event_xunbao: [],
    event_boss: [],
    event_xiansuo: [],
    event_qiyu: [],
  },

  effects: {

    *reload({ }, { select, call, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const data = yield call(GetExploreDataApi);

      if (data != null) {
        data.explore.forEach(e => {
          e.areas.forEach(a => {
            const eventNum = Math.floor(a.time / a.interval);
            for (let i = 0; i < eventNum; i++) {
              if (a.points.find(e => e.idx == i) == undefined) {
                a.points.push({ idx: i, event: 'slot' });
              }
            }
            a.points.sort((_a, _b) => _a.idx - _b.idx);
          });
          e.areas.sort((_a, _b) => _a.id - _b.id);
        });
      }
      
      exploreState.__data.config.length = 0;
      exploreState.__data.config.push(...data.explore);
    },

    // 获取并加载地图
    *getMaps({ }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);

      const maps = [];
      for (let i = 0; i < exploreState.__data.config.length; i += 2) {
        const first = exploreState.__data.config[i];
        const second = exploreState.__data.config[i+1];
        const item = [];
        if (lo.isObject(first)) item.push(first);
        if (lo.isObject(second)) item.push(second);
        maps.push(item);
      }

      yield put(action('updateState')({ maps }));
    },

    *showBag({ }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const rewards = [];
      for (let key in exploreState.rewards) {
        const item = exploreState.rewards[key];
        // 道具信息
        const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: item.propId }));
        rewards.push({ 
          propId: item.propId, num: item.num, 
          name: propConfig.name, quality: propConfig.quality, iconId: propConfig.iconId 
        });
      }
      return rewards;
    },

    // 间隔时间事件
    *onTimeEvent({ payload }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { idx, refTimeBanner, refMsgList, refXunBaoButton, refBossButton, refXianSuoButton, refQiYuButton } = payload;

      const currentMap = exploreState.__data.config.find(e => e.id == exploreState.mapId);
      const currentArea = currentMap.areas.find(e => e.id == exploreState.areaId);
      const currentEvent = currentArea.points.find(e => e.idx == idx);
      const eventNum = Math.floor(currentArea.time / currentArea.interval);

      refTimeBanner.hide(idx);
      const eventName = EVENT_NAME.find(e => e.event == currentEvent.event).name;
      refMsgList.addMsg(eventName);

      const parameters = { map: currentMap, area: currentArea, event: currentEvent, refTimeBanner, refMsgList };
      switch (currentEvent.event) {
        case 'slot':
          yield put.resolve(action('onSlotEvent')({ ...parameters }));
          refTimeBanner.resume();
          break;
        case 'xunbao':
          yield put.resolve(action('onXunBaoEvent')({ ...parameters, refXunBaoButton }));
          refTimeBanner.resume();
          break;
        case 'boss':
          yield put.resolve(action('onBossEvent')({ ...parameters, refBossButton }));
          refTimeBanner.resume();
          break;
        case 'xiansuo':
          yield put.resolve(action('onXianSuoEvent')({ ...parameters, refXianSuoButton }));
          refTimeBanner.resume();
          break;
        case 'qiyu':
          yield put.resolve(action('onQiYuEvent')({ ...parameters, refQiYuButton }));
          refTimeBanner.resume();
          break;
        case 'pk':
          yield put.resolve(action('onPKEvent')({ ...parameters }));
          // refTimeBanner.resume();
          break;
      }

      // 是否结束
      if ((idx + 1) >= eventNum) {
        yield put.resolve(action('onTimeEnd')({ ...parameters }));
      }
    },

    // 时间事件结束
    *onTimeEnd({ payload }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { map, area, refMsgList } = payload;

      let nextArea = null;
      for (let key in map.areas) {
        const item = map.areas[key];
        if (item.id > area.id) {
          nextArea = item;
          break;
        }
      }

      // 开启下一个区域
      if (nextArea != null) {
        refMsgList.addMsg(` ====== 进入${nextArea.name} ======`);
        yield put(action('updateState')({ areaId: nextArea.id }));
      } else {
        // 地图所有区域探索完毕
        refMsgList.addMsg(' ====== 探索完毕 ====== ');
      }
    },

    // 抽奖事件
    *onSlotEvent({ payload }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { map, area, event } = payload;

      const rateTargets = [];
      if (area.slots.props.p100 != undefined) rateTargets.push(...area.slots.props.p100.map(e => ({ ...e, rate: e.rate * 100 })));
      if (area.slots.props.p1000 != undefined) rateTargets.push(...area.slots.props.p1000.map(e => ({ ...e, rate: e.rate * 10 })));
      if (area.slots.props.p10000 != undefined) rateTargets.push(...area.slots.props.p10000.map(e => ({ ...e })));

      rateTargets.sort((a, b) => b.rate - a.rate);
      let prevRange = 0;
      rateTargets.forEach(e => {
        e.range = [prevRange, prevRange + e.rate];
        prevRange = e.range[1];
      });

      for (let i = 0; i < 1; i++) {
        const randValue = lo.random(0, prevRange, false);
        let hit = rateTargets.find(e => randValue >= e.range[0] && randValue < e.range[1]);
        if (hit == undefined) hit = rateTargets[rateTargets.length - 1];

        // 将命中道具放入储物袋
        yield put.resolve(action('addReward')(hit));
      }
    },

    // 寻宝事件
    *onXunBaoEvent({ payload }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { map, area, event, refXunBaoButton } = payload;
      exploreState.event_xunbao.push({ id: (exploreState.event_xunbao.length + 1), ...event });
      refXunBaoButton.setNum(exploreState.event_xunbao.length);
    },

    // 挑战BOSS事件
    *onBossEvent({ payload }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { map, area, event, refBossButton } = payload;
      exploreState.event_boss.push({ id: (exploreState.event_boss.length + 1), ...event });
      refBossButton.setNum(exploreState.event_boss.length);
    },

    // 线索事件
    *onXianSuoEvent({ payload }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { map, area, event, refXianSuoButton } = payload;
      exploreState.event_xiansuo.push(event);
      refXianSuoButton.setNum(exploreState.event_xiansuo.length);
    },

    // 奇遇事件
    *onQiYuEvent({ payload }, { select, put, call }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { map, area, event, refQiYuButton } = payload;
      const { data } = yield call(GetQiYuApi, event.action)
      exploreState.event_qiyu.push({ id: (exploreState.event_qiyu.length + 1), ...event, ...data });
      refQiYuButton.setNum(exploreState.event_qiyu.length);
    },
    // 改变奇遇事件状态
    *changeQiYuStatus({ payload }, { select, put, call }) {
      // [ {id: "qiyu_1_XXX", isFinish: true} ]  奇遇事件状态存储格式
      const oldData = yield call(LocalStorage.get, LocalCacheKeys.QYEVENT_DATA);
      // const { id, refQiYuButton } = payload;
      // console.log('oldData', oldData, payload);
      const newData = {
        id: payload.id,
        isFinish: true
      }

      if (oldData !== null) {
        yield call(LocalStorage.set, LocalCacheKeys.QYEVENT_DATA, [...oldData, newData]);
      }
      else {
        yield call(LocalStorage.set, LocalCacheKeys.QYEVENT_DATA, [newData]);
      }

      const exploreState = yield select(state => state.ExploreModel);
      console.log("exploreState", exploreState.event_qiyu);
      const newQiyuData= exploreState.event_qiyu.filter(e => e.id !== payload.id);
      console.log("newQiyuData", newQiyuData.length);
      exploreState.event_qiyu = newQiyuData;
      // refQiYuButton.setNum(exploreState.event_qiyu.length);
    },
    // 已完成的奇遇事件
    // *getCompletedQiYuEvent({ payload }, { select, put, call }) {
    //   return yield call(LocalStorage.get, LocalCacheKeys.QYEVENT_DATA);
    // },

    // 挑战杂鱼
    *onPKEvent({ payload }, { select, put, call }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { map, area, event, refTimeBanner, refMsgList } = payload;

      const seqData = yield call(GetSeqDataApi, event.seqId);
      const seqConfig = seqData.sequences.find(e => e.id == event.seqId);
      const enemiesGroup = seqConfig.enemies.find(e => e.group == event.group);

      // 单打一个杂鱼
      const enemy = enemiesGroup.items[0];
      const report = yield put.resolve(action('ChallengeModel/challenge')({ myself: MYSELF_ATTRS, enemy}));
      if (lo.isArray(report)) {
        // 播放战报
        const msgList = report.map(e => e.msg);
        refMsgList.addMsgs(msgList, 600, () => {
          refTimeBanner.resume();

          // 提前发放奖励-后续优化
          const reward = seqConfig.awards.items.find(e => e.uid.indexOf(enemy.uid) != -1);
          if (reward != undefined) {
            AppDispath({ type: 'ExploreModel/addReward', payload: reward });
          }
        });

      }
    },

    // 添加奖励到储物袋
    *addReward({ payload }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { propId, num } = payload;

      const prop = exploreState.rewards.find(e => e.propId == propId);
      if (prop != undefined) {
        prop.num += num;
      } else {
        exploreState.rewards.push({ propId, num });
      }
    },

    // 获得奖励并放入背包
    *getRewards({ }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);

      // 复制一份
      const rewards = [...exploreState.rewards];
      exploreState.rewards.length = 0;

      yield put.resolve(action('PropsModel/sendPropsBatch')(rewards));
    },

    // 开始探索
    *start({ payload }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { mapId } = payload;
      //
      exploreState.mapId = mapId;
      exploreState.areaId = 1;
      exploreState.rewards.length = 0;
      //
      exploreState.event_xunbao.length = 0;
      exploreState.event_boss.length = 0;
      exploreState.event_xiansuo.length = 0;
      exploreState.event_qiyu.length = 0;
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
        return dispatch({ 'type':  'reload'});
      });
    },
  }
}
