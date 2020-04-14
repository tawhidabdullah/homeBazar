export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const urlToString = (url) => {
  return url
    .split('/')
    .join('')
    .split(':')
    .join('')
    .split('.')
    .join()
    .split(',')
    .join('');
};

export const isValuesEmpty = (values) => {
  const keysOfValus = Object.values(values);

  if (!(Object.keys(values).length > 0)) return true;
  let isEmpty = false;

  keysOfValus.forEach((value) => {
    if (!value) {
      isEmpty = true;
    }
  });

  return isEmpty;
};

export const isObjectEmpty = (value = {}) => {
  return !(Object.keys(value).length > 0);
};

export const checkIfItemExistsInCartItemById: (
  array: any[] | [],
  id: number | string
) => boolean = (array: any[] | [], id: number | string) => {
  if (!(array.length > 0)) return false;

  const item = array.find((item) => item.product.id === id);

  return (!isObjectEmpty(item) && true) || false;
};

export const getCartKeyFromCartItems = (cartItems, productId: string) => {
  const cartItem = cartItems.find(({ product }) => product.id === productId);
  if (!cartItem) {
    return false;
  }
  const cartKey = cartItem['product']['cartKey'];
  return cartKey;
};

export const checkIfItemExistsInCache = (key: string, cache: any) => {
  if (cache[key]) {
    return true;
  }
  return false;
};
