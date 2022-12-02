
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetBuffDataApi() {
    return loadConfig(`config/WZXX/WAR/SKILL/buffs.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
