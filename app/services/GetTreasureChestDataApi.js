
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetTreasureChestDataApi(version) {
    return loadConfig(`config/treasure_chest.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}