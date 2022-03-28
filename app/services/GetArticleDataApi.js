
import yaml from 'js-yaml';
import lo from 'lodash';

export async function GetArticleDataApi(id) {
    let url = `http://localhost:8081/config/${id}.txt`;
    return fetch(url)
    .then(r => r.text(url))
    .then(text => {
        // 返回格式化的段落数据
        const sectionData = [];

        // 提取内容
        const reg = /(.*?)#BEGIN[=]{1,}[^\r\n]+(.*?)#END[=]{1,}[\r\n]+/gis;
        let res = null;
        let key = 0;
        while ((res = reg.exec(text)) != null) {
            sectionData.push({ key: key + 1, type: 'plain', content: res[1] });
            sectionData.push({ key: (key + 2), type: 'code', content: lo.replace(res[2], /[\n]/g, ''), object: yaml.load(res[2]) });
            key += 2;
        }
        return sectionData;
    });
}
