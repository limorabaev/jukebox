import axios from 'axios';

export default {
    getVideoSearchResults
}

async function getVideoSearchResults(string) {
    const API_KEY = 'AIzaSyDyXgfPxeA2-fcfrl9HEuVQnfNo5lVrjGU';
    const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
    const PART = 'id,snippet';
    const TYPE = 'video';
    const MAX_RESULTS = 10;
    const QUERY = string;

    const res = await axios.get(`${BASE_URL}?part=${PART}&maxResults=${MAX_RESULTS}&type=${TYPE}&q=${QUERY}&key=${API_KEY}`);
    const videoSearchResults = res.data.items.map(video => {
        return {
            id: video.id.videoId,
            title: domDecoder(video.snippet.title),
            imgUrl: video.snippet.thumbnails.medium.url // default: 90 * 120, medium: 180 * 320, high: 360 * 480
        }
    })
    return videoSearchResults;
}

function domDecoder(str) {
    let parser = new DOMParser();
    let dom = parser.parseFromString('<!doctype html><body>' + str, 'text/html');
    return dom.body.textContent;
}