
import {
  action,
  errorMessage
} from "../constants";

export default {
  namespace: 'StoryModel',

  state: {
    time: 0, // 时间信息
    position: '', // 位置信息
    sectionData: [], // [{title:'', data:[{...title:'', action:''}]}]
  },

  effects: {

    // 对话选项选中
    *click({ payload }, { put }) {
      yield put.resolve(action('SceneModel/processActions')({ actions: payload.click_actions, varsOn: payload.varsOn }));
    },
 
    // 选择对话框
    // 参数: { chatId: xxx }
    *selectChat({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      const chatId = payload.chatId;
      const sceneId = userState.sceneId;

      if (chatId == '' || sceneId == '') {
        errorMessage("ChatId or SceneId not specified!");
        return;
      }

      const scene = yield put.resolve(action('SceneModel/getScene')({ sceneId: sceneId }));
      const chat = yield put.resolve(action('SceneModel/getChat')({ sceneId: sceneId, chatId: chatId }));
      if (scene == null || chat == null) {
        errorMessage("Scene or Chat is null!");
        return;
      }
    
      // 生成新的对话数据
      const newSectionData = [];
      const sectionItem = { title: chat.desc, data: [] };
      for (let key in chat.options) {
        const item = chat.options[key];
        if (yield put.resolve(action('SceneModel/testCondition')(item))) {
          sectionItem.data.push({ ...item });
        }
      }
      newSectionData.push(sectionItem);

      // 获取当前场景的世界时间
      const worldTime = yield put.resolve(action('SceneModel/getWorldTime')({ worldId: userState.worldId }));
  
      // 重新渲染
      yield put(action('updateState')({ 
        time: worldTime,
        position: scene.name,
        sectionData: newSectionData, 
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
