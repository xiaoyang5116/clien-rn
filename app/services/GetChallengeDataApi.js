
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetChallengeDataApi(id) {
    return loadConfig(`config/challenge/${id}.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
