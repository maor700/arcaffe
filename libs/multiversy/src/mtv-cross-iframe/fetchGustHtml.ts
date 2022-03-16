export const fetchGustHtml = async (url: string) => {
  return fetch(url).then(res => res.text());
};
