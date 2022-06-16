
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetAttrsDataApi() {
    return loadConfig('config/attrs.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
