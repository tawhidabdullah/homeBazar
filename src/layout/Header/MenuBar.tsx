import React, { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch, useHandleFetch } from '../../hooks';
import config from '../../config.json';
import { urlToString } from '../../utils';

interface Props {
  isShowMenuBar: boolean;
  handleToggleMenuBar: () => void;
  category: any;
  addCategory: (any) => void;
  history: any;
}

const MenuBar = ({ isShowMenuBar, handleToggleMenuBar, category, addCategory, history }: Props) => {
  const navLinksState = useFetch([], [], 'navLinks');


  const [categoryListState, handleCategoryListFetch] = useHandleFetch(
    [],
    'categoryList'
  );

  const [localCategory, setLocalCategory] = useState([]);

  useLayoutEffect(() => {
    if (category && !(category.length > 0)) {
      const setLocalCategoryAsync = async () => {
        const localCategory = await handleCategoryListFetch({
          urlOptions: {
            params: {
              isSubCategory: true,
            },
          },
        });
        // @ts-ignore
        setLocalCategory(localCategory)
        addCategory(localCategory);
      }
      setLocalCategoryAsync();
    }
    else {
      setLocalCategory(category)
    }
  }, [category]);


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


        {Object.keys(navLinksState.data).length > 0 && (
          <>
            <span className='menuItemHeader'>
              Links
            </span>
            <ul className='menuItems'>
              {navLinksState.data.length > 0 &&
                navLinksState.data.map((item) => {
                  return (
                    <li key={item.target} onClick={() => {
                      handleToggleMenuBar();
                    }}>
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
          </>
        )}


        {localCategory && localCategory.length > 0 && (
          <>
            <span className='menuItemHeader'>
              Categories
             </span>
            <ul className='menuItems'>

              {localCategory.map(cat => {
                return (
                  <li key={cat['id']}>
                    <a
                      onClick={() => {
                        handleToggleMenuBar();
                        history.push({
                          pathname: `/productList/${cat['id']}`,
                          state: { isCategory: true },
                        });
                      }}>{cat['name']}</a>

                    {cat['subCategory'] &&
                      // @ts-ignore
                      cat['subCategory'].length > 0 && cat['subCategory'].map(subCat => {
                        return <a
                          key={subCat['id']}
                          onClick={() => {
                            handleToggleMenuBar();

                            history.push({
                              pathname: `/productList/${subCat['id']}`,
                              state: { isCategory: true },
                            });
                          }}
                          className='subCaty'>{subCat['name']}</a>
                      })}
                  </li>
                )
              })}

            </ul>
          </>
        )}

      </div>
    </div>
  );
};

export default MenuBar;
