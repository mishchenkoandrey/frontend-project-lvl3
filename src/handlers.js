/* eslint-disable no-param-reassign */

import validateUrl from './validator.js';
import loadRss from './loader.js';

export const handleAddFeed = (e, state) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url').trim();
  const error = validateUrl(url, state.feeds);
  console.log(error);
  state.form.error = error;
  if (!error) {
    state.form.processState = 'loading';
    loadRss(url)
      .then((feed) => {
        feed.feedInfo = { ...feed.feedInfo, url };
        state.feeds = [feed.feedInfo, ...state.feeds];
        state.posts = [...feed.posts, ...state.posts];
        state.form.processState = 'success';
        e.target.reset();
      })
      .catch((err) => {
        state.form.processState = 'failing';
        if (err.isAxiosError) {
          state.form.error = 'errors.netError';
        } else {
          state.form.error = 'errors.invalidRSS';
        }
      });
  } else {
    state.form.processState = 'failing';
  }
};

export const handleViewPost = (post) => {
  document.body.classList.add('modal-open');

  document.querySelector('.modal-title').textContent = post.title;

  document.querySelector('.modal-body').innerHTML = post.desc;

  document.querySelector('.full-article').href = post.url;

  // const modal = document.querySelector('#modal');

  // $(modal).modal({ show: true });
};

export const handleCloseModal = () => {
  document.body.classList.remove('modal-open');

  // const modal = document.querySelector('#modal');

  // $(modal).modal({ show: false });
};
