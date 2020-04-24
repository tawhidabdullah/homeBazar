import React from 'react';
import { numberWithCommas } from '../../utils';
import { withRouter } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { connect } from 'react-redux';
import { withAlert } from 'react-alert';
import { cartOperations } from '../../state/ducks/cart';
import { wishListOperations } from '../../state/ducks/wishList';
import {
  checkIfItemExistsInCartItemById,
  getCartKeyFromCartItems,
  checkIfTheWishListExistsInArrayById,
} from '../../utils';
import { useHandleFetch } from '../../hooks';

// import responsive carousel
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'react-multi-carousel/lib/styles.css';

interface Props {
  product: any;
  history: any;
  addToCart?: (object, number) => void;
  cartItems: any;
  wishList: any;
  alert: any;
  removeFromCart: (object) => void;
  addToWishList: (object) => void;
  removeFromWishList: (object) => void;
  session?: any;
}

const ProductDetailContent = ({
  product,
  history,
  addToCart,
  cartItems,
  alert,
  removeFromCart,
  removeFromWishList,
  addToWishList,
  wishList,
  session,
}: Props) => {
  const {
    name,
    regularPrice,
    description,
    image,
    offerPrice,
    brand,
    category,
    tags,
    id,
    unit,
    cover,
    url,
    availableStock,
    minimumStock,
  } = product;

  const [addToCartState, handleAddtoCartFetch] = useHandleFetch(
    [],
    'addtoCart'
  );

  const [removeFromCartState, handleRemoveFromCartFetch] = useHandleFetch(
    [],
    'removeFromCart'
  );

  const [addWishlistState, handleAddWishlistFetch] = useHandleFetch(
    [],
    'addWishlist'
  );
  const [
    removeFromWishlistState,
    handleRemoveFromWishlistFetch,
  ] = useHandleFetch([], 'removeFromWishlist');

  const handleOnClickAddToCart = async () => {
    if (checkIfItemExistsInCartItemById(cartItems, id)) {
      const cartKey = getCartKeyFromCartItems(cartItems, id);
      if (cartKey) {
        const removeFromCartRes = await handleRemoveFromCartFetch({
          urlOptions: {
            placeHolders: {
              cartKey,
            },
          },
        });

        // @ts-ignore
        if (removeFromCartRes) {
          removeFromCart && removeFromCart(product);
          alert.success('Product Has Been Removed From the Cart');
        }
      }
    } else {
      const addToCartRes = await handleAddtoCartFetch({
        urlOptions: {
          placeHolders: {
            id,
          },
        },
      });

      // @ts-ignore
      if (addToCartRes) {
        const product = {
          name: addToCartRes['name'],
          cover: addToCartRes['cover'],
          price:
            addToCartRes['offerPrice'] && parseInt(addToCartRes['offerPrice'])
              ? parseInt(addToCartRes['offerPrice'])
              : parseInt(addToCartRes['regularPrice']),
          id: addToCartRes['id'],
          url: addToCartRes['url'],
          cartKey: addToCartRes['cartKey'],
        };
        addToCart && addToCart(product, addToCartRes['quantity']);
        alert.success('Product Added To The Cart');
      }
    }
  };

  const handleOnClickToWishlist = async () => {
    if (checkIfTheWishListExistsInArrayById(wishList, id)) {
      const removeFromWishListRes = await handleRemoveFromWishlistFetch({
        urlOptions: {
          placeHolders: {
            id,
          },
        },
      });

      // @ts-ignore
      if (removeFromWishListRes && removeFromWishListRes['status'] === 'ok') {
        alert.success('Removed From wishlist Successfully!');
        removeFromWishList && removeFromWishList(id);
      }
    } else {
      const addWishlistRes = await handleAddWishlistFetch({
        body: {
          item: id,
        },
      });

      // @ts-ignore
      if (addWishlistRes && addWishlistRes['status'] === 'ok') {
        alert.success('Added to wishlist Successfully!');
        addToWishList && addToWishList(id);
      }
    }
  };

  return (
    <>
      <div className='col-md-6 productDetailInfo-carousel-column'>
        <Carousel showArrows={false} showIndicators={false} showStatus={false}>
          {image &&
            image.length > 0 &&
            image.map((src) => {
              return (
                <div
                  style={{
                    maxHeight: '600px',
                  }}
                  key={src}
                >
                  <img
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                    src={src}
                    alt='Product Img'
                  />
                </div>
              );
            })}
        </Carousel>
      </div>
      <div className='col-md-6'>
        <div className='productInfo__container'>
          <h2 className='productInfo__title'>{name}</h2>
          <span
            style={{
              display: 'inline-block',
              background: '#eee',
              padding: '3px 5px',
              borderRadius: 1,
              fontSize: '15px',
              marginTop: '7px',
            }}
          >
            {unit}
          </span>
          <div className='productInfo__price'>
            <div className='product-price-box'>
              {offerPrice && parseInt(offerPrice) ? (
                <h2 className='special-price'>
                  ৳{numberWithCommas(offerPrice)}
                </h2>
              ) : (
                ''
              )}
              <h2
                className={
                  offerPrice && !parseInt(offerPrice)
                    ? 'special-price'
                    : 'old-price'
                }
              >
                ৳{numberWithCommas(regularPrice)}
              </h2>
            </div>

            {brand && brand.length > 0 && (
              <div className='attibutes'>
                {brand && brand.length > 0 && 'Brand :'}
                {brand.map((item) => (
                  <span key={item.name} className='attibute'>
                    {item.name},
                  </span>
                ))}
              </div>
            )}

            {category && category.length > 0 && (
              <div className='attibutes'>
                {category && category.length > 0 && 'Category :'}
                {category.map((item) => (
                  <span
                    key={item.name}
                    className='attibute'
                    onClick={() => {
                      history.push({
                        pathname: `/productList/${item.id}`,
                        state: { isCategory: true },
                      });
                    }}
                  >
                    {item.name},
                  </span>
                ))}
              </div>
            )}

            {tags && tags.length > 0 && (
              <div className='attibutes'>
                {tags && tags.length > 0 && 'Tags :'}
                {tags.map((item) => (
                  <span
                    key={item.name}
                    className='attibute'
                    onClick={() => {
                      history.push({
                        pathname: `/productList/${item.id}`,
                        state: { isTag: true },
                      });
                    }}
                  >
                    {item.name},
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className='product-description'>
            <p>{description}</p>
          </div>
          <div className='product-options-bottom'>
            {parseInt(availableStock) === 0 ? (
              <div className='alertText'>
                <i className='fa fa-exclamation-circle'></i>
                <h3>This product is out of stock</h3>
              </div>
            ) : (
              <>
                <a
                  className='action-button'
                  onClick={handleOnClickAddToCart}
                  href='##'
                >
                  {!addToCartState.isLoading &&
                    !removeFromCartState.isLoading && (
                      <>
                        {(checkIfItemExistsInCartItemById(cartItems, id) && (
                          <span className='product-bottom-iconText'>
                            🐎 Added
                          </span>
                        )) || (
                          <span className='product-bottom-iconText'>
                            🐎 Add to cart
                          </span>
                        )}
                      </>
                    )}

                  {addToCartState.isLoading && '🐎 Adding...'}
                  {removeFromCartState.isLoading && '🐎 Removing...'}
                </a>

                {session.isAuthenticated && (
                  <a
                    className='action-button'
                    onClick={handleOnClickToWishlist}
                    href='##'
                  >
                    {!addWishlistState.isLoading &&
                      !removeFromWishlistState.isLoading && (
                        <>
                          {(checkIfTheWishListExistsInArrayById(
                            wishList,
                            id
                          ) && (
                            <span className='product-bottom-iconText'>
                              ❤️ Added
                            </span>
                          )) || (
                            <span className='product-bottom-iconText'>
                              ❤️ Add to Wishlist
                            </span>
                          )}
                        </>
                      )}

                    {addWishlistState.isLoading && '🐎 Adding...'}
                    {removeFromWishlistState.isLoading && '🐎 Removing...'}
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cart,
  wishList: state.wishList,
  session: state.session,
});

const mapDispatchToProps = {
  addToCart: cartOperations.addToCart,
  removeFromCart: cartOperations.removeFromCart,
  addToWishList: wishListOperations.addToWishList,
  removeFromWishList: wishListOperations.removeFromWishList,
};

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-ignore
)(withRouter(withAlert()(ProductDetailContent)));
