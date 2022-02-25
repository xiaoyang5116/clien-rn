
import yaml from 'js-yaml';

export async function GetStoryDataApi(params) {
    return fetch("http://localhost:8081/Storys.yml")
    .then(r => r.text())
    .then(text => {
        let data = yaml.load(text);
        return data;
    });
}
