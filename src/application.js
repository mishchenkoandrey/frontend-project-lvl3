// @ts-check
/* eslint-disable no-param-reassign */
import i18next from 'i18next';
import { setLocale } from 'yup';
import ru from './locales/ru.js';
import { handleAddFeed } from './handlers.js';
import initView from './view.js';

export default () => {
  const state = {
    form: {
      processState: 'filling',
      error: null,
    },
    feeds: [],
    posts: [],
    uiState: {
      viewedPostsIds: [],
    },
  };

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    resources: {
      ru,
    },
  }).then(() => {
    setLocale({
      mixed: {
        notOneOf: i18nInstance.t('errors.rssExists'),
        required: i18nInstance.t('errors.emptyField'),
      },
      string: {
        url: i18nInstance.t('errors.invalidUrl'),
      },
    });
  });

  const form = document.querySelector('.rss-form');

  const watchedState = initView(state, i18nInstance);

  form.addEventListener('submit', (e) => {
    handleAddFeed(e, watchedState);
  });
};
