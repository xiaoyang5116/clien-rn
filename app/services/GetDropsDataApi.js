
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetDropsDataApi() {
    return loadConfig('config/drops.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
