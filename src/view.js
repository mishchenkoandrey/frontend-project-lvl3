// @ts-check
import onChange from 'on-change';
import { handleViewPost } from './handlers.js';

const submitButton = document.querySelector('[type="submit"]');
const input = document.querySelector('.form-control');
const feedback = document.querySelector('.feedback');

const clearFeedback = () => {
  feedback.textContent = '';
  feedback.classList.remove('text-danger', 'text-success');
  input.classList.remove('is-invalid');
};

const toggleForm = (status) => {
  if (status) {
    submitButton.setAttribute('disabled', '');
    input.setAttribute('readOnly', '');
  } else {
    submitButton.removeAttribute('disabled');
    input.removeAttribute('readOnly');
  }
};

const renderProcessState = (state, processState, i18nInstance) => {
  switch (processState) {
    case 'loading':
      toggleForm(true);
      clearFeedback();
      break;
    case 'success':
      toggleForm(false);
      clearFeedback();
      feedback.textContent = i18nInstance.t('success');
      feedback.classList.add('text-success');
      break;
    case 'failing':
      toggleForm(false);
      clearFeedback();
      feedback.textContent = i18nInstance.t(state.form.error);
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      break;
    default:
      throw new Error(`Unexpected state: ${processState}`);
  }
};

const renderError = (state, error, i18nInstance) => {
  feedback.textContent = '';
  if (error) {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.textContent = i18nInstance.t(state.form.error);
  } else {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
  }
};

const renderFeeds = (feeds, i18nInstance) => {
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.innerHTML = '';
  const feedsCard = document.createElement('div');
  feedsCard.classList.add('card', 'border-0');
  feedsCard.innerHTML = `
    <div class="card-body">
      <h2 class="card-title h4">${i18nInstance.t('feeds')}</h2>
    </div>
  `;
  feedsContainer.append(feedsCard);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.innerHTML = `
      <h3 class="h6 m-0">${feed.title}</h3>
      <p class="m-0 small text-black-50">${feed.description}</p>
    `;
    ul.append(li);
  });
  feedsCard.append(ul);
};

const renderPosts = (state, posts, i18nInstance) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = '';
  const postsCard = document.createElement('div');
  postsCard.classList.add('card', 'border-0');
  postsCard.innerHTML = `
    <div class="card-body">
      <h2 class="card-title h4">${i18nInstance.t('posts')}</h4>
    </div>
  `;
  postsContainer.append(postsCard);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  posts.forEach((post) => {
    const isViewed = state.viewedPostsIds.includes(post.postId);
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.href = post.postLink;
    if (isViewed) {
      a.classList.add('fw-normal', 'link-secondary');
    } else {
      a.classList.add('fw-bold');
    }
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.dataset.id = post.postId;
    a.textContent = post.postTitle;
    li.append(a);
    const demoButton = document.createElement('button');
    demoButton.type = 'button';
    demoButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    demoButton.dataset.bsToggle = 'modal';
    demoButton.dataset.bsTarget = '#modal';
    demoButton.dataset.id = post.postId;
    demoButton.textContent = i18nInstance.t('buttons.view');
    li.append(demoButton);
    a.addEventListener('click', () => {
      if (!isViewed) {
        handleViewPost(state, post);
        a.classList.remove('fw-bold');
        a.classList.add('fw-normal', 'link-secondary');
      }
    });
    demoButton.addEventListener('click', () => {
      if (!isViewed) {
        handleViewPost(state, post);
        a.classList.remove('fw-bold');
        a.classList.add('fw-normal', 'link-secondary');
      }
      const modalTitle = document.querySelector('.modal-title');
      modalTitle.textContent = post.postTitle;
      const modalBody = document.querySelector('.modal-body');
      modalBody.textContent = post.postDescription;
      const fullArticleButton = document.querySelector('.full-article');
      fullArticleButton.setAttribute('href', post.postLink);
      fullArticleButton.textContent = i18nInstance.t('buttons.readArticle');
      const closeButton = document.querySelector('[data-bs-dismiss="modal"]:not([aria-label="Close"])');
      closeButton.textContent = i18nInstance.t('buttons.close');
    });
    ul.append(li);
  });
  postsCard.append(ul);
};

export default (state, i18nInstance) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState':
        renderProcessState(state, value, i18nInstance);
        break;
      case 'form.error':
        renderError(state, value, i18nInstance);
        break;
      case 'feeds':
        renderFeeds(value, i18nInstance);
        break;
      case 'posts':
        renderPosts(state, value, i18nInstance);
        break;
      default:
        throw new Error(`Unexpected state: ${path}`);
    }
  });
  return watchedState;
};
