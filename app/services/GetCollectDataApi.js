
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetCollectDataApi(bookId, fileName) {
    return loadConfig(`config/${bookId}/COLLECT/${fileName}.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
