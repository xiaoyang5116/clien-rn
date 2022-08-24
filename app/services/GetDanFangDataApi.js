import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetDanFangDataApi() {
    return loadConfig('config/danFang.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}