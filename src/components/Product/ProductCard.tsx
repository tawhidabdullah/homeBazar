import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withAlert } from 'react-alert';
import { cartOperations } from '../../state/ducks/cart';
import { numberWithCommas, checkIfItemExistsInCartItemById } from '../../utils';
import { useHandleFetch } from '../../hooks';

interface Props {
  product: any;
  AddCartContent?: () => void;
  history: any;
  addToCart?: (object, number) => void;
  cartItems?: any;
  alert?: any;
  removeFromCart?: (object) => void;
}

const ProductCard = ({
  product,
  history,
  alert,
  cartItems,
  addToCart,
  removeFromCart,
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

  const handleOnClickAddToCart = async () => {
    if (checkIfItemExistsInCartItemById(cartItems, id)) {
      const removeFromCartRes = await handleRemoveFromCartFetch({
        urlOptions: {
          placeHolders: {
            id,
          },
        },
      });

      // @ts-ignore
      if (removeFromCartRes) {
        removeFromCart && removeFromCart(product);
        alert.success('Product Has Been Removed From the Cart');
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
            <i className='fa fa-shopping-cart'></i>
          </button>
        </div>
      </div>

      <div className='product-bottom text-center'>
        <div className='cart-btn' onClick={handleOnClickAddToCart}>
          <button className='primary-btn'>
            {(checkIfItemExistsInCartItemById(cartItems, id) && (
              <span className='product-bottom-iconText'>
                <i className='fa fa-shopping-cart'></i>
                Added
              </span>
            )) || (
              <span className='product-bottom-iconText'>
                <i className='fa fa-cart-plus'></i>
                Add to cart
              </span>
            )}
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
});

const mapDispatchToProps = {
  removeFromCart: cartOperations.removeFromCart,
  addToCart: cartOperations.addToCart,
};

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-ignore
)(withRouter(withAlert()(ProductCard)));
