import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetLingTianDataApi() {
    return loadConfig('config/lingTian.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}