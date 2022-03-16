
import {
  action,
  errorMessage
} from "../constants";

export default {
  namespace: 'PropsModel',

  state: {
    listData: [],
  },

  effects: {
    *reload({ payload }, { put, select }) {
      const propsState = yield select(state => state.PropsModel);

      const props = [
        { id: 1, name: '金创药', num: 10000, quality: 1, type: 0, tags: [], attrs: [], capacity: 1, desc: '回血100点' },
        { id: 2, name: '回魂草', num: 9988, desc: 'XXXXX' },
        { id: 3, name: '狼牙', num: 666, quality: 3 },
        { id: 4, name: '仙气', num: 100 },
        { id: 5, name: '一阶神石', num: 9, quality: 2 },
        { id: 6, name: '苹果', num: 999 },

        { id:20 , name: '西瓜', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '墨绿色 清香 沁甜爽口。' }, 
        { id:21 , name: '苹果', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '口感酸甜清香。' }, 
        { id:22 , name: '樱桃', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '甜中带酸,香气浓郁。' }, 
        { id:23 , name: '杏', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '明黄酸甜，汁甜肉脆。' }, 
        { id:24 , name: '橙子', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '一年好景君须记，最是橙黄橘绿时。' }, 
        { id:25 , name: '柚子', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '饱满晶莹、甘甜 爽口。' }, 
        { id:26 , name: '金桔', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '初感酸涩，微甜以及清香。' }, 
        { id:27 , name: '哈密瓜', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '香甜,醇香,瓜肉肥厚,清脆爽口。' }, 
        { id:28 , name: '香蕉', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '香咬一口娇娥笑,入胃品嚼果趣。' }, 
        { id:29 , name: '枣', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '庭前八月梨枣熟，一日能上树千回。' }, 
        { id:30 , name: '芒果', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '彩虹谷里闲行遍,芒果香甜满树梢。' }, 
        { id:31 , name: '菠萝', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '外壳如鳞，汁多味甜，有特殊香味。' }, 
        { id:32 , name: '杨梅', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '众口但便甜似蜜，宁知奇处是微酸。' }, 
        { id:33 , name: '柿子', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '柿叶翻红霜景秋，碧天如水倚红楼。' }, 
        { id:34 , name: '菠萝蜜', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '硕果何年海外传，香分龙脑落琼筵。中原不识此滋味，空看唐人异木篇。' }, 
        { id:35 , name: '石榴', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '燃灯疑夜火，辖珠胜早梅。' }, 
        { id:36 , name: '椰子', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '椰子味从今日近,鹧鸪声向旧山闻。' }, 
        { id:37 , name: '葡萄', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '露浓压架葡萄熟，日嫩登场罢亚香。' }, 
        { id:38 , name: '梨', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '北客有来初未识，南金无价喜新尝，含滋嚼句齿牙香。' }, 
        { id:39 , name: '枇杷', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '清晓呼僮乘露摘，任教半熟杂甘酸。' }, 
        { id:40 , name: '木瓜', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '良人为渍木瓜粉,遮却红腮交午痕。' }, 
        { id:41 , name: '柠檬', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '柠檬本酸涩，美香钻人心。' }, 
        { id:42 , name: '山楂', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '封君莫羡传柑宠，清爽何如山楂香。' }, 
        { id:43 , name: '树莓', num: 1, quality:1, type:0, tags: ['普通'], attrs: ['无'], capacity:100, desc: '雪模糊小树莓苔,月朦陇近水楼台。' }, 
      ];

      propsState.listData.length = 0;
      for (let key in props) {
        const item = props[key];
        propsState.listData.push(item);
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

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ 'type':  'reload'});
    },
  }
}
