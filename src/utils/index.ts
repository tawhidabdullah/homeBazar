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

export const checkIfTheWishListExistsInArrayById: (
  array: any[] | [],
  id: number | string
) => boolean = (array: any[] | [], id: number | string) => {
  if (!(array.length > 0)) return false;

  const item = array.find((item) => item === id);

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

export const getDeliveryChargeTotal = (delivery, totalPrice) => {
  let deliveryAmount = Object.keys(delivery.charge);
  deliveryAmount.sort((a: any, b: any) => a - b);

  let deliveryCharge;

  // get the delivery charge according to totalPrice

  if (totalPrice < deliveryAmount[0]) {
    console.log('lit');
    return 'Minium order amount is ' + deliveryCharge[0];
  } else if (totalPrice >= deliveryAmount[deliveryAmount.length - 1]) {
    // higher than all amount
    deliveryCharge = delivery.charge[deliveryAmount.length - 1];
  } else {
    // iterate through all items

    for (let index in deliveryAmount) {
      // check if price is between the current amount and the next

      if (
        totalPrice >= deliveryAmount[index] &&
        totalPrice < deliveryAmount[+index + 1]
      ) {
        // set the charge of the amount as delivery charge
        deliveryCharge = delivery.charge[deliveryAmount[index]];
        break;
      }
    }
  }

  return deliveryCharge;
};
