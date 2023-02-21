// @ts-check
/* eslint-disable no-param-reassign */
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
        if (!feed) {
          state.form.processState = 'failing';
          state.form.error = 'errors.invalidRss';
        } else {
          feed.feedInfo = { ...feed.feedInfo, url };
          state.feeds = [feed.feedInfo, ...state.feeds];
          state.posts = [...feed.posts, ...state.posts];
          state.form.processState = 'success';
          if (feedsCount === 0) {
            updateRss(state);
          }
          e.target.reset();
        }
      })
      .catch(() => {
        state.form.processState = 'failing';
        state.form.error = 'errors.netError';
      });
  } else {
    state.form.processState = 'failing';
  }
};

export const handleViewPost = (state, post) => {
  state.viewedPostsIds = [post.postId, ...state.viewedPostsIds];
};
