import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetClueConfigDataApi() {
    return loadConfig('config/WZXX/CLUES/config.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
