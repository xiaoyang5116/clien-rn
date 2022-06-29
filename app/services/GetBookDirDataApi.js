
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetBookDirDataApi(id) {
    return loadConfig(`config/${id}/directory.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
