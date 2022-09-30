
import {
  action,
  errorMessage,
  getWindowSize,
  toastType,
  LocalCacheKeys,
  DeviceEventEmitter,
  EventKeys,
  AppDispath,
  statusBarHeight
} from "../constants";

import { GetAttrsDataApi } from '../services/GetAttrsDataApi';
import { GetArticleDataApi } from '../services/GetArticleDataApi';
import { GetArticleIndexDataApi } from '../services/GetArticleIndexDataApi';
import { GetBookDirDataApi } from '../services/GetBookDirDataApi';
import { GetArticleWorldDataApi } from '../services/GetArticleWorldDataApi';
import Toast from "../components/toast";
import Modal from "../components/modal";
import lo from 'lodash';
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import defaultReaderStyle from '../themes/readerStyle';
import Games from "../components/games";
import { playSound } from "../components/sound/utils";
import EffectAnimations from "../components/effects";
import { ARTICLE_EVENT_AREA_MARGIN, ARTICLE_FLATLIST_MARGIN_TOP } from "../constants/custom-ui";

const WIN_SIZE = getWindowSize();
const DETECTION_AREA_HEIGHT = 200;

const AREA_TOP = 1;
const AREA_MIDDLE = 2;
const AREA_BOTTOM = 3;

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

const checkTop = (offsetY, totalOffsetY) => {
  const flatList2Top = statusBarHeight + ARTICLE_FLATLIST_MARGIN_TOP;
  const validY = offsetY + WIN_SIZE.height / 2 - flatList2Top - (DETECTION_AREA_HEIGHT / 2) - ARTICLE_EVENT_AREA_MARGIN;
  return (validY > totalOffsetY && (validY - DETECTION_AREA_HEIGHT) < totalOffsetY);
}

const checkMiddle = (offsetY, totalOffsetY) => {
  const flatList2Top = statusBarHeight + ARTICLE_FLATLIST_MARGIN_TOP;
  const validY = offsetY + WIN_SIZE.height / 2 - flatList2Top + (DETECTION_AREA_HEIGHT / 2);
  return (validY > totalOffsetY && (validY - DETECTION_AREA_HEIGHT) < totalOffsetY);
}

const checkBottom = (offsetY, totalOffsetY) => {
  const flatList2Top = statusBarHeight + ARTICLE_FLATLIST_MARGIN_TOP;
  const validY3 = offsetY + WIN_SIZE.height / 2 - flatList2Top + (DETECTION_AREA_HEIGHT * 1.5) + ARTICLE_EVENT_AREA_MARGIN;
  return (validY3 > totalOffsetY && (validY3 - DETECTION_AREA_HEIGHT) < totalOffsetY);
}

const enterEffectArea = (state, item, areaId, startOffsetY) => {
  if (state.__data.startOffsetY <= 0 || state.__data.eventTargetAreaId != areaId) {
    state.__data.startOffsetY = startOffsetY;
    state.__data.eventTargetAreaId = areaId;
    state.__data.eventTargetKey = item.key;
    state.__data.eventTargetEffectId = item.object.effect.id;
  }
}

export default {
  namespace: 'ArticleModel',

  state: {
    __data: {
      // 记录已加载的文件
      loadedList: [],

      // 记录小说描述索引[{ id: '小说ID'， files: 数据 }]
      indexes: [],

      // 区域检测开始位置
      startOffsetY: 0,
      // 区域检测对象KEY
      eventTargetKey: '',
      // 区域检测目标区域
      eventTargetAreaId: 0,
      // 区域检测目标特效ID
      eventTargetEffectId: '',
      // 记录上一个滑动偏移量
      prevOffsetY: 0,
    },

    attrsConfig: null,

    // 展现用段落数据 [{ key: xxx, type: 'plain|code', content: xxx, object: xxx, height: xxx }, ...]
    sections: [],

    // 目录数据
    dirData: [],

    // 是否续章
    continueView: false,

    // 阅读器样式
    readerStyle: {},

    // 当前是否起始页
    isStartPage: false,

    // 当前阅读的书本ID
    bookId: 0,
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
      articleState.isStartPage = lo.isEqual(path, '[START]'); // 标注是否起始页

      if (articleState.isStartPage || (lo.isEmpty(articleState.dirData) && (id != undefined))) {
        const data = yield call(GetBookDirDataApi, id);
        articleState.dirData = data.directory;
      }

      // 首次加载索引文件
      if (articleState.__data.indexes.find(e => e.id == id) == undefined) {
        const indexData = yield call(GetArticleIndexDataApi, id);
        if (indexData != null) {
          articleState.__data.indexes.push({ id: id, files: indexData.files });
        }
      }

      // 执行前置命令
      if (lo.isArray(data) && data.length > 0) {
        // 前置变量修改
        do {
          const varsItem = lo.head(data);
          if (!lo.isEqual(varsItem.type, 'code'))
            break

          const actions = lo.pick(varsItem.object, ['varsOn', 'varsOff']);
          if (lo.keys(actions).length > 0) {
            AppDispath({ type: 'SceneModel/processActions', payload: actions });
          }
        } while (false);

        // 设置当前世界
        const foundWolrd = lo.find(data, (e) => lo.isEqual(e.type, 'code') && lo.isObject(e.object.world));
        if (foundWolrd != null) {
          DeviceEventEmitter.emit(EventKeys.SET_CURRENT_WORLD, foundWolrd.object.world);
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
                const inters = lo.intersection([...conds], ['andVarsOn', 'andVarsOff', 'andVarsValue', 'varsOn', 'varsOff']);
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
          if (lo.isBoolean(chat.plain)) item.object.plain = chat.plain;
          item.object.options = yield put.resolve(action('getValidOptions')({ options: chat.options }));
        }
      }

      // 记录当前看的是那本书
      if (payload.id != undefined) {
        articleState.bookId = payload.id;
      }
      
      if (payload.continue != undefined && payload.continue) {
        yield put(action('updateState')({ sections: [...articleState.sections, ...data], continueView: true }));
      } else {
        articleState.sections.length = 0;
        yield put(action('updateState')({ sections: data, continueView: false }));
      }

      // 记录当前阅读
      yield put(action('StateModel/saveArticleState')(payload));
      
      setTimeout(() => {
        DeviceEventEmitter.emit(EventKeys.OPTIONS_HIDE);
      }, 0);
    },

    *cleanup({ payload }, { select }) {
      const articleState = yield select(state => state.ArticleModel);
      // 清理章节数据
      articleState.sections.length = 0;
      
      // 清除背景图片
      DeviceEventEmitter.emit(EventKeys.READER_BACKGROUND_IMG_UPDATE, { imageId: '' });
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
      const { offsetY, textOpacity, bgImgOpacity } = payload;

      for (let k in articleState.sections) {
        const item = articleState.sections[k];
        if (item.type != 'code' || item.object == undefined || item.object == null)
          continue;

        // 优化性能
        if (item.object.completed != undefined && item.object.completed)
          continue;

        // 触发按区域激活提示
        const { toast, pop, image, background, effect, games, animations, sounds } = item.object;
        if (toast == undefined 
          && pop == undefined 
          && image == undefined 
          && background == undefined 
          && effect == undefined 
          && games == undefined 
          && animations == undefined
          && sounds == undefined
          )
          continue;

        // 计算总偏移量
        let totalOffsetY = 0;
        const prevSections = articleState.sections.filter(e => e.key < item.key);
        prevSections.forEach(e => {
          if (e.height != undefined && e.height > 0) {
            totalOffsetY += e.height;
          }
        });

        // 检测线
        const lineMiddle = totalOffsetY - (WIN_SIZE.height / 2) - (DETECTION_AREA_HEIGHT / 2) + (statusBarHeight + ARTICLE_FLATLIST_MARGIN_TOP);
        const lineTop = lineMiddle + DETECTION_AREA_HEIGHT + ARTICLE_EVENT_AREA_MARGIN;
        const lineBottom = lineMiddle - DETECTION_AREA_HEIGHT - ARTICLE_EVENT_AREA_MARGIN;

        if (checkTop(offsetY, totalOffsetY)) { // 事件触发区域(顶部)
          if (effect != undefined) {
            enterEffectArea(articleState, item, AREA_TOP, lineTop);
          }
        } else if (checkBottom(offsetY, totalOffsetY)) {  // 事件触发区域(底部)
          if (effect != undefined) {
            enterEffectArea(articleState, item, AREA_BOTTOM, lineBottom);
          }
        } else if (checkMiddle(offsetY, totalOffsetY)) { // 事件触发区域(中心区域)
          // 弹出提示
          if (toast != undefined) {
            Toast.show(toast, toastType(item.object.type));
            item.object.completed = true;
          }
          // 弹出对话框
          if (pop != undefined) {
            Modal.show(pop);
            item.object.completed = true;
          }
          // 显示插图
          if (image != undefined) {
            DeviceEventEmitter.emit(EventKeys.IMAGE_VIEW_ENTER_EVENT_AREA, item);
          }
          // 显示背景图
          if (background != undefined) {
            articleState.__data.startOffsetY = 0;
            DeviceEventEmitter.emit(EventKeys.READER_BACKGROUND_IMG_UPDATE, background);
          }
          // 效果事件
          if (effect != undefined) {
            enterEffectArea(articleState, item, AREA_MIDDLE, lineMiddle);
          }
          // 子游戏
          if (games != undefined) {
            Games.show(games);
            item.object.completed = true;
          }
          // 音效
          if(sounds !==  undefined){
            sounds.forEach(e => {
              playSound({ ...e, type: "readerVolume" });
            });
            item.object.completed = true;
          }
          // 动效
          if (animations != undefined) {
            EffectAnimations.show(animations);
            item.object.completed = true;
          }
        }

        if (articleState.__data.eventTargetAreaId > 0 && lo.isEqual(articleState.__data.eventTargetKey, item.key)) {
          // 处理线稿背景图渐隐效果
          if (lo.isEqual(articleState.__data.eventTargetEffectId, 'BackgroundArt') && (articleState.__data.startOffsetY > 0)) {
            const value = 1 - (offsetY - articleState.__data.startOffsetY) / DETECTION_AREA_HEIGHT;
            console.debug('alpha', value);
            if (value >= 0 && value <= 1) {
              switch (articleState.__data.eventTargetAreaId) {
                case 1:
                  textOpacity.setValue(1 - value);
                  bgImgOpacity.setValue(value);
                  break;
                case 2:
                  textOpacity.setValue(value);
                  bgImgOpacity.setValue(1 - value);
                  break;
                case 3:
                  break;
              }
            } else {
              // 非检测区域强制指定状态
              if ((articleState.__data.eventTargetAreaId == 2 && value >= 1) 
                || (articleState.__data.eventTargetAreaId == 3 && value < 0)) {
                textOpacity.setValue(1);
                bgImgOpacity.setValue(0);
              } else if ((articleState.__data.eventTargetAreaId == 1 && value > 1)
                || (articleState.__data.eventTargetAreaId == 2 && (value < 0 && value > -1))) {
                textOpacity.setValue(0);
                bgImgOpacity.setValue(1);
              }
              if ((articleState.__data.eventTargetAreaId == 1 && value <= -1)
                || (articleState.__data.eventTargetAreaId == 2 && value <= -1)
                || (articleState.__data.eventTargetAreaId == 3 && value >= 1)) {
                textOpacity.setValue(1);
                bgImgOpacity.setValue(0);
              }
            }
          }
        }

        //
        articleState.__data.prevOffsetY = offsetY;
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

    // 文章概述的option
    *overViewOption({ payload }, { call, put, select }) {
      const chat = yield put.resolve(action('SceneModel/getChat')(payload));
      return yield put.resolve(action('getValidOptions')({ options: chat.options }));
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

    // 修改阅读器样式
    *changeReaderStyle({ payload }, { call, put, select }) {
      const { readerStyle } = yield select(state => state.ArticleModel);
      let NewReaderStyle = {
        ...readerStyle,
        ...payload
      }

      yield call(LocalStorage.set, LocalCacheKeys.READER_STYLE, NewReaderStyle);
      yield put(action('updateState')({ readerStyle: NewReaderStyle }));
    },

    *getTransWorld({ payload }, { call, put, select }) {
      const articleState = yield select(state => state.ArticleModel);
      const { routeName } = payload;

      //
      const result = { ...payload, data: null };

      const worldData = yield call(GetArticleWorldDataApi, articleState.bookId);
      if (worldData == undefined)
        return result;

      let treeConfig = null;
      if (lo.isEqual(routeName, 'LeftWorld')) treeConfig = worldData.world.left;
      if (lo.isEqual(routeName, 'RightWorld')) treeConfig = worldData.world.right;
      if (treeConfig == null)
        return result;

      let lastItem = null;
      for (let key in treeConfig) {
        const item = treeConfig[key];
        const checkVars = lo.pickBy(item, (v, k) => lo.isEqual(k, 'andVarsOn') || lo.isEqual(k, 'andVarsOff'));
        const result = yield put.resolve(action('SceneModel/testCondition')(checkVars));
        if (result) {
          lastItem = item;
        } else {
          break
        }
      }
    
      result.data = lastItem;
      return result;
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
