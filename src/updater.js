// @ts-check
/* eslint-disable no-param-reassign */
import _ from 'lodash';
import loadRss from './loader.js';

const updateRss = (state) => {
  const urls = state.feeds
    .map(({ url }) => url);
  const urlsChunks = _.chunk(urls, 10);
  urlsChunks.forEach((chunkUrls) => {
    const promises = chunkUrls
      .map(loadRss);
    Promise.all(promises)
      .then((results) => {
        const posts = results
          .flatMap((result) => (!result
            ? []
            : result.posts));
        const allPosts = _.union(posts, state.posts);
        const newPosts = _.differenceBy(allPosts, state.posts, 'postLink');
        if (newPosts.length > 0) {
          state.posts = [...newPosts, ...state.posts];
        }
      })
      .finally(() => {
        setTimeout(() => updateRss(state), 5000);
      });
  });
  const promises = urls
    .map(loadRss);
  Promise.all(promises)
    .then((results) => {
      const posts = results
        .flatMap((result) => (!result
          ? []
          : result.posts));
      const allPosts = _.union(posts, state.posts);
      const newPosts = _.differenceBy(allPosts, state.posts, 'postLink');
      if (newPosts.length > 0) {
        state.posts = [...newPosts, ...state.posts];
      }
    })
    .finally(() => {
      setTimeout(() => updateRss(state), 5000);
    });
};

export default updateRss;
