import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetClueDataApi(path) {
    return loadConfig(`config/WZXX/CLUES/${path}.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
