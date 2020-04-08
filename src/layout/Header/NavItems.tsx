import React from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks';

interface Props {}

const NavItems = ({}: Props) => {
  const navLinksState = useFetch([], [], 'navLinks');

  return (
    <>
      {Object.keys(navLinksState.data).length > 0 &&
        navLinksState.data.map(item => {
          return (
            <a key={item} href={item.target}>
              {item.text}
            </a>
          );
        })}
    </>
  );
};

export default NavItems;
