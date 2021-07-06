// @ts-check
/* eslint-disable no-param-reassign */

import loadRss from './loader.js';

const updateRss = (state) => {
  const urls = state.feeds
    .map(({ url }) => url);
  const promises = urls
    .map(loadRss);

  Promise.all(promises)
    .then((results) => {
      const posts = results
        .flatMap((result) => result.posts);
      state.posts = posts;
    })
    .finally(() => {
      setTimeout(() => updateRss(state), 5000);
    });
};

export default updateRss;
