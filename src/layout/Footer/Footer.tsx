// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHandleFetch } from '../../hooks';
import { cacheOperations } from '../../state/ducks/cache';
import { checkIfItemExistsInCache, urlToString } from '../../utils';
import config from '../../config.json';

interface Props {
  addItemToCache: (any) => void;
  cache: any;
}

const Footer = ({ addItemToCache, cache }: Props) => {
  const [addressState, handleAddressFetch] = useHandleFetch({}, 'address');
  const [accountState, handleAccountFetch] = useHandleFetch([], 'Account');
  const [servicesState, handleServicesFetch] = useHandleFetch([], 'Links');
  const [aboutUsState, handleAboutUsFetch] = useHandleFetch([], 'About Us');

  const [address, setAddress] = useState({});
  const [account, setAccount] = useState([]);
  const [services, setServices] = useState([]);
  const [aboutUs, setAboutUs] = useState([]);

  useEffect(() => {
    if (checkIfItemExistsInCache(`address`, cache)) {
      const address = cache['address'];
      setAddress(address);
    } else {
      const getAndSetAddress = async () => {
        const address = await handleAddressFetch({});
        // @ts-ignore
        if (address) {
          // @ts-ignore
          setAddress(address);
          addItemToCache({
            address: address,
          });
        }
      };

      getAndSetAddress();
    }
  }, []);

  useEffect(() => {
    if (checkIfItemExistsInCache(`account`, cache)) {
      const account = cache['account'];
      setAccount(account);
    } else {
      const getAndSetAcccount = async () => {
        const account = await handleAccountFetch({});
        // @ts-ignore
        if (account) {
          // @ts-ignore
          setAccount(account);
          addItemToCache({
            account: account,
          });
        }
      };

      getAndSetAcccount();
    }
  }, []);

  useEffect(() => {
    if (checkIfItemExistsInCache(`Links`, cache)) {
      const services = cache['Links'];
      setServices(services);
    } else {
      const getAndSetServices = async () => {
        const services = await handleServicesFetch({});
        // @ts-ignore
        if (services) {
          // @ts-ignore
          setServices(services);
          addItemToCache({
            services: services,
          });
        }
      };

      getAndSetServices();
    }
  }, []);

  useEffect(() => {
    if (checkIfItemExistsInCache(`aboutUs`, cache)) {
      const aboutUs = cache['aboutUs'];
      setAboutUs(aboutUs);
    } else {
      const getAndSetAboutUs = async () => {
        const aboutUs = await handleAboutUsFetch({});
        // @ts-ignore
        if (aboutUs) {
          // @ts-ignore
          setAboutUs(aboutUs);
          addItemToCache({
            aboutUs: aboutUs,
          });
        }
      };

      getAndSetAboutUs();
    }
  }, []);

  return (
    <footer className='footer'>
      <div className='row'>
        {Object.keys(address).length > 0 && (
          <div className='col-md-3'>
            <div className='our__categories'>
              <span className='widget-title'>Address</span>
              <ul className='footerMenu'>
                <li
                  key={address['name']}
                  className='menu-item menu-item-type-custom menu-item-object-custom menu-item-244'
                >
                  <a href={'##'}>{address['text']}</a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {account.length > 0 && (
          <div className='col-md-3'>
            <div className='our__categories'>
              <span className='widget-title'>Accounts</span>
              <ul className='footerMenu'>
                {account.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className='menu-item menu-item-type-custom menu-item-object-custom menu-item-244'
                    >
                      {urlToString(item['target']).includes(
                        urlToString(config.baseURL2)
                      ) ? (
                          <Link to={item['target'].replace(config.baseURL2, '')}>
                            {item['name']}
                          </Link>
                        ) : (
                          <a href={item['target']}>{item['name']}</a>
                        )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {services.length > 0 && (
          <div className='col-md-3'>
            <div className='our__categories'>
              <span className='widget-title'>Links </span>
              <ul className='footerMenu'>
                {services.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className='menu-item menu-item-type-custom menu-item-object-custom menu-item-244'
                    >
                      {
                        item['name'] && item['name'].toLowerCase() === 'sitemap' ?
                          <a href={item['target']}>{item['name']}</a>
                          :
                          <>
                            {urlToString(item['target']).includes(
                              urlToString(config.baseURL2)
                            ) ? (
                                <Link to={item['target'].replace(config.baseURL2, '')}>
                                  {item['name']}
                                </Link>
                              ) : (
                                <a href={item['target']}>{item['name']}</a>
                              )}
                          </>
                      }

                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {aboutUs.length > 0 && (
          <div className='col-md-3'>
            <div className='our__categories'>
              <span className='widget-title'>About Us</span>
              <ul className='footerMenu'>
                {aboutUs.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className='menu-item menu-item-type-custom menu-item-object-custom menu-item-244'
                    >
                      {urlToString(item['target']).includes(
                        urlToString(config.baseURL2)
                      ) ? (
                          <Link to={item['target'].replace(config.baseURL2, '')}>
                            {item['name']}
                          </Link>
                        ) : (
                          <a href={item['target']}>{item['name']}</a>
                        )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

const mapDispatchToProps = {
  addItemToCache: cacheOperations.addItemToCache,
};

const mapStateToProps = (state) => ({
  cache: state.cache,
});

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-ignore
)(Footer);
