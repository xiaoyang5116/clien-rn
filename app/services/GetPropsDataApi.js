
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetPropsDataApi() {
    return loadConfig('config/props.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
