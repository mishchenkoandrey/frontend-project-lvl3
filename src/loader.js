// @ts-check

import axios from 'axios';
import parseRss from './parser.js';

const routes = {
  allOrigins: (url) => {
    const result = new URL('/get', 'https://allorigins.hexlet.app');
    result.searchParams.set('url', url);
    result.searchParams.set('disableCache', 'true');
    return result.toString();
  },
};

export default (url) => axios.get(routes.allOrigins(url))
  .then((response) => parseRss(response.data.contents));
