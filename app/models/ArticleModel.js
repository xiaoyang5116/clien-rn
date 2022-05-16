
import {
  action,
  errorMessage,
  getWindowSize,
  toastType,
  LocalCacheKeys
} from "../constants";

import { GetAttrsDataApi } from '../services/GetAttrsDataApi';
import { GetArticleDataApi } from '../services/GetArticleDataApi';
import { GetArticleIndexDataApi } from '../services/GetArticleIndexDataApi';
import Toast from "../components/toast";
import Modal from "../components/modal";
import lo from 'lodash';
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import defaultReaderStyle from '../themes/readerStyle';

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

const HasStopDirective = (data) => {
  if (lo.isArray(data)) {
    return (data.find(e => (lo.isEqual(e.type, 'code') && lo.isObject(e.object) && lo.isBoolean(e.object.stop) && e.object.stop)) != undefined);
  }
  return false;
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

    attrsConfig: null,

    // 展现用段落数据 [{ key: xxx, type: 'plain|code', content: xxx, object: xxx, height: xxx }, ...]
    sections: [],

    // 是否续章
    continueView: false,

    // 阅读器样式
    readerStyle: {},
  },

  effects: {

    *show({ payload }, { call, put, select }) {
      const articleState = yield select(state => state.ArticleModel);

      // 加载玩家属性配置
      const attrs = yield call(GetAttrsDataApi);
      articleState.attrsConfig = attrs.data.attrs;

      const { id, path } = (payload.file != undefined) ? ParseFileDesc(payload.file) : payload;
      const data = yield call(GetArticleDataApi, id, path);
      if (data != null) AddLoadedListHandler(articleState.__data.loadedList, { id, path, stop: HasStopDirective(data) });

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
          const expr = new RegExp(`^${id}_${path}_\\[[^\\[\\]]+\\]\\.txt$`);
          const smallBranches = indexData.files.filter(e => e.match(expr) != null);
          if (lo.isArray(smallBranches)) {
            for (let k in smallBranches) {
              const kv = ParseFileDesc(smallBranches[k]);

              // 按条件加载小分支
              const subData = yield call(GetArticleDataApi, kv.id, kv.path);
              if (lo.isArray(subData) && subData.length > 0) {
                const condItem = lo.head(subData);
                if (!lo.isEqual(condItem.type, 'code'))
                  continue;

                // 小分支根据变量判断
                const conds = lo.keys(condItem.object);
                const inters = lo.intersection([...conds], ['andVarsOn', 'andVarsOff', 'andVarsValue']);
                if (inters.length != conds.length) {
                  errorMessage('Invalid article config: ' + conds);
                  continue;
                }

                lo.keys(condItem.object).forEach(x => {
                  condItem.object[x].forEach(y => {
                    if (y.indexOf('/') == -1)
                      errorMessage("变量请指定场景ID前缀格式: 场景ID/变量ID");
                  })
                });

                const result = yield put.resolve(action('SceneModel/testCondition')({ ...condItem.object }));
                if (!result) continue;

                // 合并数据
                data.push(...subData);
                AddLoadedListHandler(articleState.__data.loadedList, { ...kv, stop: HasStopDirective(subData) });
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

        if (item.object.chatId != undefined) {
          // 预生成选项数据
          const chat = yield put.resolve(action('SceneModel/getChat')({ sceneId: item.object.sceneId, chatId: item.object.chatId }));
          console.debug('@@@@@@@@@@@@@@@@@', chat, item.object)
          item.object.options = yield put.resolve(action('getValidOptions')({ options: chat.options }));
        }
      }

      if (payload.continue != undefined && payload.continue) {
        yield put(action('updateState')({ sections: [...articleState.sections, ...data], continueView: true }));
      } else {
        articleState.sections.length = 0;
        yield put(action('updateState')({ sections: data, continueView: false }));
      }
    },

    *getValidOptions({ payload }, { call, put, select }) {
      const optionsData = [];
      for (let k in payload.options) {
        const option = payload.options[k];
        const match = yield put.resolve(action('SceneModel/testCondition')(option));
        if (lo.isBoolean(option.alwayDisplay) && option.alwayDisplay) {
          option.disabled = !match;
          optionsData.push(option);
        } else if (match) {
          option.disabled = false;
          optionsData.push(option);
        }
        // 角标处理
        if (lo.isObject(option.icon)) {
          const { bindVar } = option.icon;
          if (bindVar != undefined) {
            const checkVar = { andVarsOn: [bindVar], __sceneId: option.__sceneId };
            const match = yield put.resolve(action('SceneModel/testCondition')(checkVar));
            option.icon = { ...option.icon, show: match };
          }
        }
      }
      return optionsData;
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
        const { toast, pop } = item.object;
        if (toast == undefined && pop == undefined)
          continue;

        // 计算总偏移量
        const prevSections = articleState.sections.filter(e => e.key <= item.key);
        let totalOffsetY = 0;
        prevSections.forEach(e => totalOffsetY += e.height);
        const validY = offsetY + WIN_SIZE.height / 2 - 40 + 100; // 40: iOS顶部空间, 100: 透明框一半
        if (validY > totalOffsetY && (validY - 200) < totalOffsetY) {
          // 在事件触发区域
          if (toast != undefined) {
            Toast.show(toast, toastType(item.object.type));
          }
          if (pop != undefined) {
            Modal.show(pop);
          }
          item.object.completed = true;
        }
      }
    },

    *end({ payload }, { call, put, select }) {
      const articleState = yield select(state => state.ArticleModel);

      // 当前分支的情况下自动续章
      const lastLoaded = lo.last(articleState.__data.loadedList);
      const indexData = articleState.__data.indexes.find(e => e.id == lastLoaded.id);

      // 出现stop指令时停止自动续章
      if (lastLoaded.stop) return;

      const splits = lastLoaded.path.split('_');
      if (splits.length >= 2) {
        const skipSize = (lo.last(splits).match(/^\[[^\[\]]+\]$/) != null) ? 2 : 1;
        const srcArray = lo.slice(splits, 0, splits.length - skipSize);

        // 寻找下一个分支
        const currentIndex = lo.indexOf(indexData.files, `${lastLoaded.id}_${lastLoaded.path}.txt`);
        if (indexData.files.length > (currentIndex + 1)) {
          for (let i = currentIndex + 1; i < indexData.files.length; i++) {
            const next = indexData.files[i];
            if (next.match(/\[[^\[\]]+\]/) != null)
              continue; // 小章节不能续章

            const splits2 = next.split('_');
            if (splits2.length >= 3) {
              const targetArray = lo.slice(splits2, 0, splits2.length - 1);
              if (lo.isEqual(lo.join([lastLoaded.id, ...srcArray], '_'), lo.join(targetArray, '_'))) {
                yield put.resolve(action('show')({ file: next, continue: true }));
                break;
              }
            }
          }
        }
      }
    },

    // 阅读器样式
    *readerStyle({ payload }, { call, put, select }) {
      let currentReaderStyle = yield call(LocalStorage.get, LocalCacheKeys.READER_STYLE);
      if (currentReaderStyle === null) {
        currentReaderStyle = defaultReaderStyle
        yield call(LocalStorage.set, LocalCacheKeys.READER_STYLE, currentReaderStyle);
        yield put(action('updateState')({ readerStyle: currentReaderStyle }));
      }
      else {
        yield put(action('updateState')({ readerStyle: currentReaderStyle }));
      }
    },
    // 修改字体大小
    *changeFontSize({ payload }, { call, put, select }) {
      const { readerStyle } = yield select(state => state.ArticleModel);
      let newReaderStyle = {}
      if (payload.type === 'reduce') {
        newReaderStyle = {
          ...readerStyle,
          contentSize: (readerStyle.contentSize - 1) > 10 ? (readerStyle.contentSize - 1) : 10,
          titleSize: readerStyle.titleSize - 1,
        }
      }
      if (payload.type === 'increase') {
        newReaderStyle = {
          ...readerStyle,
          contentSize: (readerStyle.contentSize + 1) > 40 ? 40 : (readerStyle.contentSize + 1),
          titleSize: readerStyle.titleSize + 1,
        }
      }
      yield call(LocalStorage.set, LocalCacheKeys.READER_STYLE, newReaderStyle);
      yield put(action('updateState')({ readerStyle: newReaderStyle }));
    },
    // 修改配色
    *changeMatchColor({ payload }, { call, put, select }) {
      const { readerStyle } = yield select(state => state.ArticleModel);
      const NewReaderStyle = {
        ...readerStyle,
        color: payload.color,
        bgColor: payload.bgColor,
      }
      yield call(LocalStorage.set, LocalCacheKeys.READER_STYLE, NewReaderStyle);
      yield put(action('updateState')({ readerStyle: NewReaderStyle }));
    },
    // 修改排版
    *changeTypesetting({ payload }, { call, put, select }) {
      const { readerStyle } = yield select(state => state.ArticleModel);
      let NewReaderStyle = {}

      if (payload.type === undefined) {
        NewReaderStyle = {
          ...readerStyle,
          selectedTypesetting: payload.selectedTypesetting,
          lineHeight: payload.Typesetting.lineHeight,
          paragraphSpacing: payload.Typesetting.paragraphSpacing,
        }
      }
      else if (payload.type === "paragraphSpacing") {
        NewReaderStyle = {
          ...readerStyle,
          paragraphSpacing: payload.value,
        }
      }
      else if (payload.type === "lineHeight") {
        NewReaderStyle = {
          ...readerStyle,
          lineHeight: payload.value,
        }
      }
      else if (payload.type === "leftPadding") {
        NewReaderStyle = {
          ...readerStyle,
          leftPadding: payload.value,
        }
      }
      else if (payload.type === "rightPadding") {
        NewReaderStyle = {
          ...readerStyle,
          rightPadding: payload.value,
        }
      }

      yield call(LocalStorage.set, LocalCacheKeys.READER_STYLE, NewReaderStyle);
      yield put(action('updateState')({ readerStyle: NewReaderStyle }));
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
        return dispatch({ 'type': 'readerStyle' });
      });
    },
  }
}
