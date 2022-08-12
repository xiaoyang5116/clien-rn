import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetFigureDataApi() {
    return loadConfig('config/WZXX/figure.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}