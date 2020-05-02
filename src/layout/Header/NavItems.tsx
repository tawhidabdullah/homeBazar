import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks';
import config from '../../config.json';
import { urlToString } from '../../utils';

interface Props {}

const NavItems = ({}: Props) => {
  const navLinksState = useFetch([], [], 'navLinks');

  return (
    <>
      {Object.keys(navLinksState.data).length > 0 &&
        navLinksState.data.map((item) => {
          return (
            <Fragment key={item['target']}>
              <Link to={item['target'] || '/'}>{item['text']}</Link>
            </Fragment>
          );
        })}
    </>
  );
};

export default NavItems;
