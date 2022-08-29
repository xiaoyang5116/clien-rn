import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetLianQiTuzhiApi() {
    return loadConfig('config/lianQiTuZhi.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}