import yaml from 'js-yaml';
import { loadConfig } from '../utils/ConfigLoader';

export async function GetTurnLattice() {
    return loadConfig('config/turnLattice.yml', (text) => {
        let data = yaml.load(text);
        return data;
    });
}