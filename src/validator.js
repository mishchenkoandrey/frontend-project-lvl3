// @ts-check

import * as yup from 'yup';

export default (link, feeds) => {
  const urls = feeds.map(({ url }) => url);
  const schema = yup.string().required().url().notOneOf(urls);
  try {
    schema.validateSync(link);
    return null;
  } catch (e) {
    return e.message;
  }
};
