
import yaml from 'js-yaml';
import lo from 'lodash';

export async function GetArticleIndexDataApi(id) {
    let url = `http://localhost:8081/config/${id}/index.yml`;
    return fetch(url)
    .then(r => r.text(url))
    .then(text => {
        return yaml.load(text);
    });
}
