import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHandleFetch } from '../../hooks';
import { checkIfItemExistsInCache, urlToString } from '../../utils';
import config from '../../config.json';

interface Props {
  addItemToCache: (any) => void;
  cache: any;
}

const Logo = ({ addItemToCache, cache }: Props) => {
  const [logoState, handleLogoFetch] = useHandleFetch([], 'logo');

  const [logo, setLogo] = useState([]);

  useEffect(() => {
    if (checkIfItemExistsInCache(`logo`, cache)) {
      const logo = cache['logo'];
      setLogo(logo);
    } else {
      const getAndSetLogo = async () => {
        const logo = await handleLogoFetch({});
        // @ts-ignore
        if (logo) {
          // @ts-ignore
          setLogo(logo);
          addItemToCache({
            logo: logo,
          });
        }
      };

      getAndSetLogo();
    }
  }, []);

  return (
    <div className='navbar-center-logoBox'>
      {Object.keys(logo).length > 0 ? (
        <>
          {logo['target'] ? (
            urlToString(logo['target']).includes(
              urlToString(config.baseURL)
            ) ? (
              <Link to={logo['target'].replace(config.baseURL, '')}>
                <img
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  src={logo['src']}
                  alt='Mystyle'
                />
              </Link>
            ) : (
              <a href={logo['target']}>
                <img
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  src={logo['src']}
                  alt='Mystyle'
                />
              </a>
            )
          ) : (
            <Link to={'/'}>
              <img
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                src={logo['src']}
                alt='Mystyle'
              />
            </Link>
          )}
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default Logo;
