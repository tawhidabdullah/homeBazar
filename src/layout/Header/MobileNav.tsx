import React, { useState } from 'react';

interface Props {
  handleToggleCartBar: () => void;
  handleToggleMenuBar: () => void;
  history: any;
  cartLength: number;
}

const MobileNav = ({
  handleToggleCartBar,
  handleToggleMenuBar,
  history,
  cartLength,
}: Props) => {
  const [searchBarValue, setSearchBarValue] = useState('');

  const handleSearch = () => {
    history.push({
      pathname: '/productSearch',
      search: `?searchCategory=all&query=${searchBarValue}`,
    });
  };

  const handleSearchBar = (e) => {
    e.preventDefault();

    setSearchBarValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='header-menu-search-carticon-container'>
      <div className='header-menu-container' onClick={handleToggleMenuBar}>
        <div className='headermenu-btn'>
          <span className='headermenu-btn-icon'>
            <i className='fa fa-bars'></i>
          </span>
        </div>
      </div>

      <div className='header-search-container'>
        <div className='searchContainer'>
          <input
            name='Search'
            onChange={handleSearchBar}
            onKeyPress={handleKeyPress}
            type='text'
            placeholder='Enter keywords to search...'
            className='input-searchbox'
          />
          <span className='searchIcon' onClick={handleSearch}>
            <i className='fa fa-search'></i>
          </span>
        </div>
      </div>

      <div className='header-search-carticon'>
        <div
          className='navbar-center-cartBox'
          style={{
            marginRight: '10px',
          }}
        >
          <div className='cartt-btn' onClick={handleToggleCartBar}>
            <span className='nav-icon '>
              <i className='fa fa-shopping-cart'></i>
            </span>
            <div className='cartt-items'>
              {cartLength ? ` ${cartLength}` : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
