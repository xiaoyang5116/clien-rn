
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetXiuXingDataApi() {
    return loadConfig('config/xiuxing.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
