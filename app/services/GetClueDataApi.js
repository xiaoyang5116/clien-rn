import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetClueDataApi() {
    return loadConfig('config/CLUES/test.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
