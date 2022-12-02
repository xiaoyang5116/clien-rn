
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetSeqDataApi(seqId) {
    return loadConfig(`config/WZXX/WAR/HangUp/seq_${seqId}.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
