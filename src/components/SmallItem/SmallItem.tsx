import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { numberWithCommas } from '../../utils';
import { withRouter } from 'react-router';
import ContentLoader from 'react-content-loader';
import { useHandleFetch } from '../../hooks';
import { wishListOperations } from '../../state/ducks/wishList';

interface Props {
  isOrderDetails?: boolean;
  productId?: string;
  history?: any;
  productItem?: any;
  quantity?: number;
  isOrder?: boolean;
  isWishlist?: boolean;
  wishList?: any;
  removeFromWishList?: (object) => void;
  alert?: any;
}

const SmallItem = ({
  isOrderDetails,
  productItem,
  productId,
  history,
  quantity,
  isOrder,
  isWishlist,
  removeFromWishList,
  alert,
}: Props) => {
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [productDetailState, handleProductFetch] = useHandleFetch(
    {},
    'productDetailById'
  );

  const [
    removeFromWishlistState,
    handleRemoveFromWishlistFetch,
  ] = useHandleFetch([], 'removeFromWishlist');

  useEffect(() => {
    if (isOrderDetails) {
      setIsLoading(true);
      const getAndSetProduct = async () => {
        const product = await handleProductFetch({
          urlOptions: {
            placeHolders: {
              id: productId,
            },
          },
        });

        // @ts-ignore
        setProduct(product);
        setIsLoading(false);
      };
      getAndSetProduct();
    }
  }, [isOrderDetails]);

  const handleRemoveFromWishiist = async () => {
    const removeFromWishListRes = await handleRemoveFromWishlistFetch({
      urlOptions: {
        placeHolders: {
          id: productId,
        },
      },
    });

    // @ts-ignore
    if (removeFromWishListRes && removeFromWishListRes['status'] === 'ok') {
      alert.success('Removed From wishlist Successfully!');
      removeFromWishList && removeFromWishList(productId);
    }
  };

  return isOrderDetails ? (
    (product && Object.keys(product).length > 0 && (
      <div key={product['id']} className='small-product-item'>
        <div
          className='small-product-item-box-img'
          onClick={() => {
            history.push(product['url']);
          }}
        >
          <img
            src={product['cover']}
            className='product photo product-item-photo'
            alt=''
          />
        </div>
        <div className='small-product-info'>
          <h2 className='small-product-title'>{product['name']}</h2>

          {parseInt(product['offerPrice']) ? (
            <h2 className='small-product-offerPrice small-product-offerPrice-dark '>
              ৳{numberWithCommas(product['offerPrice'])}
            </h2>
          ) : (
            <h2 className='small-product-offerPrice small-product-offerPrice-dark '>
              ৳{numberWithCommas(product['regularPrice'])}
            </h2>
          )}

          {!isWishlist && (
            <h2 className='small-product-offerPrice'>Quantity : {quantity}</h2>
          )}

          {isWishlist && (
            <span className='remove-item' onClick={handleRemoveFromWishiist}>
              <i
                className='fa fa-trash'
                style={{
                  marginTop: '7px',
                  fontSize: '19px',
                }}
              ></i>
            </span>
          )}
        </div>
      </div>
    )) ||
      (isLoading && <ContentLoader />)
  ) : (
    <div key={productItem.id} className='small-product-item'>
      <div
        className='small-product-item-box-img'
        onClick={() => {
          history.push(productItem.url);
        }}
      >
        <img
          src={productItem.cover}
          className='product photo product-item-photo'
          alt=''
        />
      </div>
      <div className='small-product-info'>
        <h2
          className='small-product-title'
          onClick={() => {
            history.push(productItem.url);
          }}
        >
          {productItem.name}
        </h2>

        {!isOrder && parseInt(productItem.offerPrice) ? (
          <h2 className='small-product-offerPrice'>
            ৳{numberWithCommas(productItem.offerPrice)}
          </h2>
        ) : (
          <h2 className='small-product-offerPrice'>
            ৳{numberWithCommas(productItem.price)}
          </h2>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  wishList: state.wishList,
});

const mapDispatchToProps = {
  addToWishList: wishListOperations.addToWishList,
  removeFromWishList: wishListOperations.removeFromWishList,
};

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(SmallItem);
