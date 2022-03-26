import { toastType } from '../constants'


// 异步请求小说章节数据
export async function GetListForFiction(chapter) {
    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        const errortext = response.statusText;
        const error = new Error(errortext);
        error.name = response.status;
        error.response = response;
        throw error;
    }
    return fetch(`http://localhost:8081/config/test${chapter}.txt`)
        .then(checkStatus)
        .then(response => {
            if (response.status === 204) {
                return [];
            }
            return response.text();
        })
        .then(data => {
            // 没有数据
            if (data.length === 0) return [];

            const list = [];
            const resultList = data.split(/#.*=*={5,}/);
            resultList.map((item, index) => {
                if (index % 2 === 0) {
                    if (item === '') {
                        return;
                    }
                    list.push({
                        id: chapter.toString() + index.toString(),
                        template: 'TextTemplate',
                        content: item,
                        // isShow: true,
                    });
                } else {
                    const dataJson = JSON.parse(item);
                    dataJson.data.map((current, currentIndex) => {
                        switch (current.type) {
                            case 'ChapterTemplate':
                                return list.push({
                                    id:
                                        chapter.toString() +
                                        index.toString() +
                                        currentIndex.toString(),
                                    template: 'ChapterTemplate',
                                    title: current.title,
                                    content: current.content,
                                    // isShow: true,
                                });
                            case 'button':
                                return list.push({
                                    id:
                                        chapter.toString() +
                                        index.toString() +
                                        currentIndex.toString(),
                                    template: 'OptionTemplate',
                                    title: current.title,
                                    // isShow: true,
                                });
                            case 'popUp':
                                return list.push({
                                    id:
                                        chapter.toString() +
                                        index.toString() +
                                        currentIndex.toString(),
                                    template: 'popUp',
                                    title: current.title,
                                    content: current.content,
                                    // isShow: false,
                                });
                            case 'toast':
                                return list.push({
                                    id:
                                        chapter.toString() +
                                        index.toString() +
                                        currentIndex.toString(),
                                    template: 'toast',
                                    toastType: toastType(current.toastType),
                                    time: current.time ? current.time : 600,
                                    content: current.content,
                                    // isShow: false,
                                });
                        }
                    });
                }
            });
            return list;
        })
        .catch(error => {
            return [];
        });

    // console.log("list:",list);
    // return result
}
