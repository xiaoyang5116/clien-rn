
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetBooksDataApi() {
    return loadConfig('config/books.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}
