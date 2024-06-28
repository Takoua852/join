const STORAGE_TOKEN = 'K3WAB2LDJYH8HOI97UE5ZYZHM2ME7VV9ETQ0FI0T';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

let users = [];
let contacts = [];
let tasks = [];


async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => res.data.value);
}


