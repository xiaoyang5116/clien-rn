
import yaml from 'js-yaml';
import lo from 'lodash';

export async function GetArticleDataApi(id) {
    let url = `http://localhost:8081/config/${id}.txt`;
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
                sectionData.push({ key: key++, type: 'code', content: lo.replace(code, /[\n]/g, ''), object: yaml.load(code) });
                begin = false;
                code = '';
            } else if (begin) {
                code = e;
            } else {
                sectionData.push({ key: key++, type: 'plain', content: e });
            }
        });

        return sectionData;
    });
}
