
import yaml from 'js-yaml';

export async function GetSceneDataApi(path) {
    let url = "http://localhost:8081/config/{0}.yml".format(path);
    return fetch(url)
    .then(r => r.text(url))
    .then(text => {
        let data = yaml.load(text);
        return data;
    });
}
