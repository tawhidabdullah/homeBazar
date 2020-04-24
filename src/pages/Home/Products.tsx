// @ts-nocheck

import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import { useHandleFetch } from '../../hooks';
import { Spinner } from '../../components/Loading';
import { ProductCard } from '../../components/Product';
import { carouselResponsive } from '../../constants';
import { checkIfItemExistsInCache } from '../../utils';

// import multi carousel
import 'react-multi-carousel/lib/styles.css';

interface Props {
  windowWidth: number;
  categoryId: string;
  cache: any;
  addItemToCache: (any) => void;
  isRelatedProducts?: boolean;
}

const Products = ({
  windowWidth,
  categoryId,
  cache,
  addItemToCache,
  isRelatedProducts = false,
}: Props) => {
  const [categoryProductsState, handleCategoryProductsFetch] = useHandleFetch(
    [],
    'categoryProducts'
  );
  const [categoryProducts, setCategoryProducts] = useState([]);

  useEffect(() => {
    const getCategoryProducts = async (categoryId) => {
      if (checkIfItemExistsInCache(`categoryProducts/${categoryId}`, cache)) {
        const categoryProductRes = cache[`categoryProducts/${categoryId}`];
        const products = categoryProductRes['data'];
        setCategoryProducts(products);
      } else {
        const categoryProductRes = await handleCategoryProductsFetch({
          urlOptions: {
            placeHolders: {
              id: categoryId,
            },
            params: {
              limitNumber: 10,
              pageNumber: 1,
            },
          },
        });

        if (categoryProductRes) {
          const products = categoryProductRes['data'];
          setCategoryProducts(products);
          addItemToCache({
            [`categoryProducts/${categoryId}`]: categoryProductRes,
          });
        }
      }
    };
    if (categoryId) {
      getCategoryProducts(categoryId);
    }
  }, [categoryId]);

  return (
    <>
      <div
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {categoryProductsState.isLoading && !(categoryProducts.length > 0) && (
          <Spinner />
        )}

        {!categoryProductsState.isLoading && !(categoryProducts.length > 0) && (
          <h2
            style={{
              lineHeight: '200px',
              textAlign: 'center',
            }}
          >
            {isRelatedProducts
              ? 'No Related Product Found'
              : 'No Product Has Been Found On This Category'}
          </h2>
        )}
      </div>

      {windowWidth < 700 ? (
        <div
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
            }}
          >
            {categoryProducts.length > 0 &&
              categoryProducts.slice(0, 10).map((product: any) => {
                return (
                  <React.Fragment key={product._id}>
                    {<ProductCard product={product} />}
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      ) : (
        <div
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            margin: '10px 10px',
          }}
        >
          <Carousel responsive={carouselResponsive}>
            {categoryProducts.length > 0 &&
              categoryProducts.slice(0, 10).map((product) => {
                return (
                  <React.Fragment key={product._id}>
                    <ProductCard product={product} />
                  </React.Fragment>
                );
              })}
          </Carousel>
        </div>
      )}
    </>
  );
};

export default Products;
