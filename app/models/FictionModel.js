import { GetListForFiction } from '../services/GetListForFiction'

// 截取常量
// const intercept = /#.*=*={10,}/

export default {
    namespace: 'Fiction',  // 命名空间
    state: {
        fictionList: [],
        chapter: 1,
        isLatestChapter: false,
    },
    reducers: {
        changeList(prevState, action) {
            return {
                ...prevState,
                fictionList: action.payload
            }
        },
        nxtChapter(prevState, action) {
            return {
                ...prevState.fictionList,
                fictionList: action.payload,
                chapter: prevState.chapter + 1
            }
        },
        addChapter(prevState, action) {
            return {
                fictionList: [...prevState.fictionList, ...action.payload],
                chapter: prevState.chapter + 1
            }
        },
        noData(prevState, action) {
            return {
                ...prevState,
                isLatestChapter: action.payload
            }
        }
    },

    // 异步函数
    effects: {
        *getList({ payload }, { call, put }) {
            const res = yield call(GetListForFiction, payload.chapter)
            yield put.resolve({
                type: "changeList",
                payload: res
            })
        },
        *nextChapter({ payload }, { call, put }) {
            const res = yield call(GetListForFiction, (payload.chapter + 1))
            if (res.length === 0) {
                yield put({
                    type: "noData",
                    payload: true,
                })
            } else {
                yield put({
                    type: "addChapter",
                    payload: res
                })
            }
        }
    }
}


