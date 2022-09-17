import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetWorshipDataApi() {
    return loadConfig('config/worship.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
