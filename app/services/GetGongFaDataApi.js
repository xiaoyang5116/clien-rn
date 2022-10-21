import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetGongFaDataApi() {
    return loadConfig('config/gongFaConfig.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}