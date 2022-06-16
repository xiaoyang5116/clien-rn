
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetBookConfigDataApi(id) {
    return loadConfig(`config/${id}/config.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
