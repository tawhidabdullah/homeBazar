const isObjectEmpty = value => {
  return !value || !Object.keys(value).length > 0;
};

const manupulateURL = (url, urlOptions = {}) => {
  if (isObjectEmpty(urlOptions)) return url;

  const params = urlOptions.params || {};
  const placeHolders = urlOptions.placeHolders || {};



  return url
    .split('/')
    .map(currentValue => {
      if (currentValue.includes(':') && !isObjectEmpty(placeHolders)) {
        let actualPlaceholderValue = placeHolders[currentValue.replace(':', '')];
        currentValue = actualPlaceholderValue;
      }

      if (currentValue.includes('?')) {
        currentValue = currentValue
          .split('&')
          .map(currentValue => {
            const param = currentValue.slice(currentValue.indexOf('=') + 1);
            return currentValue.replace(param, params[param] || '');
          })
          .join('&');
      }
      return currentValue;
    })
    .join('/');
};

export default manupulateURL;
