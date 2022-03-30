
import { 
  action,
  errorMessage,
  getWindowSize,
  toastType,
} from "../constants";

import { GetArticleDataApi } from '../services/GetArticleDataApi';
import { GetArticleIndexDataApi } from '../services/GetArticleIndexDataApi';
import Toast from "../components/toast";
import lo from 'lodash';

const WIN_SIZE = getWindowSize();

const AddLoadedListHandler = (list, obj) => {
  if (lo.isEqual(obj.path, '[START]')) {
    list.length = 0;
  }
  list.push(obj);
}

const ParseFileDesc = (fileName) => {
  const splits = fileName.replace('.txt', '').split('_');
  const path = lo.join(lo.slice(splits, 1), '_');
  return { id: splits[0], path: path };
}

export default {
  namespace: 'ArticleModel',

  state: {
    __data: {
      // 记录已加载的文件
      loadedList: [],

      // 记录小说描述索引[{ id: '小说ID'， files: 数据 }]
      indexes: [],
    },

    // 展现用段落数据 [{ key: xxx, type: 'plain|code', content: xxx, object: xxx, height: xxx }, ...]
    sections: [],
    
    // 是否续章
    continueView: false,
  },

  effects: {

    *show({ payload }, { call, put, select }) {
      const userState = yield select(state => state.UserModel);
      const articleState = yield select(state => state.ArticleModel);
      let sceneId = userState.sceneId;

      const { id, path } = (payload.file != undefined) ? ParseFileDesc(payload.file) : payload;
      const data = yield call(GetArticleDataApi, id, path);
      if (data != null) AddLoadedListHandler(articleState.__data.loadedList, { id, path });

      // 首次加载索引文件
      if (articleState.__data.indexes.find(e => e.id == id) == undefined) {
        const indexData = yield call(GetArticleIndexDataApi, id);
        if (indexData != null) {
          articleState.__data.indexes.push({ id: id, files: indexData.files });
        }
      }

      // 按需加载小分支
      if (path.indexOf('_') != -1) {
        const indexData = articleState.__data.indexes.find(e => e.id == id);
        if (indexData != undefined) {
          const prefix = `${id}_${path}_`;
          const smallBranches = indexData.files.filter(e => e.indexOf(prefix) != -1);
          if (lo.isArray(smallBranches)) {
            for (let k in smallBranches) {
              const splits = smallBranches[k].split('_');
              const smallBranch = splits[3].replace('.txt', '');
              const subPath = `${splits[1]}_${splits[2]}_${smallBranch}`;

              // 加载并按条件合并小分支内容
              const subData = yield call(GetArticleDataApi, id, subPath);
              if (lo.isArray(subData) && subData.length > 0) {
                const firstItem = subData[0];
                if (!lo.isEqual(firstItem.type, 'code'))
                  continue; // 小分支第一行必须为指定条件
                const conds = lo.keys(firstItem.object);
                const inters = lo.intersection([...conds], ['andVarsOn', 'andVarsOff', 'andVarsValue']);
                if (inters.length != conds.length) {
                  errorMessage('Invalid article config: ' + conds);
                  continue; // 仅允许指定条件判断语句
                }

                // 只有满足条件的才会合并小分支
                const result = yield put.resolve(action('SceneModel/testCondition')({ ...firstItem.object }));
                if (!result) continue;

                data.push(...subData);
                AddLoadedListHandler(articleState.__data.loadedList, { id: id, path: subPath });
              }
            }
          }
        }
      }

      // 预处理
      for (let k in data) {
        const item = data[k];
        if (!lo.isEqual(item.type, 'code') || item.object == null)
          continue;

        if (item.object.enterScene != undefined) {
          // 切换文章所属场景
          yield put.resolve(action('SceneModel/enterScene')({ sceneId: item.object.enterScene }));
          sceneId = item.object.enterScene;
        } else if (item.object.chatId != undefined) {
          // 预生成选项数据
          const chat = yield put.resolve(action('SceneModel/getChat')({ sceneId: sceneId, chatId: item.object.chatId }));
          const optionsData = [];
          for (let k in chat.options) {
            const option = chat.options[k];
            if (yield put.resolve(action('SceneModel/testCondition')(option))) {
              optionsData.push(option);
            }
          }
          item.object.options = optionsData;
        }
      }
      
      if (payload.continue != undefined && payload.continue) {
        yield put(action('updateState')({ sections: [...articleState.sections, ...data], continueView: true }));
      } else {
        articleState.sections.length = 0;
        yield put(action('updateState')({ sections: data, continueView: false }));
      }
    },

    *layout({ payload }, { call, put, select }) {
      const articleState = yield select(state => state.ArticleModel);
      const { key, width, height } = payload;

      const item = articleState.sections.find(e => e.key == key);
      if (item != undefined) {
        item.height = height;
      }
    },

    *scroll({ payload }, { call, put, select }) {
      const articleState = yield select(state => state.ArticleModel);
      const { offsetX, offsetY } = payload;

      for (let k in articleState.sections) {
        const item = articleState.sections[k];
        if (item.type != 'code' || item.object == undefined || item.object == null)
          continue;

        // 优化性能
        if (item.object.completed != undefined && item.object.completed)
          continue;

        // 触发按区域激活提示
        const { toast } = item.object;
        if (toast != undefined) {
          // 计算总偏移量
          const prevSections = articleState.sections.filter(e => e.key <= item.key);
          let totalOffsetY = 0;
          prevSections.forEach(e => totalOffsetY += e.height);
          const validY = offsetY + WIN_SIZE.height / 2 - 60 + 100; // 60: iOS顶部空间, 100: 透明框一半
          if (validY > totalOffsetY && (validY - 200) < totalOffsetY) {
            // 在事件触发区域
            if (item.object.completed == undefined || !item.object.completed) {
              Toast.show(toast, toastType(item.object.type));
              item.object.completed = true;
            }
          }
        }
      }
    },

    *end({ payload }, { call, put, select }) {
      const articleState = yield select(state => state.ArticleModel);

      // 当前分支的情况下自动续章
      const last = lo.last(articleState.__data.loadedList);
      const indexData = articleState.__data.indexes.find(e => e.id == last.id);

      const splits = last.path.split('_');
      if (splits.length > 1) {
        // 寻找下一个分支
        const currentIndex = lo.indexOf(indexData.files, `${last.id}_${last.path}.txt`);
        if (indexData.files.length > (currentIndex + 1)) {
          const next = indexData.files[currentIndex + 1];
          if (next.indexOf(`${last.id}_${splits[0]}_N`) != -1) {
            yield put.resolve(action('show')({ file: next, continue: true }));
          }
        }
      }
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
    setup({ dispatch }) {
    },
  }
}
