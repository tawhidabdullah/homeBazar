import React from 'react';
import { useFetch } from '../../hooks';

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
            navLinksState.data.map(item => {
              return (
                <li key={item.target}>
                  <a href={item.target}>{item.text}</a>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default MenuBar;