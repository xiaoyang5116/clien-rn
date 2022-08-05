
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetShopDataApi() {
    return loadConfig('config/shop.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
