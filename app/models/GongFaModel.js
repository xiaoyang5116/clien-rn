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
    gongFaConfig: [],  // 功法配置数据
    gongFaProgressData: [],  // 功法进度数据
    allSkills: [],  // 获得的 所有的技能
  },

  effects: {
    *reload({ }, { select, call, put }) {
      const { data } = yield call(GetGongFaDataApi);
      const gongFaStorageData = yield call(
        LocalStorage.get,
        LocalCacheKeys.GONG_FA_DATA,
      );

      if (gongFaStorageData === null) {
        // 初始化 功法进度数据
        const { gonFaData } = data;
        const initGongFaProgressData = gonFaData.map(item => ({
          gongFaId: item.gongFaId,
          gongFaLayer: 0,
          gongFaGrade: 0,
          gongFaStatus: 0,
        }));
        const init = {
          gongFaProgressData: initGongFaProgressData,
          allSkills: [],
        }
        yield call(
          LocalStorage.set,
          LocalCacheKeys.GONG_FA_DATA,
          init,
        );
        yield put(
          action('updateState')({
            gongFaConfig: data,
            gongFaProgressData: initGongFaProgressData,
            allSkills: [],
          }),
        );
      } else {
        // 加载 本地功法进度数据
        yield put(
          action('updateState')({
            gongFaConfig: data,
            gongFaProgressData: gongFaStorageData.gongFaProgressData,
            allSkills: gongFaStorageData.allSkills
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
            item => item.gongFaId === gongFaId,
          );
          gongFaLevel.gongFaConfig.push({ ...gongFaConfig });
        }
      }
      return gongFaLevelData;
    },

    // 打开功法
    *openGongFa({ payload }, { select, call, put }) {
      const { gongFaId } = payload;
      const { gongFaConfig, gongFaProgressData } = yield select(
        state => state.GongFaModel,
      );
      const currentGongFa = gongFaConfig.gonFaData.find(
        item => item.gongFaId === gongFaId,
      );
      const currentGongFaProgress = gongFaProgressData.find(
        item => item.gongFaId === gongFaId,
      );
      if (currentGongFaProgress.gongFaStatus === 0) {
        const message = [];
        if (currentGongFa.conditions.needProps !== undefined) {
          const { needProps } = currentGongFa.conditions;
          for (let index = 0; index < needProps.length; index++) {
            const prop = needProps[index].split(',');
            const propNum = yield put.resolve(
              action('PropsModel/getPropNum')({ propId: Number(prop[0]) }),
            );
            const propConfig = yield put.resolve(
              action('PropsModel/getPropConfig')({ propId: Number(prop[0]) }),
            );
            const isOK = propNum >= Number(prop[1]);
            message.push({
              isOK: isOK,
              msg: `拥有${propConfig.name}数量: ${propNum}/${Number(prop[1])}`,
            });
          }
        }
        return message;
      }
    },

    // 修炼功法
    *xiuLianGongFa({ payload }, { select, call, put }) {
      const { gongFaId } = payload;
      const { gongFaConfig, gongFaProgressData, allSkills } = yield select(
        state => state.GongFaModel,
      );
      const currentGongFa = gongFaConfig.gonFaData.find(
        item => item.gongFaId === gongFaId,
      );
      let currentGongFaProgress = gongFaProgressData.find(
        item => item.gongFaId === gongFaId,
      );
      const { gongFaLayer, gongFaGrade, gongFaStatus } = currentGongFaProgress;

      // 如果没修炼过
      if (gongFaStatus === 0 && gongFaGrade == 0) {
        currentGongFaProgress.gongFaStatus = 1;
      }
      // 升级
      if (gongFaGrade + 1 < currentGongFa.layerConfig[gongFaLayer].length) {
        currentGongFaProgress.gongFaGrade = gongFaGrade + 1;
      } else {
        if (gongFaLayer + 1 <= currentGongFa.layerConfig.length - 1) {
          currentGongFaProgress.gongFaLayer = gongFaLayer + 1;
          currentGongFaProgress.gongFaGrade = 0;
        } else {
          currentGongFaProgress.gongFaStatus = 2;
        }
      }

      // 下一级的配置数据
      const { needProps, award } = currentGongFa.layerConfig[gongFaLayer].find(
        item => item.grade === gongFaGrade + 1,
      );
      // 扣除道具
      for (let k in needProps) {
        const prop = needProps[k].split(',');
        yield put.resolve(
          action('PropsModel/use')({
            propId: prop[0],
            num: prop[1],
            quiet: true,
          }),
        );
      }

      // 获得奖励
      if (award.props !== undefined) {
      }
      if (award.skillId !== undefined) {
        const skill = gongFaConfig.skillConfig.find(item => item.id === award.skillId)
        if (allSkills.find(item => item.id === skill.id) === undefined) {
          allSkills.push({ ...skill, isChecked: false })
        }
      }

      // 保存记录
      const newGongFaProgressData = gongFaProgressData.map(item =>
        item.gongFaId === gongFaId ? currentGongFaProgress : item,
      );
      yield call(
        LocalStorage.set,
        LocalCacheKeys.GONG_FA_DATA,
        {
          gongFaProgressData: newGongFaProgressData,
          allSkills
        },
      );
      yield put(
        action('updateState')({
          gongFaProgressData: newGongFaProgressData,
          allSkills,
        }),
      );

      return currentGongFaProgress;
    },

    // 获取修炼需要的道具
    *getXiuLianNeedProps({ payload }, { select, call, put }) {
      const { needProps } = payload;
      let upgradeProps = [];
      for (let index = 0; index < needProps.length; index++) {
        const prop = needProps[index].split(',');
        // 道具信息
        const propData = yield put.resolve(
          action('PropsModel/getBagProp')({ propId: prop[0], always: true }),
        );
        upgradeProps.push({
          propId: propData.id,
          iconId: propData.iconId,
          quality: propData.quality,
          num: propData.num,
          needNum: prop[1],
          isOk: Number(propData.num) >= Number(prop[1]) ? true : false,
        });
      }

      return upgradeProps;
    },

    // 选择技能
    *checkedGongFaSkill({ payload }, { select, call, put }) {
      const { id, checked } = payload
      const { gongFaProgressData, allSkills } = yield select(state => state.GongFaModel);

      const newAllSkills = allSkills.map(item => item.id == id ? { ...item, isChecked: checked } : item)
      yield call(
        LocalStorage.set,
        LocalCacheKeys.GONG_FA_DATA,
        {
          gongFaProgressData,
          allSkills: newAllSkills
        },
      );
      yield put(
        action('updateState')({
          allSkills: newAllSkills,
        }),
      );
    },

    // 携带的技能
    *getSkillsToCarry({ payload }, { select, call, put }) {
      const { allSkills } = yield call(LocalStorage.get, LocalCacheKeys.GONG_FA_DATA);
      const selectedSkills = allSkills.filter(item => item.isChecked == true)
      return selectedSkills
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
