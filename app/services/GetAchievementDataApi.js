import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetAchievementDataApi() {
    return loadConfig('config/achievement.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}