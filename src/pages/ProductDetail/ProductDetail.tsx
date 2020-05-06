import React, { useEffect, useState, Fragment, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { ProductPlaceholder } from '../../components/Placeholders';
import { useHandleFetch } from '../../hooks';
import ProductDetailContent from './ProductDetailContent';
import { cacheOperations } from '../../state/ducks/cache';
import { checkIfItemExistsInCache } from '../../utils';
import Products from '../../pages/Home/Products';

interface Props {
  match: any;
  addItemToCache: (any) => void;
  cache: any;
}

const ProductDetail = (props: Props) => {
  const categoryName = props.match.params && props.match.params['categoryName'];
  const productName = props.match.params && props.match.params['productName'];
  const [productDetail, setProductDetail] = useState({});
  const [relatedProductId, setRelatedProductId] = useState('');
  const [fethedProductFromCache, setFethedProductFromCache] = useState(false);

  const [windowWidth, setWindowWidth] = useState(0);
  const getWindowWidth = () => {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  };

  useLayoutEffect(() => {
    setWindowWidth(getWindowWidth());
  }, []);

  const onResize = () => {
    window.requestAnimationFrame(() => {
      setWindowWidth(getWindowWidth());
    });
  };

  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [productDetailState, handleProductDetailFetch] = useHandleFetch(
    [],
    'productDetail'
  );

  const [relatedProductsState, handleRelatedProductsFetch] = useHandleFetch(
    [],
    'categoryProducts'
  );

  const [forAnalyticsState, handleForAnalyticsFetch] = useHandleFetch(
    [],
    'forAnalytics'
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
        setFethedProductFromCache(true);

        // @ts-ignore
        const product = productDetail;
        // @ts-ignore
        const categoryId = product.category && product.category[0].id;
        setRelatedProductId(categoryId);
      } else {
        setFethedProductFromCache(false);

        // @ts-ignore //
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
          console.log('fuckingURl', productDetail['url']);


          props.addItemToCache({
            [`productDetail/${categoryName}/${productName}`]: productDetail,
          });
          // @ts-ignore
          setProductDetail(productDetail);
          // @ts-ignore
          const product = productDetail;
          // @ts-ignore
          const categoryId = product.category && product.category[0].id;
          setRelatedProductId(categoryId);

          await handleForAnalyticsFetch({
            urlOptions: {
              params: {
                url: productDetail['url'].toString(),
              },
            },
          });
        }
      }
    };
    if (categoryName && productName) {
      getSetProductDetailAndRelatedProducts();
    }
  }, [categoryName, productName]);

  return (
    <>

      {!fethedProductFromCache && (
        <>
          {!productDetailState.isLoading &&
            productDetailState.done &&
            Object.keys(productDetail).length > 0 && (
              <div className='singleProduct'>
                <div className='container-fluid singleProduct__container'>
                  <div className='row productDetailInfo'>
                    <ProductDetailContent
                      // @ts-ignore
                      product={productDetail}
                    />
                  </div>
                  <div className='row relatedProductsContainer'>
                    <div className='col-md-12 '>
                      {(relatedProductId && (
                        <div className='relativeProductsContainer'>
                          <div className='row product-slider-section-heading'>
                            <div className='col-md-12'>
                              <div className='block-title'>
                                <span>Related products</span>
                              </div>
                            </div>
                          </div>
                          <Products
                            windowWidth={windowWidth}
                            categoryId={relatedProductId}
                            cache={props.cache}
                            addItemToCache={props.addItemToCache}
                          />
                        </div>
                      )) ||
                        ''}
                    </div>
                  </div>
                </div>
              </div>
            )}

          {!productDetailState.isLoading && productDetailState.done && productDetailState.data && !(Object.keys(productDetailState.data).length > 0) && (
            <div
              style={{
                textAlign: 'center',
                minHeight: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: 500,
                }}
              >
                Product Not Found
            </h1>
            </div>
          )}
        </>
      )}


      {fethedProductFromCache && (
        <>
          {
            Object.keys(productDetail).length > 0 && (
              <div className='singleProduct'>
                <div className='container-fluid singleProduct__container'>
                  <div className='row productDetailInfo'>
                    <ProductDetailContent
                      // @ts-ignore
                      product={productDetail}
                    />
                  </div>
                  <div className='row relatedProductsContainer'>
                    <div className='col-md-12 '>
                      {(relatedProductId && (
                        <div className='relativeProductsContainer'>
                          <div className='row product-slider-section-heading'>
                            <div className='col-md-12'>
                              <div className='block-title'>
                                <span>Related products</span>
                              </div>
                            </div>
                          </div>
                          <Products
                            windowWidth={windowWidth}
                            categoryId={relatedProductId}
                            cache={props.cache}
                            addItemToCache={props.addItemToCache}
                          />
                        </div>
                      )) ||
                        ''}
                    </div>
                  </div>
                </div>
              </div>
            )}

          {productDetail && !(Object.keys(productDetail).length > 0) && (
            <div
              style={{
                textAlign: 'center',
                minHeight: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: 500,
                }}
              >
                Product Not Found
            </h1>
            </div>
          )}
        </>
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
