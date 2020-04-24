// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Spinner } from '../components/Loading';
import { useHandleFetch } from '../hooks';
import { sessionOperations } from '../state/ducks/session';

import Order from './components/Order';
import MyAccount from './components/MyAccount';
import Wishlist from './components/Wishlist';

const Dashboard = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [customerDetailState, handleCustomerDetailFetch] = useHandleFetch(
    {},
    'getCurrentCustomerData'
  );

  useEffect(() => {
    const getCheckAndSetCustomerData = async () => {
      setIsLoading(true);
      const customerData = await handleCustomerDetailFetch({});
      // @ts-ignore
      if (!Object.keys(customerData).length > 0) {
        props.history.push('/signin');
        props.logout();
      } else {
        if (!props.session.isAuthenticated) {
          props.login();
        }
      }
      setIsLoading(false);
    };
    getCheckAndSetCustomerData();
  }, [props.session]);

  const [tabs, settabs] = React.useState({
    isMyAccount: true,
    isOrders: false,
    isWishlist: false,
  });

  const toggleTabs = (tabName) => {
    const tempTabs = { ...tabs };
    const tbsMap = Object.keys(tempTabs);
    tbsMap.forEach((tb) => {
      if (tb === tabName) {
        tempTabs[tb] = true;
      } else tempTabs[tb] = false;
    });
    settabs({ ...tabs, ...tempTabs });
  };

  return (
    <>
      {!isLoading && (
        <div className='container__of-dashboard'>
          <div className='content'>
            <nav className='sidebar'>
              <ul className='side-nav'>
                <li
                  className={
                    tabs.isMyAccount
                      ? 'side-nav__item side-nav__item--active'
                      : ' side-nav__item'
                  }
                  onClick={() => toggleTabs('isMyAccount')}
                >
                  <a href='##' className='side-nav__link'>
                    <i className='fa fa-user'></i>
                    <span className='side-nav__text'>My Accounts</span>
                  </a>
                </li>

                <li
                  className={
                    tabs.isOrders
                      ? 'side-nav__item side-nav__item--active'
                      : ' side-nav__item'
                  }
                  onClick={() => toggleTabs('isOrders')}
                >
                  <a href='##' className='side-nav__link'>
                    <i className='fa fa-first-order'></i>
                    <span className='side-nav__text'>Orders</span>
                  </a>
                </li>

                <li
                  className={
                    tabs.isWishlist
                      ? 'side-nav__item side-nav__item--active'
                      : ' side-nav__item'
                  }
                  onClick={() => toggleTabs('isWishlist')}
                >
                  <a href='##' className='side-nav__link'>
                    <i className='fa fa-first-order'></i>
                    <span className='side-nav__text'>Wishlist</span>
                  </a>
                </li>
              </ul>
            </nav>
            <main className='dashboard__main-content'>
              {tabs.isOrders ? <Order /> : ''}
              {tabs.isMyAccount ? (
                <MyAccount customerDetail={customerDetailState.data} />
              ) : (
                ''
              )}

              {tabs.isWishlist ? <Wishlist /> : ''}
            </main>
          </div>
        </div>
      )}
      {isLoading && <Spinner />}
    </>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = {
  logout: sessionOperations.logout,
  login: sessionOperations.login,
};

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-ignore
)(withRouter(Dashboard));
