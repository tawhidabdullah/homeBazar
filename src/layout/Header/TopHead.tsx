import React, { useState, useEffect } from 'react';
import { useFetch, useHandleFetch } from '../../hooks';
import { checkIfItemExistsInCache } from '../../utils';

interface Props {
  history: any;
  isAuthenticated?: boolean;
  logout: () => void;
  addItemToCache: (any) => void;
  cache: any;
  clearCart: () => void;
}

const TopHead = ({
  isAuthenticated,
  history,
  logout,
  addItemToCache,
  cache,
  clearCart,
}: Props) => {
  const [welcomeState, handleWelcomeFetch] = useHandleFetch([], 'welcome');
  const [welcome, setWelcome] = useState([]);

  const [logoutState, handleLogoutFetch] = useHandleFetch({}, 'logout');

  useEffect(() => {
    if (checkIfItemExistsInCache(`welcome`, cache)) {
      const welcome = cache['welcome'];
      setWelcome(welcome);
    } else {
      const getAndSetWelcome = async () => {
        const welcome = await handleWelcomeFetch({});
        // @ts-ignore
        if (welcome) {
          // @ts-ignore
          setWelcome(welcome);
          addItemToCache({
            welcome: welcome,
          });
        }
      };

      getAndSetWelcome();
    }
  }, []);

  const handleLogout = async () => {
    await handleLogoutFetch({});
    clearCart();
    logout();
  };
  return (
    <div className='top-head-1'>
      <div className='top-left-content'>
        <span>
          {Object.keys(welcome).length > 0 ? welcome['text'] : ''}
          {!(Object.keys(welcome).length > 0) && !welcomeState.isLoading
            ? welcome['text']
            : ''}
        </span>
      </div>
      <div className='trackorderandauthlinks'>
        {(isAuthenticated && (
          <>
            <p>
              <i className='fa fa-dashboard'></i>
              <span onClick={() => history.push('/dashboard')}>
                Dashboard
              </span>{' '}
            </p>
            <p>
              <i className='fa fa-user'></i>
              <span onClick={handleLogout}>Logout</span>{' '}
            </p>
          </>
        )) || (
          <p>
            <i className='fa fa-user'></i>
            <span onClick={() => history.push('/signin')}>Signin</span> or{' '}
            <span onClick={() => history.push('/signup')}>Signup</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default TopHead;
