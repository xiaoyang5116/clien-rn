
import yaml from 'js-yaml';

export async function GetXunBaoDataApi(typeId) {
    let url = `http://localhost:8081/config/XunBao/xunbao_${typeId}.yml`;
    return fetch(url)
    .then(r => r.text(url))
    .then(text => {
        let data = yaml.load(text);
        return data;
    });
}
