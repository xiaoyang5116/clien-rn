
import yaml from 'js-yaml';

export async function GetSceneDataApi(params) {
    let url = "http://localhost:8081/config/{0}.yml".format(params);
    return fetch(url)
    .then(r => r.text(url))
    .then(text => {
        let data = yaml.load(text);
        return data;
    });
}
