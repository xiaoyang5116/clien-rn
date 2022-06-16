
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetExploreDataApi() {
    return loadConfig('config/explore.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
