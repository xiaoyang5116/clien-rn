
import {
  action
} from "../constants";

export default {
  namespace: 'StoryModel',

  state: {
    position: '', // 位置信息
    sectionData: [], // [{title:'', data:[{...title:'', action:''}]}]
  },

  effects: {

    *click({ payload }, { call, put }) {
      if (payload.click_event == undefined)
        return;
      
      let validActions = [];
      if (payload.click_event.groups != undefined) {
        let groups = payload.click_event.groups;
        if (groups != undefined) {
          for (let key in groups) {
            let item = groups[key];
            if (item.cond == undefined)
              continue;
            
            let result = yield put.resolve(action('SceneModel/testCondition')({ cond: item.cond }));
            if (result != true)
              continue;
            item.actions.forEach((e) => {
              validActions.push(e);
            });
          }
        }
      } else {
        payload.click_event.actions.forEach((e) => {
          validActions.push(e);
        });
      }

      for (let key in validActions) {
        let item = validActions[key];
        yield put.resolve(action('SceneModel/action')(item));
      }
    },

    // 参数: { path: xxx }
    *selectChat({ payload }, { call, put, select }) {
      const state = yield select((state) => state.StoryModel);
      const stateScene = yield select((state) => state.SceneModel);

      let path = payload.path;
      let pathArrays = path.split('/');
      if (pathArrays.length <= 0)
        return;
  
      let sceneId = stateScene.data.sceneId;
      let chatId = '';
      if (pathArrays[0] != '.') {   // 相对路径 ./chatId 或者绝对路径 /sceneId/chatId
        sceneId = pathArrays[1];
        chatId = pathArrays[2];
      } else {
        chatId = pathArrays[1];
      }

      if (sceneId == '' || chatId == '')
        return;

      let scene = yield put.resolve(action('SceneModel/getScene')({ sceneId: sceneId }));
      if (scene == null || scene.nodes.indexOf(chatId) == -1)
        return;

      let chat = yield put.resolve(action('SceneModel/getChat')({ chatId: chatId }));
      if (chat == null)
        return;
    
      // 生成新的对话数据
      let newSectionData = [];
      let sectionItem = { title: chat.desc, data: [] };
      chat.items.forEach((item) => {
        sectionItem.data.push({ ...item });
      });
      newSectionData.push(sectionItem);

      // 设置新场景ID
      if (stateScene.data.sceneId != sceneId) {
        yield put(action('SceneModel/setSceneId')({ sceneId: sceneId }));
      }
  
      // 重新渲染
      yield put(action('updateState')({ 
        sectionData: newSectionData, 
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
  },
}
