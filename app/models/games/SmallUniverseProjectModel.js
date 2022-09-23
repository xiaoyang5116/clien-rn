import LocalStorage from '../../utils/LocalStorage';
import { action, LocalCacheKeys } from '../../constants';
import EventListeners from '../../utils/EventListeners';
// import { now } from '../utils/DateTimeUtils';
import { GetSmallUniverseProjectDataApi } from '../../services/GetSmallUniverseProjectDataApi';
// import lo from 'lodash';

export default {
  namespace: 'SmallUniverseProjectModel',
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
        const mainAttrs = data.mainAttrs.map(item => ({
          name: item.name,
          desc: item.desc,
          iconId: item.iconId,
          quality: item.quality,
          ...item.levelConfig[0]
        }))
        // 副属性
        let allSubAttrs = []
        for (let index = 0; index < data.allSubAttrs.length; index++) {
          const item = data.allSubAttrs[index];
          const key = item.key
          let value = 0
          for (let mainAttrsIndex = 0; mainAttrsIndex < mainAttrs.length; mainAttrsIndex++) {
            const subAttrs = mainAttrs[mainAttrsIndex].subAttrs;
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

    // 获取主属性信息
    *getMainAttrInfo({ payload }, { call, put, select }) {
      const { smallUniverseProject_configData } = yield select(state => state.SmallUniverseProjectModel);
      // 对应主属性的配置数据
      const mainAttrConfig = smallUniverseProject_configData.mainAttrs.find(item => item.name === payload.name)

      // 背包中 升级道具的数量及配置
      let upgradeProps = []
      for (let index = 0; index < mainAttrConfig.props.length; index++) {
        const item = mainAttrConfig.props[index];
        // 道具信息
        const propData = yield put.resolve(
          action('PropsModel/getBagProp')({ propId: item.propId, always: true }),
        );
        upgradeProps.push(Object.assign(item, propData))
      }

      // 0-可以升级, 1-已经达到最高等级, 2-道具不足
      let status = 0
      // 判读 升级需要的道具 数量是否 足够
      let isNeedPropsEnough = payload.needProps.every(item => {
        if (upgradeProps.find(f => f.key === item.split(',')[0]).num >= parseInt(item.split(',')[1])) {
          return true
        } else {
          return false
        }
      })


      // 下一级的信息 { grade, subAttrs, needProps }
      const nextLevelConfig = mainAttrConfig.levelConfig.find(item => item.grade === payload.grade + 1)

      if (nextLevelConfig === undefined) {
        status = 1
        return {
          upgradeProps,
          status,
        }
      }
      if (nextLevelConfig !== undefined && !isNeedPropsEnough) {
        status = 2
        return {
          upgradeProps,
          nextGrade: nextLevelConfig.grade,
          nextSubAttrs: nextLevelConfig.subAttrs,
          status,
        }
      }

      return {
        upgradeProps,
        nextGrade: nextLevelConfig.grade,
        nextSubAttrs: nextLevelConfig.subAttrs,
        status,
      }
    },

    // 升级属性
    *UpgradeAttr({ payload }, { call, put, select }) {
      const { mainAttr, upgradeProps } = payload
      const { smallUniverseProject_data, smallUniverseProject_configData } = yield select(state => state.SmallUniverseProjectModel);

      // 使用道具
      for (let index = 0; index < mainAttr.needProps.length; index++) {
        const item = mainAttr.needProps[index];
        const key = item.split(',')[0]
        const num = item.split(',')[1]
        const prop = upgradeProps.find(prop => prop.key === key)
        yield put.resolve(
          action('PropsModel/use')({ propId: prop.id, num, quiet: true }),
        );
      }


      // 主属性
      const mainAttrs = smallUniverseProject_data.mainAttrs.map(item => {
        if (item.name === mainAttr.name) {
          const configData = smallUniverseProject_configData.mainAttrs.find(f => f.name === item.name)
          const levelConfig = configData.levelConfig.find(l => l.grade === (mainAttr.grade + 1))
          return { ...item, grade: levelConfig.grade, subAttrs: levelConfig.subAttrs }
        }
        else {
          return item
        }
      })

      // 副属性
      let allSubAttrs = []
      for (let index = 0; index < smallUniverseProject_configData.allSubAttrs.length; index++) {
        const item = smallUniverseProject_configData.allSubAttrs[index];
        const key = item.key
        let value = 0
        for (let mainAttrsIndex = 0; mainAttrsIndex < mainAttrs.length; mainAttrsIndex++) {
          const subAttrs = mainAttrs[mainAttrsIndex].subAttrs;
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

      let gradeCount = 0
      for (let index = 0; index < mainAttrs.length; index++) {
        const { grade } = mainAttrs[index];
        gradeCount += grade
      }
      // 等级进度
      const levelProgress = parseInt((gradeCount / smallUniverseProject_configData.overallGrade) * 100)

      const newSmallUniverseProject_data = {
        mainAttrs,
        allSubAttrs,
        levelProgress
      }

      yield call(LocalStorage.set, LocalCacheKeys.SMALL_UNIVERSE_PROJECT_DATA, newSmallUniverseProject_data);
      yield put(action('updateState')({ smallUniverseProject_data: newSmallUniverseProject_data }))

      const currentMainAttr = mainAttrs.find(item => item.name === mainAttr.name)
      const mainAttrInfo = yield put.resolve(action('getMainAttrInfo')(currentMainAttr))

      return {
        mainAttr: currentMainAttr,
        ...mainAttrInfo
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