import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetPlantComposeDataApi() {
    return loadConfig('config/plantCompose.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}