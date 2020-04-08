// @ts-nocheck

import React from 'react';
import { Spinner } from '../../components/Loading';
import { ProductCard } from '../../components/Product';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  products: any[];
  isLoading: boolean;
  fetchMoreProductsData: any;
  productOf: string;
}

const Products = ({
  products,
  isLoading,
  fetchMoreProductsData,
  productOf,
}: Props) => {
  return (
    <>
      {products.length > 0 && (
        <InfiniteScroll
          style={{
            overflow: 'hidden',
          }}
          dataLength={products.length}
          next={fetchMoreProductsData}
          hasMore={true}
          loader={<h4></h4>}
        >
          <div className='row productListingProductsContainer'>
            {products.map((product) => {
              return (
                <React.Fragment key={product._id}>
                  <ProductCard product={product} />
                </React.Fragment>
              );
            })}
          </div>
        </InfiniteScroll>
      )}

      <div className='row productListingProductsContainer'>
        {isLoading && <Spinner />}
      </div>

      {!isLoading && !(products.length > 0) && (
        <div className='notFoundProduct'>
          <h3 className='notFoundProductText'>No Product Has Been Found!!</h3>
        </div>
      )}
    </>
  );
};

export default Products;
