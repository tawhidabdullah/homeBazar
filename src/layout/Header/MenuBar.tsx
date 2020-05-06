import React from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks';
import config from '../../config.json';
import { urlToString } from '../../utils';

interface Props {
  isShowMenuBar: boolean;
  handleToggleMenuBar: () => void;
}

const MenuBar = ({ isShowMenuBar, handleToggleMenuBar }: Props) => {
  const navLinksState = useFetch([], [], 'navLinks');
  return (
    <div className={isShowMenuBar ? 'show-menu-bar' : ''}>
      <div
        onClick={handleToggleMenuBar}
        className={isShowMenuBar ? 'menu-overlay ' : ''}
      ></div>
      <div className={isShowMenuBar ? 'menu showMenu' : 'menu'}>
        <span className='close-menu' onClick={handleToggleMenuBar}>
          <i className='fa fa-window-close'></i>
        </span>
        <ul className='menuItems'>
          {Object.keys(navLinksState.data).length > 0 &&
            navLinksState.data.map((item) => {
              return (
                <li key={item.target}>
                  {urlToString(item['target']).includes(
                    urlToString(config.baseURL2)
                  ) ? (
                    <Link to={item['target'].replace(config.baseURL2, '')}>
                      {item['text']}
                    </Link>
                  ) : (
                    <a href={item['target']}>{item['text']}</a>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default MenuBar;
