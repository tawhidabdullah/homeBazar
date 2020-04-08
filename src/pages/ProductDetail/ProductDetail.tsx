import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ProductPlaceholder } from '../../components/Placeholders';
import { useFetch, useHandleFetch } from '../../hooks';
import { Spinner } from '../../components/Loading';
import ProductDetailContent from './ProductDetailContent';
import SmallItem from '../../components/SmallItem';
import { cacheOperations } from '../../state/ducks/cache';
import { checkIfItemExistsInCache } from '../../utils';

interface Props {
  match: any;
  addItemToCache: (any) => void;
  cache: any;
}

const ProductDetail = (props: Props) => {
  const categoryName = props.match.params && props.match.params['categoryName'];
  const productName = props.match.params && props.match.params['productName'];
  const [productDetail, setProductDetail] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [productDetailState, handleProductDetailFetch] = useHandleFetch(
    [],
    'productDetail'
  );

  const [relatedProductsState, handleRelatedProductsFetch] = useHandleFetch(
    [],
    'categoryProducts'
  );

  useEffect(() => {
    const getSetProductDetailAndRelatedProducts = async () => {
      if (
        checkIfItemExistsInCache(
          `productDetail/${categoryName}/${productName}`,
          props['cache']
        )
      ) {
        const productDetail =
          props['cache'][`productDetail/${categoryName}/${productName}`];
        setProductDetail(productDetail);

        // @ts-ignore
        const product = productDetail;
        // @ts-ignore
        const categoryId = product.category && product.category[0].id;

        if (
          categoryId &&
          checkIfItemExistsInCache(
            `categoryProducts/${categoryId}`,
            props.cache
          )
        ) {
          const relatedProducts =
            props['cache'][`categoryProducts/${categoryId}`];

          if (relatedProducts && relatedProducts.length) {
            // @ts-ignore
            setRelatedProducts(relatedProducts);
          }
        } else {
          const setTheRelatedProducts = async () => {
            await handleRelatedProductsFetch({
              urlOptions: {
                placeHolders: {
                  id: categoryId,
                },
              },
            });
          };
          if (categoryId) {
            setTheRelatedProducts();
          }
        }
      } else {
        // @ts-ignore
        const productDetail = await handleProductDetailFetch({
          urlOptions: {
            placeHolders: {
              categoryName,
              productName,
            },
          },
        });

        // @ts-ignore
        if (productDetail && Object.keys(productDetail).length > 0) {
          props.addItemToCache({
            [`productDetail/${categoryName}/${productName}`]: productDetail,
          });
          // @ts-ignore
          setProductDetail(productDetail);
          // @ts-ignore
          const product = productDetail;
          // @ts-ignore
          const categoryId = product.category && product.category[0].id;
          const setTheRelatedProducts = async () => {
            const relatedProducts = await handleRelatedProductsFetch({
              urlOptions: {
                placeHolders: {
                  id: categoryId,
                },
              },
            });

            // @ts-ignore
            if (relatedProducts && relatedProducts.length > 0) {
              // @ts-ignore
              setRelatedProducts(relatedProducts);
              if (
                !checkIfItemExistsInCache(
                  `categoryProducts/${categoryId}`,
                  props.cache
                )
              ) {
                props.addItemToCache({
                  [`categoryProducts/${categoryId}`]: relatedProducts,
                });
              }
            }
          };
          if (categoryId) {
            setTheRelatedProducts();
          }
        }
      }
    };
    if (categoryName && productName) {
      getSetProductDetailAndRelatedProducts();
    }
  }, [categoryName, productName]);

  return (
    <>
      {!productDetailState.isLoading &&
      Object.keys(productDetail).length > 0 ? (
        <div className='singleProduct'>
          <div className='container-fluid singleProduct__container'>
            <div className='row'>
              <div className='col-md-9'>
                <ProductDetailContent
                  // @ts-ignore
                  product={productDetail}
                />
              </div>
              <div className='col-md-3 '>
                {(!relatedProductsState.isLoading && relatedProducts && (
                  <div className='relativeProductsContainer'>
                    <div className='small__filterProducts'>
                      <div className='small-products-items'>
                        {(!relatedProductsState.isLoading &&
                          relatedProducts.length > 0 &&
                          relatedProducts.slice(0, 6).map((productItem) => {
                            return <SmallItem productItem={productItem} />;
                          })) ||
                          (relatedProductsState.isLoading && <Spinner />)}

                        {!relatedProductsState.isLoading &&
                          relatedProducts &&
                          !(relatedProducts.length > 0) && (
                            <div
                              style={{
                                // marginTop: '200px'
                                padding: '50px 0 60px 0',
                                textAlign: 'center',
                              }}
                            >
                              <h2
                                style={{
                                  lineHeight: 1.6,
                                }}
                              >
                                No Related Product Found
                              </h2>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                )) ||
                  ''}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1>Product Not Found</h1>
      )}
      {productDetailState.isLoading && <ProductPlaceholder />}
    </>
  );
};

const mapDispatchToProps = {
  addItemToCache: cacheOperations.addItemToCache,
};

const mapStateToProps = (state) => ({
  cache: state.cache,
});

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-ignore
)(ProductDetail);
