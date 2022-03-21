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
    return list

    // const fragment = result.replace(/<(div).*?>/gi, '').split('</div>').map((item, index) => {
    //     const label = item.split('>')[0].split('<')[1]
    //     switch (label) {
    //         case 'header':
    //             const header = item.replace(/<(header).*?>/gi, '').split('</header>').filter(s => { return s && s.trim() })
    //             return list.push({
    //                 id: header[0] + index,
    //                 template: "ChapterTemplate",
    //                 title: header[0],
    //                 data: header[1],
    //             })
    //         case 'p':
    //             return list.push({
    //                 id: item + index,
    //                 template: "TextTemplate",
    //                 data: item,
    //             })
    //         case 'button':
    //             const button = item.replace(/<(button).*?>/gi, '').replace(/\s+/g, '').split('</button>').filter(s => { return s && s.trim() })
    //             if (button.length > 1) {
    //                 return list.push({
    //                     id: button[0] + index,
    //                     template: "OptionTemplate",
    //                     data: button
    //                 })
    //             } else {
    //                 return list.push({
    //                     id: button + index,
    //                     template: "OptionTemplate",
    //                     data: button
    //                 })
    //             }
    //         case 'popUp':
    //             const popUp = item.replace(/<(popUp).*?>/gi, '').replace(/\s+/g, '').split('</popUp>').filter(s => { return s && s.trim() })
    //             if (popUp.length > 1) {
    //                 return list.push({
    //                     id: popUp[0] + index,
    //                     template: "popUp",
    //                     data: popUp
    //                 })
    //             } else {
    //                 return list.push({
    //                     id: popUp + index,
    //                     template: "popUp",
    //                     data: popUp
    //                 })
    //             }
    //     }
    // })

}