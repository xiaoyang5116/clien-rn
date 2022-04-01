
import yaml from 'js-yaml';
import lo from 'lodash';

let UNIQUE_KEY = 1;

export async function GetArticleDataApi(id, path) {
    let url = `http://localhost:8081/config/${id}/TXT/${id}_${path}.txt`;
    return fetch(url)
    .then(r => r.text(url))
    .then(text => {
        // 返回格式化的段落数据
        const sectionData = [];

        const items = text.split(/#(START|END)[=]{1,}.*?[=]{1,}[\r\n]*/);

        let begin = false;
        let code = '';
        let key = 0;
        items.forEach(e => {
            if (lo.isEmpty(e))
                return;

            if (lo.isEqual(e, 'START')) {
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
                // 长文本拆分成若干段小文本
                let i = 0;
                const splits = e.split(/(.*?[\r\n]+)/).filter(e => !lo.isEmpty(e));
                while (i < splits.length) {
                  // N行为一个小块
                  const lines = lo.slice(splits, i, i + 10);

                  // 去掉尾行换行符
                  const last = lo.last(lines);
                  lines[lines.length - 1] = last.substring(0, last.length - 1);

                  i += lines.length;
                  sectionData.push({ key: UNIQUE_KEY++, type: 'plain', content: lines.join('') });
                }
            }
        });

        return sectionData;
    });
}
