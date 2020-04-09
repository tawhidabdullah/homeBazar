import React from 'react';
import { useFetch } from '../../hooks';

interface Props {
  history: any;
  category: any;
}

const SliderLefMenu = ({ history, category }: Props) => {
  return (
    <div className='col-md-2 col-sm-12 image-slider-section-carousel'>
      <ul className='sliderLeft'>
        {category.length > 0
          ? category.slice(0, 7).map((categoryItem) => {
              return (
                <li
                  key={categoryItem.id}
                  onClick={() => {
                    history.push({
                      pathname: `/productList/${categoryItem.id}`,
                      state: { isCategory: true },
                    });
                  }}
                >
                  <a href='##'>{categoryItem.name}</a>
                </li>
              );
            })
          : ''}
      </ul>
    </div>
  );
};

export default SliderLefMenu;
