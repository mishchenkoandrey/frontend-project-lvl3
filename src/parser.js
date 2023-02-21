// @ts-check
import _ from 'lodash';

export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const channel = doc.querySelector('channel');
  if (channel) {
    const channelItems = [...channel.querySelectorAll('item')];
    const titleEl = channel.querySelector('title');
    const descriptionEl = channel.querySelector('description');
    if (titleEl && descriptionEl) {
      const title = titleEl.textContent;
      const description = descriptionEl.textContent;
      const id = _.uniqueId();
      const posts = channelItems.map((item) => {
        const postTitleEl = item.querySelector('title');
        const postDescriptionEl = item.querySelector('description');
        const postLinkEl = item.querySelector('link');
        if (postTitleEl && postDescriptionEl && postLinkEl) {
          const postTitle = postTitleEl.textContent;
          const postDescription = postDescriptionEl.textContent;
          const postLink = postLinkEl.textContent;
          const postId = _.uniqueId();
          return {
            postTitle, postDescription, postLink, postId,
          };
        } return null;
      });
      return {
        feedInfo: {
          title, description, id,
        },
        posts,
      };
    } return null;
  } return null;
};
