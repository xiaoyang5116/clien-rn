
import {
  action,
  errorMessage
} from "../constants";

export default {
  namespace: 'StoryModel',

  state: {
    time: 0, // 时间信息
    position: '', // 位置信息
    sceneVars: [], // 当前场景变量
    sectionData: [], // [{title:'', data:[{...title:'', action:''}]}]
  },

  effects: {

    // 对话选项选中
    *click({ payload }, { put }) {
      yield put.resolve(action('SceneModel/processActions')(payload));
    },

    // 进度条结束
    *progressCompleted({ payload }, { put }) {
      yield put.resolve(action('SceneModel/processTimeoutActions')(payload));
    },
 
    // 选择对话框
    // 参数: { chatId: xxx }
    *selectChat({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      const chatId = payload.chatId;

      if (chatId == '' || payload.__sceneId == '') {
        errorMessage("ChatId or SceneId not specified!");
        return;
      }

      const scene = yield put.resolve(action('SceneModel/getScene')({ sceneId: payload.__sceneId }));
      const chat = yield put.resolve(action('SceneModel/getChat')({ sceneId: payload.__sceneId, chatId: chatId }));
      if (scene == null || chat == null) {
        errorMessage("Scene or Chat is null!, sceneId={0}, chatId={1}", payload.__sceneId, chatId);
        return;
      }
    
      // 生成新的对话数据
      const newSectionData = [];
      const sectionItem = { title: chat.desc, data: [] };
      for (let key in chat.options) {
        const item = chat.options[key];
        item.chatId = chat.id;
        if (yield put.resolve(action('SceneModel/testCondition')(item))) {
          sectionItem.data.push({ ...item });
        }
      }
      newSectionData.push(sectionItem);

      // 获取当前场景的世界时间
      const worldTime = yield put.resolve(action('SceneModel/getWorldTime')({ worldId: userState.worldId }));

      // 获取当前场景变量
      const sceneVars = yield put.resolve(action('SceneModel/getSceneVars')({ sceneId: payload.__sceneId }));
  
      // 重新渲染
      yield put(action('updateState')({ 
        time: worldTime,
        position: scene.name,
        sectionData: newSectionData, 
        sceneVars: sceneVars,
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

  subscriptions: {
    registerReloadEvent({ dispatch }) {
      // EventListeners.register('reload', (msg) => {
      //   dispatch({ 'type':  'reload'});
      // });
    },
  }
}
