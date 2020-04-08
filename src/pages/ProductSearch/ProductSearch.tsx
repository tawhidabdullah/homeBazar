// @ts-nocheck
import React from 'react';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useHandleFetch } from '../../hooks';
import { Spinner } from '../../components/Loading';
import Select from 'react-select';
import { ProductCard } from '../../components/Product';
import { checkIfItemExistsInCache } from '../../utils';
import { cacheOperations } from '../../state/ducks/cache';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  location: any;
  history: any;
  addItemToCache: (any) => void;
  cache: any;
  category: any;
}

const ProductSearch = ({
  location,
  history,
  addItemToCache,
  cache,
  category,
}: Props) => {
  let searchCategoryValue = queryString.parse(location.search).searchCategory;
  let queryValue = queryString.parse(location.search).query;

  const [categoryListState, handleCategoryListFetch] = useHandleFetch(
    [],
    'categoryList'
  );

  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [activeCategoryName, setActiveCategoryName] = React.useState('');
  const [selectedValueForSort, setSelectedValueForSort] = React.useState({
    value: 'Relevance',
    label: 'Relevance',
  });

  const [
    selectedCategoryValueForSort,
    setSelectedCategoryValueForSort,
  ] = React.useState({
    value: 'all',
    label: 'All Categories',
  });

  const [
    pageNumberOfCategoryProduct,
    setPageNumberOfCategoryProduct,
  ] = React.useState(1);

  const handleSelectCategoryChange = (value) => {
    setSelectedCategoryValueForSort(value);

    history.push({
      pathname: '/productSearch',
      search: `?searchCategory=${value.value}&query=${queryValue}`,
    });
  };

  const handleSelectCategory = (id) => {
    setPageNumberOfCategoryProduct(1);
    history.push({
      pathname: '/productSearch',
      search: `?searchCategory=${id}&query=${queryValue}`,
    });
  };

  const setSortBySelect = (value) => {
    setPageNumberOfCategoryProduct(1);
    setSelectedValueForSort(value);
  };

  const options = [
    { value: 'Relevance', label: 'Relevance' },
    { value: 'priceLowToHigh', label: 'Price -- Low to High' },
    { value: 'priceHighToLow', label: 'Price -- High to Low' },
    { value: 'newestFirst', label: 'Newest First' },
  ];

  const [windowWidth, setWindowWidth] = React.useState(0);

  const getWindowWidth = () => {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  };

  React.useLayoutEffect(() => {
    setWindowWidth(getWindowWidth());
  }, []);

  const onResize = () => {
    window.requestAnimationFrame(() => {
      setWindowWidth(getWindowWidth());
    });
  };

  React.useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [productSearchState, handleProductSearchFetch] = useHandleFetch(
    [],
    'productSearch'
  );

  const getCategories = async () => {
    let categories = [];

    if (category.length > 0) {
      categories = category;
    } else {
      // @ts-ignore
      categories = await handleCategoryListFetch({
        urlOptions: {
          params: {
            isSubCategory: true,
          },
        },
      });
    }

    const categoryItem = {
      name: 'All Categories',
      id: 'all',
      [`isall`]: searchCategoryValue ? false : true,
    };

    const tempCategories =
      (categories &&
        categories.length > 0 &&
        categories.map((cat: object) => {
          return {
            ...cat,
            [`is${cat['id']}`]: false,
          };
        })) ||
      [];

    return [categoryItem, ...tempCategories];
  };

  const categorySearchProductsParams = (type) => {
    switch (type) {
      case 'newestFirst':
        return {
          searchCategoryValue,
          queryValue,
          sortValue: 'added',
          sortOrderValue: -1,
          limitNumber: 15,
          pageNumber: pageNumberOfCategoryProduct,
        };
      case 'priceLowToHigh':
        return {
          searchCategoryValue,
          queryValue,
          sortValue: 'price',
          sortOrderValue: 1,
          limitNumber: 15,
          pageNumber: pageNumberOfCategoryProduct,
        };
      case 'priceHighToLow':
        return {
          searchCategoryValue,
          queryValue,
          sortValue: 'price',
          sortOrderValue: -1,
          limitNumber: 15,
          pageNumber: pageNumberOfCategoryProduct,
        };
      case 'Relevance':
        return {
          searchCategoryValue,
          queryValue,
          sortOrderValue: 1,
          sortValue: 'added',
          pageNumber: pageNumberOfCategoryProduct,
          limitNumber: 15,
        };
      default:
        break;
    }
  };

  React.useEffect(() => {
    const getProducts = async () => {
      if (!(pageNumberOfCategoryProduct > 1)) {
        setIsLoading(true);
      }

      let cat = [];
      if (!(categories.length > 0)) {
        // @ts-ignore
        cat = await getCategories();
        setCategories(cat);
      }

      try {
        if (cat && cat.length > 0) {
          const categoryId = searchCategoryValue;
          const newCategories = [...cat];
          newCategories.forEach((cat) => {
            if (cat['id'] === categoryId) {
              // @ts-ignore
              cat[`is${cat['id']}`] = true;
              // @ts-ignore
              setSelectedCategoryValueForSort({
                value: cat['id'],
                label: cat['name'],
              });
              setActiveCategoryName(cat['name']);
              // @ts-ignore
            } else cat[`is${cat['id']}`] = false;
          });

          setCategories(newCategories);
        } else {
          const categoryId = searchCategoryValue;
          const newCategories = [...categories];
          newCategories.forEach((cat) => {
            if (cat['id'] === categoryId) {
              // @ts-ignore
              cat[`is${cat['id']}`] = true;
              // @ts-ignore
              setSelectedCategoryValueForSort({
                value: cat['id'],
                label: cat['name'],
              });
              setActiveCategoryName(cat['name']);
              // @ts-ignore
            } else cat[`is${cat['id']}`] = false;
          });

          setCategories(newCategories);
        }

        const params = categorySearchProductsParams(selectedValueForSort.value);

        if (
          checkIfItemExistsInCache(
            `productSearch/${selectedValueForSort.value}/${searchCategoryValue}/${queryValue}`,
            cache
          ) &&
          !(pageNumberOfCategoryProduct > 1)
        ) {
          const products =
            cache[
              `productSearch/${selectedValueForSort.value}/${searchCategoryValue}/${queryValue}`
            ];
          // @ts-ignore
          setProducts(products);
          setIsLoading(false);
        } else {
          const newProducts = await handleProductSearchFetch({
            urlOptions: {
              params,
            },
          });

          if (pageNumberOfCategoryProduct === 1 && newProducts) {
            addItemToCache({
              [`productSearch/${selectedValueForSort.value}/${searchCategoryValue}/${queryValue}`]: newProducts,
            });
          }

          if (products.length > 0) {
            // @ts-ignore
            if (newProducts.length > 0) {
              if (pageNumberOfCategoryProduct > 1) {
                // @ts-ignore
                const myProducts = [...products, ...newProducts];
                // @ts-ignore
                setProducts(myProducts);
              } else {
                // @ts-ignore
                setProducts(newProducts);
              }
            } else {
              if (pageNumberOfCategoryProduct === 1) {
                // @ts-ignore
                setProducts(newProducts);
              } else {
                if (newProducts) {
                  // @ts-ignore
                  const myProducts = [...products, ...newProducts];
                  // @ts-ignore
                  setProducts(myProducts);
                }
              }
            }
          } else {
            // @ts-ignore
            setProducts(newProducts);
          }

          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    getProducts();
  }, [
    queryValue,
    searchCategoryValue,
    selectedValueForSort,
    pageNumberOfCategoryProduct,
  ]);

  const fetchMoreProductsData = () => {
    setPageNumberOfCategoryProduct((pageNumber) => pageNumber + 1);
  };

  return (
    <>
      <div
        className={windowWidth < 770 ? 'container-fluid' : 'container'}
        style={{
          padding: windowWidth < 770 ? '15px' : '0 0 20px 0',
        }}
      >
        <div className='row'>
          {windowWidth > 575 ? (
            <div
              className='col-sm-4 col-md-3 productSearchFilterSideBar'
              style={{
                background: '#fff',
                borderRight: '1px solid #eee',
              }}
            >
              <div
                style={{
                  lineHeight: 2.5,
                  paddingLeft: '20px',
                  borderBottom: '1px solid #eee',
                }}
              >
                <h3
                  style={{
                    fontSize: '19px',
                    fontWeight: 500,
                    color: '#17252a',
                  }}
                >
                  Filters
                </h3>
              </div>

              <div className='category-filter'>
                <h2 className='category-filter-title'>Categories</h2>
                <ul>
                  {categories &&
                    categories.length > 0 &&
                    categories.map((cat) => {
                      return (
                        <li onClick={() => handleSelectCategory(cat['id'])}>
                          <span
                            className={
                              cat[`is${cat['id']}`]
                                ? 'category-filterText active'
                                : 'category-filterText'
                            }
                          >
                            {cat['name']}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          ) : (
            ''
          )}
          <div className='col-sm-8 col-md-9'>
            {!isLoading && products ? (
              <>
                <div className='showResultHeader'>
                  <h2 className='showResultText'>
                    Showing 1 – {products.length} of {products.length} results
                    for {`"${queryValue || ''}"`}{' '}
                    {activeCategoryName ? `in ${activeCategoryName}` : ''}
                  </h2>

                  <div className='sortBySelectorsContainer'>
                    {windowWidth < 575 ? (
                      <>
                        {categories && categories.length > 0 && (
                          <>
                            <h2 className='sortBySelectorsContainer-title'>
                              Categories
                            </h2>
                            <div className='sortBySelectorsSelects'>
                              <Select
                                value={selectedCategoryValueForSort}
                                onChange={(value) =>
                                  handleSelectCategoryChange(value)
                                }
                                options={categories.map((cat) => ({
                                  value: cat['id'],
                                  label: cat['name'],
                                }))}
                              />
                            </div>
                          </>
                        )}{' '}
                      </>
                    ) : (
                      ''
                    )}
                  </div>

                  <div className='sortBySelectorsContainer'>
                    <h2 className='sortBySelectorsContainer-title'>Sort by</h2>
                    <div className='sortBySelectorsSelects'>
                      <Select
                        value={selectedValueForSort}
                        onChange={(value) => setSortBySelect(value)}
                        defaultValue={{
                          label: 'Relevance',
                          value: 'Relevance',
                        }}
                        options={options}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ''
            )}

            {products && (
              <InfiniteScroll
                style={{
                  overflow: 'hidden',
                }}
                dataLength={products.length}
                next={fetchMoreProductsData}
                hasMore={true}
                loader={<h4></h4>}
              >
                <div
                  style={{
                    paddingTop: '10px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}
                >
                  {products.length > 0 &&
                    products.map((product) => {
                      return (
                        <ProductCard product={product} productListing={true} />
                      );
                    })}
                </div>
              </InfiniteScroll>
            )}

            <div
              style={{
                paddingTop: '10px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              {isLoading && <Spinner />}

              {!isLoading && products && !(products.length > 0) ? (
                <div
                  style={{
                    width: '100%',
                    height: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <h2
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    No Product Has Been Found
                  </h2>
                  <a
                    className='btn btn-outline-secondary'
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/');
                    }}
                    href='##'
                  >
                    Go Back To Home Page
                  </a>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = {
  addItemToCache: cacheOperations.addItemToCache,
};

const mapStateToProps = (state) => ({
  cache: state.cache,
  category: state.category,
});

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-ignore
)(withRouter(ProductSearch));
