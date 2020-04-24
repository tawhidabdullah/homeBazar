import React from 'react';
import { connect } from 'react-redux';
import { wishListOperations } from '../../../state/ducks/wishList';
import { withRouter } from 'react-router-dom';
import SmallItem from '../../../components/SmallItem';
import { withAlert } from 'react-alert';

interface Props {
  wishList: any;
  removeFromWishList: (object) => void;
  alert?: any;
  history: any;
}

const Wishlist = ({ wishList, removeFromWishList, alert, history }: Props) => {
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

      {wishList.length > 0 &&
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

      {!(wishList.length > 0) && <h2>Wishlist is empty</h2>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  wishList: state.wishList,
});

const mapDispatchToProps = {
  removeFromWishList: wishListOperations.removeFromWishList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withAlert()(Wishlist)));
