import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { wishListOperations } from '../../../state/ducks/wishList';
import { withRouter } from 'react-router-dom';
import SmallItem from '../../../components/SmallItem';
import { useHandleFetch } from '../../../hooks';
import { withAlert } from 'react-alert';
import { Spinner } from '../../../components/Loading';


interface Props {
  wishList: any;
  removeFromWishList: (object) => void;
  addWishlist: (any) => void;
  alert?: any;
  history: any;
}

const Wishlist = ({ wishList, alert, history, addWishlist }: Props) => {

  const [wishlistState, handlewishlistStateFetch] = useHandleFetch(
    [],
    'getWishlist'
  );

  useEffect(() => {
    const getWishList = async () => {
      const wishlist = await handlewishlistStateFetch({});
      // @ts-ignore
      if (wishlist) {
        addWishlist(wishlist)
      }
    }

    getWishList();
  }, [])


  return (
    <div className='order'>
      <div
        className='block-title ordertitle'
        style={{
          marginBottom: '20px',
        }}
      >
        <span>Wishlist</span>
      </div>

      {wishlistState.done && wishList.length > 0 &&
        wishList.map((productId) => {
          return (
            <div className='orderDetailProduct'>
              <SmallItem
                alert={alert}
                productId={productId}
                isOrderDetails={true}
                isWishlist={true}
                history={history}
              />
            </div>
          );
        })}

      {wishlistState.isLoading && <Spinner />}
      {wishlistState.done && !(wishList.length > 0) && <h2>Wishlist is empty</h2>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  wishList: state.wishList,
});

const mapDispatchToProps = {
  removeFromWishList: wishListOperations.removeFromWishList,
  addWishlist: wishListOperations.addWishlist,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withAlert()(Wishlist)));
