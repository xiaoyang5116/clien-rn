
import { 
  action,
  AppDispath,
} from "../constants";

import EventListeners from '../utils/EventListeners';
import { GetExploreDataApi } from '../services/GetExploreDataApi';
import { GetSeqDataApi } from '../services/GetSeqDataApi';
import lo from 'lodash';

const EVENTS_CONFIG = [
  { eventName: 'slot', handlerName: 'onSlotEvent', desc: '获得一次自动抽奖机会' },
  { eventName: 'xunbao', handlerName: 'onXunBaoEvent', desc: '随机获得一张寻宝卡片' },
  { eventName: 'boss', handlerName: 'onBossEvent', desc: '随机获得一次挑战BOSS的机会' },
  { eventName: 'xiansuo', handlerName: 'onXianSuoEvent', desc: '随机获得一次奖励线索' },
  { eventName: 'qiyu', handlerName: 'onQiYuEvent', desc: '随机获得一张奇遇卡片' },
  { eventName: 'pk', handlerName: 'onPKEvent', desc: '你遇到一个轻而易举就能必败的对手' },
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
      // 探索配置
      config: [],
      
      // 挑战等待队列
      pendingChallengeQueue: [],
    },

    // 探索地图列表
    maps: [],

    // 当前进入哪个地图
    mapId: -1,

    // 地图里面的那个区域
    areaId: 1,

    // 当前探索获得道具
    rewards: [],

    // 是否战斗中
    challenging: false,

    // 寻宝、战斗、线索、奇遇事件
    event_xunbao: [],
    event_boss: [],
    event_xiansuo: [],
    event_qiyu: [],

    // 组件引用
    refTimeBanner: null,
    refMsgList: null, 
    refXunBaoButton: null, 
    refBossButton: null, 
    refXianSuoButton: null, 
    refQiYuButton: null,
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
      const eventCfg = EVENTS_CONFIG.find(e => e.eventName == currentEvent.event);
      refMsgList.addMsg(eventCfg.desc);

      const parameters = { map: currentMap, area: currentArea, event: currentEvent, 
                          refTimeBanner, refMsgList, refXunBaoButton, refBossButton, refXianSuoButton, refQiYuButton };
      // 处理指定事件逻辑
      yield put.resolve(action(eventCfg.handlerName)({ ...parameters }));

      // 处理等待挑战的BOSS
      if (exploreState.__data.pendingChallengeQueue.length > 0) {
        const challengeEvent = exploreState.__data.pendingChallengeQueue.shift();
        refBossButton.setNum(exploreState.event_boss.length);
        yield put.resolve(action('onPKEvent')({ ...parameters, event: challengeEvent }));
      } else if (currentEvent.event != 'pk') {
        refTimeBanner.resume();
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
    *onQiYuEvent({ payload }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { map, area, event, refQiYuButton } = payload;
      exploreState.event_qiyu.push({ id: (exploreState.event_qiyu.length + 1), ...event });
      refQiYuButton.setNum(exploreState.event_qiyu.length);
    },

    // 挑战
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
        // 战斗中
        exploreState.challenging = true;

        // 播放战报
        const msgList = report.map(e => e.msg);
        refMsgList.addMsgs(msgList, 600, () => {
          refTimeBanner.resume();

          // 提前发放奖励-后续优化
          const reward = seqConfig.awards.items.find(e => e.uid.indexOf(enemy.uid) != -1);
          if (reward != undefined) {
            AppDispath({ type: 'ExploreModel/addReward', payload: reward });
          }

          // 战斗结束
          exploreState.challenging = false;
        });
      }
    },

    // 挑战BOSS
    *challengeBoss({ payload }, { select, put, call }) {
      const exploreState = yield select(state => state.ExploreModel);
      const eventData = exploreState.event_boss.find(e => e.id == payload.id);
      if (eventData != undefined) {
        exploreState.event_boss = exploreState.event_boss.filter(e => e.id != payload.id);
        exploreState.__data.pendingChallengeQueue.push(eventData);
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

      // 状态初始化
      exploreState.mapId = mapId;
      exploreState.areaId = 1;
      exploreState.rewards.length = 0;
      exploreState.event_xunbao.length = 0;
      exploreState.event_boss.length = 0;
      exploreState.event_xiansuo.length = 0;
      exploreState.event_qiyu.length = 0;
      exploreState.__data.pendingChallengeQueue.length = 0;
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
        return dispatch({ 'type':  'reload'});
      });
    },
  }
}
