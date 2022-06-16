import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetMailConfigApi() {
    return loadConfig('config/TEST/MAIL/mailConfig.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}