
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetSoundDataApi(acrion) {
    return loadConfig('config/sound.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
