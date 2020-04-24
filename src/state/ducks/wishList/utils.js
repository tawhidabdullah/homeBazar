export function productPositionInWishList(wishList, productId) {
  return wishList.map(item => item).indexOf(productId);
}
