
import lo from 'lodash';

import EventListeners from "../utils/EventListeners";
import Skill from './skill/Skill';
import Buff from './skill/Buff';

import { GetSkillDataApi,GetSkillConfigDataApi } from '../services/GetSkillDataApi';
import { GetBuffDataApi } from '../services/GetBuffDataApi';

export default {
  namespace: 'SkillModel',

  state: {
    __data: {
      skillsConfig: [], // 技能配置列表
      buffsConfig: []   // BUFF配置列表
    },

    // 技能实例
    skills: [],

    // BUFF实例
    buffs: [],
  },

  effects: {

    *reload({ }, { call, put, select }) {
      const skillState = yield select(state => state.SkillModel);
      const buffsConfig = yield call(GetBuffDataApi);
      const { skill_list } = yield call(GetSkillConfigDataApi)
      let skillsConfig = {
        skills: []
      }
      for (let key in skill_list) {
        const { skills } = yield call(GetSkillDataApi, skill_list[key]);
        skillsConfig.skills.push(...skills)
      }

      if (skillsConfig != null) {
        skillState.__data.skillsConfig.length = 0;
        lo.forEach(skillsConfig.skills, (v, k) => {
          skillState.skills.push(new Skill(v));
        });
      }

      if (buffsConfig != null) {
        skillState.__data.buffsConfig.length = 0;
        lo.forEach(buffsConfig.buffs, (v, k) => {
          skillState.buffs.push(new Buff(v));
        });
      }
    },

    *getSkill({ payload }, { call, put, select }) {
      const skillState = yield select(state => state.SkillModel);
      const { skillId } = payload;
      return lo.find(skillState.skills, (e) => e.getId() == skillId);
    },

    *getBuff({ payload }, { call, put, select }) {
      const skillState = yield select(state => state.SkillModel);
      const { buffId } = payload;
      return lo.find(skillState.buffs, (e) => e.getId() == buffId);
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
