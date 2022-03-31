
import yaml from 'js-yaml';
import lo from 'lodash';

// 确保每一个段落都有唯一的KEY，使得onLayout每次都re-render。
let UNIQUE_KEY = 1;

export async function GetArticleDataApi(id, path) {
    let url = `http://localhost:8081/config/${id}/${id}_${path}.txt`;
    return fetch(url)
    .then(r => r.text(url))
    .then(text => {
        // 返回格式化的段落数据
        const sectionData = [];

        const items = text.split(/#(BEGIN|END)[=]{1,}[\n]+/);

        let begin = false;
        let code = '';
        let key = 0;
        items.forEach(e => {
            if (lo.isEmpty(e))
                return;

            if (lo.isEqual(e, 'BEGIN')) {
                begin = true;
            } else if (lo.isEqual(e, 'END')) {
                const obj = yaml.load(code);
                if (lo.isArray(obj)) {
                    obj.forEach(v => {
                        sectionData.push({ key: UNIQUE_KEY++, type: 'code', object: v });
                    });
                } else {
                    sectionData.push({ key: UNIQUE_KEY++, type: 'code', object: obj });
                }
                begin = false;
                code = '';
            } else if (begin) {
                code = e;
            } else {
                sectionData.push({ key: UNIQUE_KEY++, type: 'plain', content: e });
            }
        });

        return sectionData;
    });
}
