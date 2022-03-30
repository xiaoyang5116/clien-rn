
import yaml from 'js-yaml';
import lo from 'lodash';
import fs from "react-native-fs";

export async function GetArticleDataApi(id) {

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
