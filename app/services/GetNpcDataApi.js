import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetNpcDataApi(fileName) {
    return loadConfig(`config/WZXX/npc_config.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}