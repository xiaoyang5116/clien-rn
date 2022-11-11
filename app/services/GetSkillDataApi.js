
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetSkillDataApi() {
    return loadConfig(`config/skills.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
