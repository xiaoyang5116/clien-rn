import yaml from 'js-yaml';
import fs from "react-native-fs";

export async function GetFigureDataApi() {

    // 安卓打包后读取本地文件
    return fs.readFileAssets("config/TEST/figure.yml", "utf8")
        .then(r => {
            let data = yaml.load(r);
            return data;
        })
        .catch(console.error)

    // let url = "http://localhost:8081/config/TEST/figure.yml"
    // return fetch(url)
    //     .then(r => r.text(url))
    //     .then(text => {
    //         let data = yaml.load(text);
    //         return data;
    //     });
}