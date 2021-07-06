import onChange from 'on-change';

const input = document.querySelector('.form-control');
const feedback = document.querySelector('.feedback');
const clearFeedback = () => {
  feedback.textContent = '';
  feedback.classList.remove('text-danger', 'text-success');
  input.classList.remove('is-invalid');
};

const toggleForm = (status) => {
  const submitButton = document.querySelector('[type="submit"]');
  /* if (status) {
    submitButton.setAttribute('disabled', status);
    input.setAttribute('readOnly', status);
  } else {
    submitButton.removeAttribute('disabled');
    input.removeAttribute('readOnly');
  } */
  submitButton.disabled = status;
  input.readOnly = status;
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

const buildFeeds = (feeds, i18nInstance) => {
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.innerHTML = `<h2>${i18nInstance.t('feeds')}</h2>`;

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');

  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.dataset.id = feed.id;

    li.innerHTML = `
    <h3>${feed.title}</h3>
    <p>${feed.description}</p>
    `;

    ul.append(li);
  });

  feedsContainer.append(ul);
};

const buildPosts = (state, posts, i18nInstance) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = `<h2>${i18nInstance.t('posts')}</h2>`;

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  posts.forEach((post) => {
    const isViewed = state.uiState.viewedPostsIds.includes(post.postId);

    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    li.dataset.id = post.postId;

    li.innerHTML = `
    <a href="${post.postLink}" class="${isViewed ? 'font-weight-normal' : 'font-weight-bold'}" target="_blank" rel="noopener noreferrer">
      ${post.postTitle}
    </a>
    <button type="button" class="btn btn-primary btn-sm">${i18nInstance.t('buttons.view')}</button>
    `;

    const a = li.querySelector('a');
    const button = li.querySelector('button');

    a.addEventListener('click', () => {
      if (!isViewed) {
        state.uiState.viewedPostsIds.push(post.postId);
      }
    });

    button.addEventListener('click', () => {
      if (!isViewed) {
        state.uiState.viewedPostsIds.push(post.postId);
      }

      // handleViewPost(post);
    });

    ul.append(li);
  });

  postsContainer.append(ul);
};

const render = (state, i18nInstance) => {
  if (state.feeds.length > 0) {
    buildFeeds(state.feeds, i18nInstance);
    buildPosts(state, state.posts, i18nInstance);
  }

  const fullArticleButton = document.querySelector('.full-article');
  // const closeButtons = document.querySelectorAll('[data-dismiss="modal"]');

  fullArticleButton.textContent = i18nInstance.t('buttons.readArticle');
  // closeButtons[1].textContent = "i18nInstance.t('buttons.close')";

  /* closeButtons.forEach((closeButton) => {
    closeButton.addEventListener('click', handleCloseModal);
  }); */
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
      default:
        render(state, i18nInstance);
        break;
    }
  });
  return watchedState;
};
