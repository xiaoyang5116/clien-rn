import yaml from 'js-yaml';

export async function GetMailDataApi() {
    let url = "http://localhost:8081/config/TEST/mail.yml"
    return fetch(url)
        .then(r => r.text(url))
        .then(text => {
            let data = yaml.load(text);
            return data;
        });
}