
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetLotteryDataApi(version) {
    return loadConfig(`config/lottery_${version}.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
