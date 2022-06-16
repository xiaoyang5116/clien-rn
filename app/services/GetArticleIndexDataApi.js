
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetArticleIndexDataApi(id) {
    return loadConfig(`config/${id}/TXT/index.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
