import React from 'react';
import { useFetch } from '../../hooks';
import Products from './Products';

interface Props {
  history: any;
  windowWidth: number;
  category: any;
  cache: any;
  addItemToCache: (any) => void;
}

const CategoryProducts = ({
  history,
  windowWidth,
  category,
  cache,
  addItemToCache,
}: Props) => {
  return (
    <>
      {category.length &&
        category.map(({ name, id }) => {
          return (
            <section className='product-slider-section' key={id}>
              <div className='row product-slider-section-heading'>
                <div className='col-md-12'>
                  <div className='block-title'>
                    <span>{name}</span>
                    <div
                      className='seeMore-title-box'
                      onClick={() => {
                        history.push({
                          pathname: `/productList/${id}`,
                          state: { isCategory: true },
                        });
                      }}
                    >
                      <h5 className='seeMore-title'>
                        {`See All "${name}" Products`}
                      </h5>
                      <i className='fa fa-chevron-right'></i>
                    </div>
                  </div>
                </div>
              </div>
              <Products
                windowWidth={windowWidth}
                categoryId={id}
                category={category}
                cache={cache}
                addItemToCache={addItemToCache}
              />
            </section>
          );
        })}
    </>
  );
};

export default CategoryProducts;
