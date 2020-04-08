import React from 'react';

interface Props {
  history: any;
  category: any;
}

const Menu = ({ history, category }: Props) => {
  return (
    <div className='all-department'>
      <span className='nav-menu'>
        <i className='fa fa-bars'></i>
        <span className='nav-menu-title'>All Departments</span>
      </span>
      <div className='all-department-sideMenu'>
        <ul>
          {(category &&
            category.length > 0 &&
            category.map((item) => {
              return (
                <li
                  key={item._id}
                  onClick={() => {
                    history.push({
                      pathname: `/productList/${item.id}`,
                      state: { isCategory: true },
                    });
                  }}
                >
                  {' '}
                  {item.name}
                </li>
              );
            })) ||
            ''}
        </ul>
      </div>
    </div>
  );
};

export default Menu;
