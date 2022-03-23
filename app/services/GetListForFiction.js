// 异步请求小说章节数据
export async function GetListForFiction(chapter) {
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
                isShow: true,
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
                            isShow: true,
                        })
                    case 'button':
                        return list.push({
                            id: chapter.toString() + index.toString() + currentIndex.toString(),
                            template: "OptionTemplate",
                            title: current.title,
                            isShow: true,
                        })
                    case 'popUp':
                        return list.push({
                            id: chapter.toString() + index.toString() + currentIndex.toString(),
                            template: "popUp",
                            title: current.title,
                            content: current.content,
                            isShow: false,
                        })
                }
            })

        }
    })

    // console.log("list:",list); 
    return list
}