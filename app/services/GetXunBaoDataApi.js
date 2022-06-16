
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetXunBaoDataApi(acrion) {
    return loadConfig(`config/XunBao/${acrion}.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
