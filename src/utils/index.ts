export const numberWithCommas = (x) => {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  }
  else return x;
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

export const deleteCity = async () => {
  await localStorage.removeItem('city');
}


export const saveCity = async (city) => {
  if (city) {
    const preCity = await localStorage.getItem('city');
    if (preCity) {
      await deleteCity();
      await localStorage.setItem('city', city);
    }
    else {
      await localStorage.setItem('city', city);
    }

  }
}


export const getCity = async () => {
  const city = await localStorage.getItem('city');
  if (!city) {
    return false;
  }
  return city;
}


export const deleteCustomerData = async () => {
  await localStorage.removeItem('customerData');
}


export const saveCustomerData = async (customerData) => {
  if (customerData) {
    const preCustomerData = await localStorage.getItem('customerData');
    // @ts-ignore
    if (!JSON.parse(preCustomerData)) {
      await localStorage.setItem('customerData', JSON.stringify(customerData));
    }
    else {
      await deleteCustomerData();
      await localStorage.setItem('customerData', JSON.stringify(customerData));
    }

  }
}


export const getCustomerData = async () => {
  const customerData = await localStorage.getItem('customerData');
  // @ts-ignore
  if (!JSON.parse(customerData)) {
    return false;
  }
  // @ts-ignore

  return JSON.parse(customerData);
}
