import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetMailDataApi(fileName) {
    return loadConfig(`config/TEST/MAIL/${fileName}.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}