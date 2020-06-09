export function getCartItemQuantity(cart, id) {
  return cart.find((item) => item.product.id === id).quantity;
}

export const getTotalPriceOfCartItems = (cartItems) => {
  if (!cartItems.length > 0) {
    return 0;
  }

  const prices = cartItems.map((cartItem) => {
    return cartItem.quantity * parseInt(cartItem.product['price']) || 0;
  });

  const totalPrice = prices.reduce((a, b) => {
    return a + b;
  }, 0);
  return totalPrice;
};
