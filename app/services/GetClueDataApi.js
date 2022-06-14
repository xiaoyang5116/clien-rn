import yaml from 'js-yaml';

export async function GetClueDataApi({ cluesType, cluesName }) {
    let url = `http://localhost:8081/config/CLUES/${cluesType}/${cluesName}.yml`;
    return fetch(url)
        .then(r => r.text(url))
        .then(text => {
            let { clue } = yaml.load(text);
            return clue;
        });
}
