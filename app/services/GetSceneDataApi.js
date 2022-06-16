
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetSceneDataApi(path) {
    return loadConfig(`config/${path}.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
