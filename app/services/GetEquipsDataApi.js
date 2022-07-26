
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetEquipsDataApi() {
    return loadConfig('config/equips.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
