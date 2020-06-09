import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks';
interface Props {
  history: any;
  getCategory: () => void;
  addCategory: (any) => void;
  category: any;
}

const SearchBar = ({ history, addCategory, category }: Props) => {
  const categoryState = useFetch([], [], 'categoryList', {
    urlOptions: {
      params: {
        isSubCategory: true,
      },
    },
  });


  const [searchBarValue, setSearchBarValue] = useState('');
  const [categorySelectValue, setCategorySelectValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    history.push({
      pathname: '/productSearch',
      search: `?searchCategory=${categorySelectValue}&query=${searchBarValue}`,
    });
  };

  const handleCategorySelectChange = (event) => {
    setCategorySelectValue(event.target.value);
  };

  const handleSearchBar = (e) => {
    e.preventDefault();

    setSearchBarValue(e.target.value);
  };

  useEffect(() => {
    if (categoryState.data.length > 0) {
      addCategory(categoryState.data);
    }
  }, [categoryState]);

  return (
    <div className='navbar-center-categoryAndSearch'>
      <div className='categoryAndSearchFeilds'>
        <div className='s003'>
          <form onSubmit={handleSearch}>
            <div className='inner-form'>
              <div className='input-field first-wrap'>
                <div className='input-select'>
                  <select
                    data-trigger='choices'
                    name='choices-single-default'
                    value={categorySelectValue}
                    onChange={(e) => handleCategorySelectChange(e)}
                  >
                    {category.length > 0 && (
                      <option value={'all'} key={'all'}>
                        All Categories
                      </option>
                    )}

                    {category.length > 0 &&
                      category.map((item, index) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.name.charAt(0).toUpperCase() +
                              item.name.slice(1)}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
              <div className='input-field second-wrap'>
                <input
                  id='search'
                  type='text'
                  placeholder='Enter Keywords?'
                  name='searchbar'
                  value={searchBarValue}
                  onChange={handleSearchBar}
                />
              </div>
              <div className='input-field third-wrap'>
                <button className='btn-search'>
                  <svg
                    className='svg-inline--fa fa-search fa-w-16'
                    aria-hidden='true'
                    data-prefix='fas'
                    data-icon='search'
                    role='img'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 512 512'
                  >
                    <path
                      fill='currentColor'
                      d='M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z'
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
