
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetShopsDataApi() {
    return loadConfig('config/shops.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
