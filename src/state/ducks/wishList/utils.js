export function productPositionInWishList(wishList, product) {
  return wishList.map(item => item.id).indexOf(product.id);
}
