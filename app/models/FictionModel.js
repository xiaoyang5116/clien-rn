// 截取常量
// const intercept = /#.*=*={10,}/

export default {
    namespace: 'Fiction',  // 命名空间
    state: {
        fictionList: [],
        chapter: 1,
        latestChapter: false,
    },
    reducers: {
        changeList(prevState, action) {
            return {
                ...prevState,
                fictionList: action.payload
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
                latestChapter: action.payload
            }
        }
    },

    // 异步函数
    effects: {
        *getList({ payload }, obj) {
            const { call, put } = obj
            const res = yield call(getListForFiction, payload.chapter)
            yield put({
                type: "changeList",
                payload: res
            })
        },
        *nextChapter({ payload }, { call, put }) {
            const res = yield call(getListForFiction, payload.chapter + 1)
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

// 异步请求数据
async function getListForFiction(chapter) {
    const list = []
    if (chapter > 2) {
        return []
    }
    let result = await fetch(`http://localhost:8081/config/test${chapter}.txt`).then(res => res.text())
    const resultList = result.split(/#.*=*={5,}/)
    resultList.map((item, index) => {
        if (index % 2 === 0) {
            if (item === '') {
                return
            }
            list.push({
                id: chapter.toString() + index.toString(),
                template: "TextTemplate",
                content: item,
            })
        }
        else {
            const dataJson = JSON.parse(item)
            dataJson.data.map((current, currentIndex) => {
                switch (current.type) {
                    case 'ChapterTemplate':
                        return list.push({
                            id: chapter.toString() + index.toString() + currentIndex.toString(),
                            template: "ChapterTemplate",
                            title: current.title,
                            content: current.content,
                        })
                    case 'button':
                        return list.push({
                            id: chapter.toString() + index.toString() + currentIndex.toString(),
                            template: "OptionTemplate",
                            title: current.title,
                        })
                    case 'popUp':
                        return list.push({
                            id: chapter.toString() + index.toString() + currentIndex.toString(),
                            template: "popUp",
                            title: current.title,
                            content: current.content
                        })
                }
            })

        }
    })

    // console.log("list:",list); 
    return list
}