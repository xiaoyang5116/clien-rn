import yaml from 'js-yaml';

export async function GetClueDataApi(data) {
    let url = `http://localhost:8081/config/CLUES/${data.cluesType}/${data.name}.yml`;
    return fetch(url)
        .then(r => r.text(url))
        .then(text => {
            let { clue } = yaml.load(text);
            return clue;
        });
}
