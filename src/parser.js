// @ts-check

import _ from 'lodash';

export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const channel = doc.querySelector('channel');
  const channelItems = [...channel.querySelectorAll('item')];
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;
  const id = _.uniqueId();
  const posts = channelItems.map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const postLink = item.querySelector('link').textContent;
    const postId = _.uniqueId();
    return {
      postTitle, postDescription, postLink, postId,
    };
  });
  return {
    feedInfo: {
      title, description, id,
    },
    posts,
  };
};
