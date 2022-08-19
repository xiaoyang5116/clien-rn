
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetCollectionDataApi() {
    return loadConfig(`config/collection.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
