
import yaml from 'js-yaml';
import lo from 'lodash';
import fs from "react-native-fs";

// fs.readFileAssets("config/article_1.1.txt", "utf8")
//     .then(text => {
//         // work with it
//         Alert.alert("result", text)
//         // 返回格式化的段落数据
//         const sectionData = [];
//         // 提取内容
//         const reg = /(.*?)#BEGIN[=]{1,}[^\r\n]+(.*?)#END[=]{1,}[\r\n]+/gis;
//         let res = null;
//         let key = 0;
//         while ((res = reg.exec(text)) != null) {
//             sectionData.push({ key: key + 1, type: 'plain', content: res[1] });
//             sectionData.push({ key: (key + 2), type: 'code', content: lo.replace(res[2], /[\n]/g, ''), object: yaml.load(res[2]) });
//             key += 2;
//         }
//         console.log("sectionData", sectionData);
//         return sectionData;
//     })
//     .catch(console.error)
// 确保每一个段落都有唯一的KEY，使得onLayout每次都re-render。
let UNIQUE_KEY = 1;

export async function GetArticleDataApi(id, path) {
    let url = `http://localhost:8081/config/${id}/TXT/${id}_${path}.txt`;
    return fetch(url)
    .then(r => r.text(url))
    .then(text => {
        // 返回格式化的段落数据
        const sectionData = [];

        const items = text.split(/#(BEGIN|END)[=]{1,}[\r\n]+/);

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
