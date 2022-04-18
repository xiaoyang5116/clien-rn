import { GetMailDataApi } from '../services/GetMailDataApi';

import {
    action,
    LocalCacheKeys
} from "../constants";
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import { now } from '../utils/DateTimeUtils';


export default {
    namespace: 'MailBoxModel',

    state: {
        //  当前人物id
        figureId: '',

        // 当前的邮件key
        currentKey: '',

        // 当前的邮件是否完成
        currentIsFinish: false,

        // 当前的邮件数据
        currentMailData: [],
        // 邮件历史数据
        mailHistoryData: [],

        // 邮件配置文件
        mailConfigData: [],
    },

    effects: {
        // 加载邮件历史数据
        *reload({ }, { call, put, select }) {
            // yield call(LocalStorage.clear, LocalCacheKeys.MAIL_DATA);

            const mailData = yield call(LocalStorage.get, LocalCacheKeys.MAIL_DATA);
            if (mailData === null) {
                const initMaildata = [{
                    id: '02', currentKey: "p1", isFinish: false, historyData: [
                        { key: 'p1', status: 'receive', isOpen: false, mailContent: '你迅速跑过去，地面有些东西。', time: now() },
                    ]
                }]
                const initSuccess = yield call(LocalStorage.set, LocalCacheKeys.MAIL_DATA, initMaildata);
                mailData = yield call(LocalStorage.get, LocalCacheKeys.MAIL_DATA);
            }
            yield put.resolve(action('updateMailHistoryData')(mailData));
        },
        // 获取邮件配置数据
        *getMailConfigData({ }, { call, put }) {
            const { mailData } = yield call(GetMailDataApi);
            yield put(action('updataMailConfigData')(mailData));
        },
        // 更改当前人物的邮件信息
        *changeCurrentFigureMailData({ payload }, { call, put }) {
            yield put(action('updateCurrentFigureMailData')(payload));
        },
        // 添加新邮件
        *addNewMail({ payload }, { call, put, select }) {
            const { currentMailData, mailConfigData } = yield select(state => state.MailBoxModel);
            const currentMail = {
                key: payload.tokey,
                status: 'receive',
                isOpen: false,
                mailContent: mailConfigData.find(f => f.id === payload.id).mail.find(m => m.key === payload.tokey).content,
                time: now(),
            }
            const newCurrentMailData = [currentMail, ...currentMailData];
            // 更新
            yield put(action('updateCurrentMailData')(newCurrentMailData));
            yield put.resolve(action('saveHistory')({ currentMail: newCurrentMailData, currentKey: payload.tokey }));
        },

        // 打开邮件
        *openLetter({ payload }, { call, put, select }) {
            const { currentMailData } = yield select(state => state.MailBoxModel);
            const currentMail = currentMailData.map(m => m.key === payload.key ? { ...m, isOpen: true } : m);
            yield put(action('updateCurrentMailData')(currentMail));
            yield put.resolve(action('saveHistory')({ currentMail, currentKey: payload.key }));
        },

        // 回信
        *replyLetter({ payload }, { call, put, select }) {
            // {"content": "去拿菜刀", "nextTime": "5", "tokey": "p2"}
            // { content: "退出", tokey: "finish" }
            const { currentMailData, currentKey, figureId } = yield select(state => state.MailBoxModel);
            // 当前邮件添加回信
            const currentMail = currentMailData.map(m => m.key === currentKey ? { ...m, replyContent: payload.content, status: "reply" } : m);
            if (payload.tokey !== 'finish') {
                // 更新
                yield put(action('updateCurrentFigureMailData')({ id: figureId, historyData: currentMail, currentKey: payload.tokey, isFinish: false }));
                yield put.resolve(action('saveHistory')({ currentMail, currentKey: payload.tokey }));
                yield put(action('addNewMail')({ tokey: payload.tokey, nextTime: payload.nextTime, id: figureId }));
            }
            else {
                yield put(action('updateCurrentFigureMailData')({ id: figureId, historyData: currentMail, currentKey, isFinish: true }));
                yield put.resolve(action('saveHistory')({ currentMail, currentKey, }));
            }

        },

        // 保存历史记录
        *saveHistory({ payload }, { call, put, select }) {
            const { mailHistoryData, figureId } = yield select(state => state.MailBoxModel);
            const newHistory = mailHistoryData.map(m => m.id === figureId ? {
                ...m,
                historyData: payload.currentMail,
                currentKey: payload.currentKey
            } : m);
            yield call(LocalStorage.set, LocalCacheKeys.MAIL_DATA, newHistory);
            yield put(action('updateMailHistoryData')(newHistory));
        },
    },

    reducers: {
        // 更新邮件历史数据
        updateMailHistoryData(prevState, { payload }) {
            return {
                ...prevState,
                mailHistoryData: payload
            }
        },
        // 获取邮件配置数据
        updataMailConfigData(prevState, { payload }) {
            return {
                ...prevState,
                mailConfigData: payload
            }
        },
        // 更新当前人物的邮件信息
        updateCurrentFigureMailData(prevState, { payload }) {
            return {
                ...prevState,
                figureId: payload.id,
                currentKey: payload.currentKey,
                currentIsFinish: payload.isFinish,
                currentMailData: payload.historyData,
            }
        },
        // 更新当前邮件信息
        updateCurrentMailData(prevState, { payload }) {
            return {
                ...prevState,
                currentMailData: payload
            }
        },
        // 回信
        // changeReplyLetter(prevState, { payload }) {
        //     return {
        //         ...prevState,
        //         currentMailData: payload.currentMail,
        //         currentKey: payload.currentKey
        //     }
        // }

    },
    subscriptions: {
        registerReloadEvent({ dispatch }) {
            EventListeners.register('reload', (msg) => {
                dispatch({ 'type': 'reload' });
            });
        },
    }
}
