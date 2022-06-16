
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetComposeDataApi() {
    return loadConfig('config/compose.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
