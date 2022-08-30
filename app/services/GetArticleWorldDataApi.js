
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetArticleWorldDataApi(id) {
    return loadConfig(`config/${id}/world.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
