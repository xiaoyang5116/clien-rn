import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetSmallUniverseProjectDataApi(acrion) {
    return loadConfig('config/smallUniverseProject.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
