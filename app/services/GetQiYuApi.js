import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetQiYuApi(fileName) {
    return loadConfig(`config/QIYU/${fileName}.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}