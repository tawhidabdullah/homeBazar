import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withAlert } from 'react-alert';
import { cartOperations } from '../../state/ducks/cart';
import { wishListOperations } from '../../state/ducks/wishList';

import {
  numberWithCommas,
  checkIfItemExistsInCartItemById,
  getCartKeyFromCartItems,
  checkIfTheWishListExistsInArrayById,
} from '../../utils';
import { useHandleFetch } from '../../hooks';

interface Props {
  product: any;
  AddCartContent?: () => void;
  history: any;
  addToCart?: (object, number) => void;
  alert?: any;
  cartItems?: any;
  removeFromCart?: (object) => void;
  wishList: any;
  addToWishList: (object) => void;
  removeFromWishList: (object) => void;
}

const ProductCard = ({
  product,
  history,
  alert,
  cartItems,
  addToCart,
  removeFromCart,
  wishList,
  addToWishList,
  removeFromWishList,
}: Props) => {
  const { name, regularPrice, cover, url, id, offerPrice } = product;

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
              ? addToCartRes['offerPrice']
              : addToCartRes['regularPrice'],
          id: addToCartRes['id'],
          url: addToCartRes['url'],
          cartKey: addToCartRes['cartKey'],
        };
        addToCart && addToCart(product, addToCartRes['quantity']);
        alert.success('Product Added To The Cart');
      }
    }
  };

  const handleOnClickWishlist = async () => {
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

  useEffect(() => {
    if (
      addWishlistState['error']['isError'] &&
      Object.keys(addWishlistState['error']['error']).length > 0
    ) {
      alert.error('Signin to use wishlist');
    }
  }, [addWishlistState]);

  return (
    <div className='product-card'>
      <div className='product-top'>
        <img src={cover} alt='product img' />
        <div className='product-top-overlay'></div>

        <div className='overlay-right'>
          <button
            onClick={() => {
              history.push(url);
            }}
            type='button'
            className='btn btn-secondary'
            title={`see ${name}`}
          >
            <i className='fa fa-eye'></i>
          </button>
          <button
            type='button'
            className='btn btn-secondary'
            title='Add To Cart'
            onClick={handleOnClickAddToCart}
          >
            {checkIfItemExistsInCartItemById(cartItems, id) && (
              <i className='fa fa-shopping-cart'></i>
            )}
            {!checkIfItemExistsInCartItemById(cartItems, id) && (
              <i
                style={{
                  color: '#777',
                }}
                className='fa fa-shopping-cart'
              ></i>
            )}
          </button>
          <button
            type='button'
            className='btn btn-secondary'
            title='Add To Wishlist'
            onClick={handleOnClickWishlist}
          >
            {checkIfTheWishListExistsInArrayById(wishList, id) && (
              <i className='fa fa-heart'></i>
            )}
            {!checkIfTheWishListExistsInArrayById(wishList, id) && (
              <i
                style={{
                  color: '#777',
                }}
                className='fa fa-heart'
              ></i>
            )}
          </button>
        </div>
      </div>

      <div className='product-bottom text-center'>
        <div className='cart-btn' onClick={handleOnClickAddToCart}>
          <button className='primary-btn'>
            {!addToCartState.isLoading && !removeFromCartState.isLoading && (
              <>
                {(checkIfItemExistsInCartItemById(cartItems, id) && (
                  <span className='product-bottom-iconText'>🐎 Added</span>
                )) || (
                  <span className='product-bottom-iconText'>
                    🐎 Add to cart
                  </span>
                )}
              </>
            )}

            {addToCartState.isLoading && '🐎 Adding...'}
            {removeFromCartState.isLoading && '🐎 Removing...'}
          </button>
        </div>

        <div className='ratingsandtitle'>
          <h3 className='product-bottom-title'>{name}</h3>
        </div>
        <h5 className='product-bottom-price'>
          ৳{numberWithCommas(offerPrice ? offerPrice : regularPrice)}
        </h5>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cart,
  wishList: state.wishList,
});

const mapDispatchToProps = {
  removeFromCart: cartOperations.removeFromCart,
  addToCart: cartOperations.addToCart,
  addToWishList: wishListOperations.addToWishList,
  removeFromWishList: wishListOperations.removeFromWishList,
};

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-ignore
)(withRouter(withAlert()(ProductCard)));
