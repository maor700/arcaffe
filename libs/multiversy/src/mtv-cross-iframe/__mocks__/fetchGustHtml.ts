export const URL_TYPES = {
  normalHTML: 'normalHTML',
  HTMLWithoutHeadTag: 'HTMLWithoutHeadTag',
  wrongHTML: 'wrongHTML',
  notExistUrl: 'notExistUrl',
};

const HTML = `<html><head></head><body>TEST</body></html>`;

export const fetchGustHtml = async (url: string) => {
  switch (url) {
    case URL_TYPES.HTMLWithoutHeadTag:
      return HTML.replace('<head></head>', '');
    case URL_TYPES.wrongHTML:
      return 'some worng html format';
    case URL_TYPES.notExistUrl:
      throw "Page not found";
    case URL_TYPES.normalHTML:
    default:
      return HTML;
  }
};
