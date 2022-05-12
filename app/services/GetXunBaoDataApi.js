
import yaml from 'js-yaml';

export async function GetXunBaoDataApi(acrion) {
    let url = `http://localhost:8081/config/XunBao/${acrion}.yml`;
    return fetch(url)
    .then(r => r.text(url))
    .then(text => {
        let data = yaml.load(text);
        return data;
    });
}
