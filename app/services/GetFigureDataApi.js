import yaml from 'js-yaml';

export async function GetFigureDataApi() {
    let url = "http://localhost:8081/config/TEST/MAIL/mailFigure.yml"
    return fetch(url)
        .then(r => r.text(url))
        .then(text => {
            let data = yaml.load(text);
            return data;
        });
}