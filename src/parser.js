// @ts-check

export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const channel = doc.querySelector('channel');
  const channelItems = [...channel.querySelectorAll('item')];
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;
  const posts = channelItems.map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const postLink = item.querySelector('link').textContent;
    return {
      postTitle, postDescription, postLink,
    };
  });
  return {
    feedInfo: {
      title, description,
    },
    posts,
  };
};
