
import yaml from 'js-yaml';

export async function GetSeqDataApi(seqId) {
    let url = 'http://localhost:8081/config/seq_{0}.yml'.format(seqId);
    return fetch(url)
    .then(r => r.text(url))
    .then(text => {
        let data = yaml.load(text);
        return data;
    });
}
