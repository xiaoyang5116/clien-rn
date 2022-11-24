
import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetSkillConfigDataApi(){
    return loadConfig(`config/WZXX/WAR/SKILL/config.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}

export async function GetSkillDataApi(fileName){
    return loadConfig(`config/WZXX/WAR/SKILL/${fileName}.yml`, (text) => {
        let data = yaml.load(text);
        return data;
    });
}
