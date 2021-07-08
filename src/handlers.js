// @ts-check
/* eslint-disable no-param-reassign */
import _ from 'lodash';
import validateUrl from './validator.js';
import loadRss from './loader.js';
import updateRss from './updater.js';

export const handleAddFeed = (e, state) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url').toString().trim();
  const error = validateUrl(url, state.feeds);
  state.form.error = error;
  const feedsCount = state.feeds.length;
  if (!error) {
    state.form.processState = 'loading';
    loadRss(url)
      .then((feed) => {
        feed.feedInfo = { ...feed.feedInfo, url, id: _.uniqueId() };
        state.feeds = [feed.feedInfo, ...state.feeds];
        const posts = feed.posts
          .map((post) => ({ ...post, postId: _.uniqueId() }));
        state.posts = [...posts, ...state.posts];
        state.form.processState = 'success';
        if (feedsCount === 0) {
          updateRss(state);
        }
        e.target.reset();
      })
      .catch((err) => {
        state.form.processState = 'failing';
        if (err.isAxiosError) {
          state.form.error = 'errors.netError';
        } else {
          state.form.error = 'errors.invalidRss';
        }
      });
  } else {
    state.form.processState = 'failing';
  }
};

export const handleViewPost = (state, post) => {
  state.uiState.viewedPostsIds.push(post.postId);
};
