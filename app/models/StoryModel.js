
import {
  action
} from "../constants";

import {
  GetStoryDataApi
} from "../services/GetStoryDataApi";

import * as RootNavigation from '../utils/RootNavigation';

export default {
  namespace: 'StoryModel',

  state: {
    stroysConfig: [], // Yaml配置.
    sectionData: [], // [{title:'', data:[{...title:'', action:''}]}]
    sceneId: 0,   // 当前场景ID
    position: '', // 位置信息
  },

  effects: {
    *click({ payload }, { call, put }) {
      yield put(action('action')(payload));
    },

    *action({ payload }, { call, put }) {
      switch (payload.cmd) {
        case 'scene': // 切换剧情场景
          let path = payload.params;
          yield put(action('selectChat')({ path: path }));
          break;

        case 'dialog': // 普通对话框
          if (payload.title != undefined && payload.content != undefined) {
            yield put(action('DialogModel/show')({ 
              typeConfirm: 'StoryModel/action', 
              params: payload.action, 
              ...payload 
            }));
          }
          break;

        case 'aside': // 旁白
          yield put(action('AsideModel/show')({ ...payload }));
          break;

        case 'navigate': // 切换导航栏
          RootNavigation.navigate(payload.params)
          break;
      }
    },

    *reload({ payload }, { call, put, select }) {
      let data = yield call(GetStoryDataApi, payload);
      yield put(action('updateConfig')(data));
      yield put(action('selectChat')({ path: '/1/1' }));
    },

    *selectChat({ payload }, { call, put, select }) {
      const state = yield select((state) => state.StoryModel);
      const stroysConfig = state.stroysConfig;

      let path = payload.path;
      let pathArrays = path.split('/');
      if (pathArrays.length <= 0)
        return;
  
      let sceneId = state.sceneId;
      let chatId = 0;
      if (pathArrays[0] != '.') {   // 相对路径 ./chatId 或者绝对路径 /sceneId/chatId
        sceneId = parseInt(pathArrays[1]);
        chatId = parseInt(pathArrays[2]);
      } else {
        chatId = parseInt(pathArrays[1]);
      }

      if (sceneId <= 0 || chatId <= 0)
        return;
  
      let scene = null;
      for (let key in stroysConfig.main.scenes) {
        let item = stroysConfig.main.scenes[key];
        if (item.id == sceneId) {
          scene = item;
          break;
        }
      }
  
      if ((scene == null) || (scene.nodes.indexOf(chatId) == -1))
        return;
  
      // 生成新的对话数据
      let newSectionData = [];
      for (let key in stroysConfig.main.chats) {
        let chat = stroysConfig.main.chats[key];
        if (chat.id == chatId) {
          let sectionItem = { title: chat.desc, data: [] };
          chat.items.forEach((item) => {
            sectionItem.data.push({ title: item.title, action: {parent: item, ...item.action}});
          });
          newSectionData.push(sectionItem);
          break;
        }
      }
  
      if (newSectionData.length <= 0 || sceneId <= 0)
        return;
  
      // 重新渲染
      yield put(action('updateState')({ 
        sectionData: newSectionData, 
        sceneId: sceneId, 
        position: scene.name 
      }));
    }
  },
  
  reducers: {
    updateState(state, { payload }) {
      return { 
        ...state,
        ...payload
      };
    },
    updateConfig(state, { payload }) {
      return { 
        ...state,
        stroysConfig: payload
      };
    }
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ 'type':  'reload'});
    }
  }
}
