import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { numberWithCommas } from '../../utils';
import { cartOperations, cartSelectors } from '../../state/ducks/cart';
import CartItem from './CartItem';
import { useHandleFetch } from '../../hooks';

interface Props {
  history: any;
  removeFromCart: (object) => void;
  changeQuantity: (object, number) => void;
  clearCart: () => void;
  totalPrice: number;
  cartItems: any;
  session: any;
}

const ShoppingCart = ({
  history,
  removeFromCart,
  totalPrice,
  changeQuantity,
  cartItems,
  clearCart,
  session,
}: Props) => {
  const [show, setShow] = useState(false);

  const [clearCartState, handleClearCartFetch] = useHandleFetch(
    [],
    'clearCart'
  );

  const handleClose = () => {
    setShow(false);
  };

  const handleLogin = () => {
    history.push('/signin');
  };

  const handleClearShoppingCart = async () => {
    const clearCartRes = await handleClearCartFetch({});

    // @ts-ignore
    if (clearCartRes && clearCartRes['status'] === 'ok') {
      clearCart();
    }
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>You are not Authenticated </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          To Checkout any Product You have to be Logged In
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='fixedBoostrapButtonTobePrimaryColor'
            variant='secondary'
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <div
        className='container'
        style={{
          marginBottom: '20px',
        }}
      >
        <div className='card shopping-cart'>
          <div className='card-header text-light shoppingCartAndHeaderBackground'>
            <i className='fa fa-shopping-cart pr-2' aria-hidden='true' />
            Shopping Cart
            <div className='clearfix' />
          </div>
          <div className='card-body'>
            {cartItems.length > 0 ? (
              cartItems.map((cartItem) => (
                <React.Fragment key={cartItem._id}>
                  <CartItem
                    cartItem={cartItem}
                    history={history}
                    changeQuantity={changeQuantity}
                    removeFromCart={removeFromCart}
                  />
                </React.Fragment>
              ))
            ) : (
              <h1 className=' mt-5 text-center text404'>Your cart is Empty</h1>
            )}
          </div>

          <div className='card-footer shoppingCartCardFooter' style={{}}>
            {cartItems.length > 0 ? (
              <>
                <button
                  className='clear-cart banner-btn'
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/');
                  }}
                >
                  Continue Shopping
                </button>

                <button
                  className='clear-cart banner-btn'
                  onClick={handleClearShoppingCart}
                >
                  Clear Shopping Cart
                </button>

                <button
                  className='clear-cart banner-btn'
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/checkout');
                  }}
                >
                  Checkout
                </button>
              </>
            ) : (
              <a
                href='##'
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/');
                }}
                className='btn btn-primary fixedBoostrapButtonTobePrimaryColor'
              >
                Go Back and Shopping
              </a>
            )}

            <div className='pull-right' style={{ margin: '10px', flexGrow: 1 }}>
              <div className='pull-right' style={{ margin: '5px' }}>
                Total price: <b>৳{numberWithCommas(totalPrice)}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cart,
  totalPrice: cartSelectors.getTotalPriceOfCartItems(state.cart),
  session: state.session,
});

const mapDispatchToProps = {
  removeFromCart: cartOperations.removeFromCart,
  changeQuantity: cartOperations.changeQuantity,
  clearCart: cartOperations.clearCart,
};

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-ignore
)(withRouter(ShoppingCart));
