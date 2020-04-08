import React, { useState, useEffect } from 'react';
import { numberWithCommas } from '../../utils';
import { useHandleFetch } from '../../hooks';

interface Props {
  history: any;
  cartItem: any;
  removeFromCart: (object) => void;
  changeQuantity: (object, number) => void;
}

const CartItem = ({
  history,
  cartItem,
  removeFromCart,
  changeQuantity,
}: Props) => {
  let { product, quantity } = cartItem;
  const { url, cover, name, price, cartKey, id } = product;

  const [removeFromCartState, handleRemoveFromCartFetch] = useHandleFetch(
    [],
    'removeFromCart'
  );

  const [updateCartItemState, handleUpdateCartItemFetch] = useHandleFetch(
    [],
    'updateCartItem'
  );

  const [quantityValue, setQuantityValue] = useState(quantity);
  const handleChangeQuantity = async (value) => {
    if (value === 'minus') {
      if (quantity === 1) {
        return;
      }

      const updateCartItemRes = await handleUpdateCartItemFetch({
        urlOptions: {
          placeHolders: {
            cartKey,
          },
        },
        body: {
          quantity: --quantity,
        },
      });

      // @ts-ignore
      if (updateCartItemRes) {
        return changeQuantity(product, updateCartItemRes['quantity']);
      }
    } else {
      const updateCartItemRes = await handleUpdateCartItemFetch({
        urlOptions: {
          placeHolders: {
            cartKey,
          },
        },
        body: {
          quantity: ++quantity,
        },
      });

      // @ts-ignore
      if (updateCartItemRes) {
        return changeQuantity(product, updateCartItemRes['quantity']);
      }
    }
  };

  const handleRemoveFromCart = async () => {
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
    }
  };

  useEffect(() => {
    if (quantityValue > 1) {
      const updateQuantity = async () => {
        const updateCartItemRes = await handleUpdateCartItemFetch({
          urlOptions: {
            placeHolders: {
              cartKey,
            },
          },
          body: {
            quantity: quantityValue,
          },
        });

        // @ts-ignore
        if (updateCartItemRes) {
          return changeQuantity(product, updateCartItemRes['quantity']);
        }
      };

      updateQuantity();
    }
  }, [quantityValue]);
  return (
    <div className='row align-items-center mb-3'>
      <div
        className='col-12 col-sm-12 col-md-2 text-center'
        style={{
          cursor: 'pointer',
        }}
      >
        <img
          onClick={() => {
            history.push(url);
          }}
          className='img-responsive'
          src={cover}
          style={{ height: '60%', width: '60%' }}
          alt={"cart's product"}
        />
      </div>
      <div className='col-12 text-sm-center col-sm-12 text-md-left col-md-6'>
        <h4
          className='product-name'
          style={{
            color: '#333',
            fontWeight: 700,
          }}
        >
          <strong>{name}</strong>
        </h4>
      </div>
      <div className='col-12 col-sm-12 text-sm-center col-md-4 text-md-right row product-quantity-container align-items-center'>
        <div
          className='col-6 col-sm-6 col-md-6 text-md-right'
          style={{ paddingTop: '5px' }}
        >
          <h6>
            <strong>
              {numberWithCommas(price)}৳ <span className='text-muted'>x</span>
            </strong>
          </h6>
        </div>
        <div className='col-4 col-sm-4 col-md-4'>
          <div className='quantity'>
            {/* <input
              onClick={(e) => {
                handleChangeQuantity('plus');
              }}
              type='button'
              value='+'
              className='plus'
            /> */}
            <input
              onChange={(e) => setQuantityValue(e.target.value)}
              type='text'
              value={quantityValue}
              title='Qty'
              className='qty'
              size={4}
            />
            {/* <input
              onClick={() => {
                handleChangeQuantity('minus');
              }}
              type='button'
              value='-'
              className='minus'
            /> */}
          </div>
        </div>
        <div className='col-2 col-sm-2 col-md-2 text-right'>
          <button
            onClick={handleRemoveFromCart}
            type='button'
            className='btn btn-outline-danger btn-xs'
          >
            <i className='fa fa-trash' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

const x = {
  _id: '5e8a3ebc6b773f141fa6a4c6',
  customer: '5e82d26c8e371827b0c6fa94',
  items: [
    {
      quantity: 2,
      _id: '5e50e02580e719cc127bdbe6',
      name: 'Nourishing Body Oil',
      price: { regular: '870', offer: '870' },
      attributes: [],
      cover: {
        _id: '5e50dffb80e719cc127bdbe2',
        name: 'body-oil.jpg',
        original: '/images/library/original/371830-body-oil.jpg',
        medium: '/images/library/medium/371830-body-oil.jpg',
        thumbnail: '/images/library/thumbnail/371830-body-oil.jpg',
        icon: '/images/library/icon/371830-body-oil.jpg',
        title: '',
        alt: '',
        labels: [],
        caption: '',
      },
      url: '/product/kidz-style/nourishing-body-oil',
      addedToCart: '2020-04-05T20:12:59.015Z',
      cartKey: 'cartKey-357281586117579015',
    },
    {
      quantity: 6,
      _id: '5e50deed80e719cc127bdbe1',
      name: 'Sweet Almond Oil',
      price: { regular: '975', offer: '975' },
      attributes: [],
      cover: {
        _id: '5e50debf80e719cc127bdbdd',
        name: 'lady-oil.jpg',
        original: '/images/library/original/905051-lady-oil.jpg',
        medium: '/images/library/medium/905051-lady-oil.jpg',
        thumbnail: '/images/library/thumbnail/905051-lady-oil.jpg',
        icon: '/images/library/icon/905051-lady-oil.jpg',
        title: '',
        alt: '',
        labels: [],
        caption: '',
      },
      url: '/product/womenz-style/sweet-almond-oil',
      addedToCart: '2020-04-05T20:16:32.913Z',
      cartKey: 'cartKey-635801586117792913',
    },
    {
      quantity: 1,
      _id: '5e50db8580e719cc127bdbd0',
      name: 'Dove Men Deodorant',
      price: { regular: '550', offer: '550' },
      attributes: [],
      cover: {
        _id: '5e50db6280e719cc127bdbcb',
        name: 'menz-bodyspay-6.jpg',
        original: '/images/library/original/274100-menz-bodyspay-6.jpg',
        medium: '/images/library/medium/274100-menz-bodyspay-6.jpg',
        thumbnail: '/images/library/thumbnail/274100-menz-bodyspay-6.jpg',
        icon: '/images/library/icon/274100-menz-bodyspay-6.jpg',
        title: '',
        alt: '',
        labels: [],
        caption: '',
      },
      url: '/product/menz-style/dove-men-deodorant',
      addedToCart: '2020-04-05T20:17:51.078Z',
      cartKey: 'cartKey-61891586117871078',
    },
    {
      quantity: 3,
      _id: '5e50deed80e719cc127bdbe1',
      name: 'Sweet Almond Oil',
      price: { regular: '975', offer: '975' },
      attributes: [],
      cover: {
        _id: '5e50debf80e719cc127bdbdd',
        name: 'lady-oil.jpg',
        original: '/images/library/original/905051-lady-oil.jpg',
        medium: '/images/library/medium/905051-lady-oil.jpg',
        thumbnail: '/images/library/thumbnail/905051-lady-oil.jpg',
        icon: '/images/library/icon/905051-lady-oil.jpg',
        title: '',
        alt: '',
        labels: [],
        caption: '',
      },
      url: '/product/womenz-style/sweet-almond-oil',
      addedToCart: '2020-04-05T20:18:11.482Z',
      cartKey: 'cartKey-654261586117891482',
    },
    {
      quantity: 1,
      _id: '5e50faa680e719cc127bdc0c',
      name: 'Maybelline SuperStay Matte Ink Liquid Lipstick',
      price: { regular: '1170', offer: '1170' },
      attributes: [],
      cover: {
        _id: '5e50fa8680e719cc127bdc08',
        name: 'lipstick-10.jpg',
        original: '/images/library/original/739820-lipstick-10.jpg',
        medium: '/images/library/medium/739820-lipstick-10.jpg',
        thumbnail: '/images/library/thumbnail/739820-lipstick-10.jpg',
        icon: '/images/library/icon/739820-lipstick-10.jpg',
        title: '',
        alt: '',
        labels: [],
        caption: '',
      },
      url:
        '/product/womenz-style/maybelline-superstay-matte-ink-liquid-lipstick',
      addedToCart: '2020-04-05T20:25:32.190Z',
      cartKey: 'cartKey-544261586118332190',
    },
    {
      quantity: 1,
      _id: '5e50fbaf80e719cc127bdc11',
      name: 'Lung Cleanse & Fast Quit Smoking Aid',
      price: { regular: '2900', offer: '2700' },
      attributes: [],
      cover: {
        _id: '5e50fb9480e719cc127bdc0d',
        name: 'stop-smoking.jpg',
        original: '/images/library/original/216235-stop-smoking.jpg',
        medium: '/images/library/medium/216235-stop-smoking.jpg',
        thumbnail: '/images/library/thumbnail/216235-stop-smoking.jpg',
        icon: '/images/library/icon/216235-stop-smoking.jpg',
        title: '',
        alt: '',
        labels: [],
        caption: '',
      },
      url: '/product/menz-style/lung-cleanse-&-fast-quit-smoking-aid',
      addedToCart: '2020-04-05T20:25:33.336Z',
      cartKey: 'cartKey-524841586118333336',
    },
  ],
};
