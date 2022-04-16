
import yaml from 'js-yaml';

export async function GetLotteryDataApi(version) {
    let url = `http://localhost:8081/config/lottery_${version}.yml`;
    return fetch(url)
    .then(r => r.text(url))
    .then(text => {
        let data = yaml.load(text);
        return data;
    });
}
