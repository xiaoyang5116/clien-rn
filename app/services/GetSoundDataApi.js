
import yaml from 'js-yaml';

export async function GetSoundDataApi(acrion) {
    let url = `http://localhost:8081/config/sound.yml`;
    return fetch(url)
    .then(r => r.text(url))
    .then(text => {
        let data = yaml.load(text);
        return data;
    });
}
