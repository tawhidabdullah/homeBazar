import React, { useState, useLayoutEffect, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useHandleFetch } from '../../hooks';
import { SubCategoryCard } from '../../components/Category';
import { cacheOperations } from '../../state/ducks/cache';
import { brandOperations } from '../../state/ducks/brand';
import { checkIfItemExistsInCache } from '../../utils';

// import productlisting components
import SideFilterBar from './SideFilterBar';
import Products from './Products';

interface Props {
  match: any;
  location: any;
  history: any;
  category: any;
  cache: any;
  addItemToCache: (any) => void;
  tag: any;
  addBrand: (any) => void;
  brand: any;
}

const ProductList = ({
  match,
  location,
  history,
  category,
  cache,
  addItemToCache,
  tag,
  addBrand,
  brand,
}: Props) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isNext, setIsNext] = useState(true);
  const [productListState, handleProductListFetch] = useHandleFetch(
    [],
    'productList'
  );

  const [categoryListState, handleCategoryListFetch] = useHandleFetch(
    [],
    'categoryList'
  );

  const [tagListState, handleTagListFetch] = useHandleFetch([], 'tagList');

  const [brandListState, handleBrandListFetch] = useHandleFetch(
    [],
    'brandList'
  );

  const [categoryProductsState, handleCategoryProductsFetch] = useHandleFetch(
    [],
    'categoryProducts'
  );

  const [tagProductsState, handleTagProductsFetch] = useHandleFetch(
    [],
    'tagProducts'
  );

  const [brandProductsState, handleBrandProductsFetch] = useHandleFetch(
    [],
    'brandProducts'
  );
  const [productOf, setProductOf] = useState('');

  const [pageNumberOfProduct, setPageNumberOfProduct] = useState(1);
  const [
    pageNumberOfCategoryProduct,
    setPageNumberOfCategoryProduct,
  ] = useState(1);
  const [pageNumberOfTagProduct, setPageNumberOfTagProduct] = useState(1);
  const [pageNumberOfBrandProduct, setPageNumberOfBrandProduct] = useState(1);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState('');

  const id = match.params.id;

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

  const getProducts = async (pageNumber?: number) => {
    if (!pageNumber || !(pageNumber > 1)) {
      setIsLoading(true);
    }

    if (checkIfItemExistsInCache(`product`, cache) && pageNumber === 1) {
      const productsRes = cache[`product`];

      // @ts-ignore
      const products = productsRes.data || [];
      // @ts-ignore
      const isNext = productsRes.isNext || null;
      setIsNext(isNext);
      // @ts-ignore
      setProducts(products);
      setProductOf('product');
      setIsLoading(false);
    } else {
      const newProductsRes = await handleProductListFetch({
        urlOptions: {
          params: {
            limitNumber: 15,
            pageNumber: pageNumber ? pageNumber : pageNumberOfProduct,
          },
        },
      });

      // @ts-ignore
      const newProducts = newProductsRes.data || [];
      // @ts-ignore
      const isNext = newProductsRes.isNext || null;
      setIsNext(isNext);

      if (pageNumber === 1) {
        addItemToCache({
          [`product`]: newProductsRes,
        });
      }

      if (products.length > 0 && pageNumber && pageNumber > 1) {
        // @ts-ignore
        if (newProducts.length > 0) {
          // @ts-ignore
          const myProducts = [...products, ...newProducts];
          // @ts-ignore
          setProducts(myProducts);
        } else {
          // @ts-ignore
          setProducts(products);
        }
      } else {
        // @ts-ignore
        setProducts(newProducts);
      }

      setProductOf('product');
      setIsLoading(false);
    }
  };

  const setCategoryProducts = async (categoryId, pageNumber?: number) => {
    if (!pageNumber || !(pageNumber > 1)) {
      setIsLoading(true);
    }

    if (
      checkIfItemExistsInCache(`categoryProducts/${categoryId}`, cache) &&
      pageNumberOfCategoryProduct === 1 &&
      !pageNumber
    ) {
      const productsRes = cache[`categoryProducts/${categoryId}`];

      // @ts-ignore
      const products = productsRes.data || [];
      // @ts-ignore
      const isNext = productsRes.isNext || null;
      setIsNext(isNext);
      // @ts-ignore
      setProducts(products);
      setIsLoading(false);
    } else {
      const newProductsRes = await handleCategoryProductsFetch({
        urlOptions: {
          placeHolders: {
            id: categoryId,
          },
          params: {
            limitNumber: 15,
            pageNumber: pageNumber ? pageNumber : pageNumberOfCategoryProduct,
            isRecursive: true,
          },
        },
      });

      // @ts-ignore
      const newProducts = newProductsRes.data || [];
      // @ts-ignore
      const isNext = newProductsRes.isNext || null;
      setIsNext(isNext);

      // @ts-ignore
      if (pageNumberOfCategoryProduct === 1) {
        addItemToCache({
          [`categoryProducts/${categoryId}`]: newProductsRes,
        });
      }

      if (products.length > 0 && pageNumber && pageNumber > 1) {
        // @ts-ignore
        if (newProducts.length > 0) {
          // @ts-ignore
          const myProducts = [...products, ...newProducts];
          // @ts-ignore
          setProducts(myProducts);
        } else {
          // @ts-ignore
          setProducts(products);
        }
      } else {
        // @ts-ignore
        setProducts(newProducts);
      }

      setIsLoading(false);
    }

    setProductOf('category');
  };

  const setTagProducts = async (tagId, pageNumber?: number) => {
    if (!pageNumber || !(pageNumber > 1)) {
      setIsLoading(true);
    }

    if (
      checkIfItemExistsInCache(`tagProducts/${tagId}`, cache) &&
      !pageNumber
    ) {
      const productsRes = cache[`tagProducts/${tagId}`];
      // @ts-ignore
      const products = productsRes.data || [];
      // @ts-ignore
      const isNext = productsRes.isNext || null;
      setIsNext(isNext);
      // @ts-ignore
      setProducts(products);
      setIsLoading(false);
    } else {
      const newProductsRes = await handleTagProductsFetch({
        urlOptions: {
          placeHolders: {
            id: tagId,
          },
          params: {
            limitNumber: 15,
            pageNumber: pageNumber ? pageNumber : pageNumberOfTagProduct,
          },
        },
      });

      // @ts-ignore
      const newProducts = newProductsRes.data || [];
      // @ts-ignore
      const isNext = newProductsRes.isNext || null;
      setIsNext(isNext);

      // @ts-ignore
      if (pageNumberOfTagProduct === 1) {
        addItemToCache({
          [`tagProducts/${tagId}`]: newProductsRes,
        });
      }

      if (products.length > 0 && pageNumber && pageNumber > 1) {
        // @ts-ignore
        if (newProducts.length > 0) {
          // @ts-ignore
          const myProducts = [...products, ...newProducts];
          // @ts-ignore
          setProducts(myProducts);
        } else {
          // @ts-ignore
          setProducts(products);
        }
      } else {
        // @ts-ignore
        setProducts(newProducts);
      }

      setProductOf('tag');

      setIsLoading(false);
    }
  };

  const setBrandProducts = async (brandId, pageNumber?: number) => {
    if (!pageNumber || !(pageNumber > 1)) {
      setIsLoading(true);
    }

    if (
      checkIfItemExistsInCache(`brandProducts/${brandId}`, cache) &&
      !pageNumber
    ) {
      const productsRes = cache[`brandProducts/${brandId}`];
      // @ts-ignore
      const products = productsRes.data || [];
      // @ts-ignore
      const isNext = productsRes.isNext || null;
      setIsNext(isNext);
      // @ts-ignore
      setProducts(products);
      setIsLoading(false);
    } else {
      const newProductsRes = await handleBrandProductsFetch({
        urlOptions: {
          placeHolders: {
            id: brandId,
          },
          params: {
            limitNumber: 15,
            pageNumber: pageNumber ? pageNumber : pageNumberOfBrandProduct,
          },
        },
      });

      // @ts-ignore
      const newProducts = newProductsRes.data || [];
      // @ts-ignore
      const isNext = newProductsRes.isNext || null;
      setIsNext(isNext);

      // @ts-ignore
      if (pageNumberOfBrandProduct === 1) {
        addItemToCache({
          [`brandProducts/${brandId}`]: newProductsRes,
        });
      }

      if (products.length > 0 && pageNumber && pageNumber > 1) {
        // @ts-ignore
        if (newProducts.length > 0) {
          // @ts-ignore
          const myProducts = [...products, ...newProducts];
          // @ts-ignore
          setProducts(myProducts);
        } else {
          // @ts-ignore
          setProducts(products);
        }
      } else {
        // @ts-ignore
        setProducts(newProducts);
      }

      setProductOf('brand');
      setIsLoading(false);
    }
  };

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

    const tempCategories =
      (categories.length > 0 &&
        categories.map((cat: object) => {
          return {
            ...cat,
            [`is${cat['id']}`]: false,
          };
        })) ||
      [];

    if (tempCategories && tempCategories.length > 0) {
      const categoryItem = {
        name: 'All Categories',
        id: 'all',
        [`isall`]: id ? false : true,
      };

      return [categoryItem, ...tempCategories];
    }
    return [...tempCategories];
  };

  const getTags = async () => {
    let tags = [];
    if (tag.length > 0) {
      tags = tag;
    } else {
      // @ts-ignore
      tags = await handleTagListFetch({});
    }

    const tempTags =
      (tags.length > 0 &&
        tags.map((tagItem: object) => {
          return {
            ...tagItem,
            [`is${tagItem['id']}`]: false,
          };
        })) ||
      [];

    if (tempTags && tempTags.length > 0) {
      const tagItem = {
        name: 'All Tags',
        id: 'all',
        [`isall`]: id ? false : true,
      };
      return [tagItem, ...tempTags];
    }
    return [...tempTags];
  };

  const getBrands = async () => {
    let brands = [];

    if (brand.length > 0) {
      brands = brand;
    } else {
      // @ts-ignore
      brands = await handleBrandListFetch({});
      if (brands) {
        addBrand(brands);
      }
    }

    const tempBrands =
      (brands.length > 0 &&
        brands.map((brandItem: object) => {
          return {
            ...brandItem,
            [`is${brandItem['id']}`]: false,
          };
        })) ||
      [];

    if (tempBrands && tempBrands.length > 0) {
      const brandItem = {
        name: 'All Brands',
        id: 'all',
        [`isall`]: id ? false : true,
      };
      return [brandItem, ...tempBrands];
    }
    return [...tempBrands];
  };

  React.useEffect(() => {
    const doMagic = async () => {
      setIsLoading(true);
      let cat = [];

      if (!(categories && categories.length > 0)) {
        // fetch and set the categories is they haven't been seted yet
        // @ts-ignore
        cat = await getCategories();
        setCategories(cat);
      }

      let t = [];
      if (!(tags && tags.length > 0)) {
        // fetch and set the tags is they haven't been seted yet

        // @ts-ignore
        t = await getTags();
        setTags(t);
      }

      let b = [];
      if (!(brands && brands.length > 0)) {
        // fetch and set the brands is they haven't been seted yet

        // @ts-ignore
        b = await getBrands();
        setBrands(b);
      }
      if (id === 'all') {
        setIsNext(true);
        setPageNumberOfProduct(1);
        // if the id is all get all the products
        getProducts(1);
      } else if (location.state && location.state.isCategory) {
        // find the products by a category
        if (id) {
          let categoryId = id;

          // if the user is selecting the category for the first time
          // then set the select category to active category
          if (cat && cat.length > 0) {
            const newCategories = [...cat];
            let subCategories = [];
            newCategories.forEach((cat) => {
              if (cat['id'] === categoryId) {
                // @ts-ignore
                cat[`is${cat['id']}`] = true;
                // @ts-ignore

                if (cat['subCategory']) {
                  subCategories = cat['subCategory'];
                }
                // @ts-ignore
              } else cat[`is${cat['id']}`] = false;

              // @ts-ignore
              if (cat['id'] !== categoryId) {
                const newSubCat = cat['subCategory'] || [];
                newSubCat['length'] > 0 &&
                  // @ts-ignore
                  newSubCat.forEach((item) => {
                    if (categoryId === item['id']) {
                      setActiveSubCategoryId(categoryId);
                      // @ts-ignore
                      cat[`is${cat['id']}`] = true;
                    }
                  });
              }
            });

            setCategories(newCategories);
            setSubcategories(subCategories);
          }

          setCategoryProducts(categoryId);
        }
      } else if (location.state && location.state.isTag) {
        // find the products by tag
        if (id) {
          let tagId = id;

          // if the user is selecting the category for the first time
          // then set the select category to active category
          if (t && t.length > 0) {
            const newTags = [...t];

            newTags.forEach((tag) => {
              if (tag['id'] === tagId) {
                // @ts-ignore
                tag[`is${tag['id']}`] = true;
                // @ts-ignore
              } else tag[`is${tag['id']}`] = false;
            });

            setTags(newTags);
          }

          setTagProducts(tagId);
        }
      } else if (location.state && location.state.isBrand) {
        // find the products by a brand
        if (id) {
          let brandId = id;

          // if the user is selecting the brand for the first time
          // then set the select brand to active brand
          if (b && b.length > 0) {
            const newBrands = [...b];

            newBrands.forEach((brand) => {
              if (brand['id'] === brandId) {
                // @ts-ignore
                brand[`is${brand['id']}`] = true;
                // @ts-ignore
              } else brand[`is${brand['id']}`] = false;
            });

            setBrands(newBrands);
          }

          setBrandProducts(brandId);
        }
      } else {
        setIsLoading(false);

        return 'The magic ends here';
      }
    };

    doMagic();
  }, [id]);

  const setUiSelectItemDeactive = (type: string) => {
    if (type === 'category') {
      if (categories.length > 0) {
        const newCategories = categories.map((cat: object) => {
          return {
            ...cat,
            [`is${cat['id']}`]: false,
          };
        });

        // @ts-ignore
        setCategories(newCategories);
      }
    } else if (type === 'tag') {
      if (tags.length > 0) {
        const newTags = tags.map((tag: object) => {
          return {
            ...tag,
            [`is${tag['id']}`]: false,
          };
        });

        // @ts-ignore
        setTags(newTags);
      }
    } else if (type === 'brand') {
      if (brands.length > 0) {
        const newBrands = brands.map((brand: object) => {
          return {
            ...brand,
            [`is${brand['id']}`]: false,
          };
        });

        // @ts-ignore
        setBrands(newBrands);
      }
    }
  };

  const setUiSelectItemActive = (type: string, id: string) => {
    if (type === 'category') {
      if (categories.length > 0) {
        const categoryId = id;
        const newCategories = [...categories];
        let subCategories = [];

        newCategories.forEach((cat) => {
          if (cat['id'] === categoryId) {
            // @ts-ignore
            cat[`is${cat['id']}`] = true;
            // @ts-ignore
            if (cat['subCategory'] && cat['subCategory'].length > 0) {
              subCategories = cat['subCategory'];
            }
            // @ts-ignore
          } else cat[`is${cat['id']}`] = false;
        });
        setCategories(newCategories);
        setSubcategories(subCategories);
      }
      setUiSelectItemDeactive('tag');
      setUiSelectItemDeactive('brand');
      setActiveSubCategoryId('');
    } else if (type === 'tag') {
      if (tags.length > 0) {
        const tagId = id;
        const tempTags = [...tags];
        tempTags &&
          tempTags.forEach((tag) => {
            if (tag['id'] === tagId) {
              // @ts-ignore
              tag[`is${tag['id']}`] = true;
              // @ts-ignore
            } else tag[`is${tag['id']}`] = false;
          });
        setTags(tempTags);
      }
      setSubcategories([]);
      setUiSelectItemDeactive('category');
      setUiSelectItemDeactive('brand');
      setActiveSubCategoryId('');
    } else if (type === 'brand') {
      if (brands.length > 0) {
        const brandId = id;
        const tempBrands = [...brands];
        tempBrands &&
          tempBrands.forEach((brand) => {
            if (brand['id'] === brandId) {
              // @ts-ignore
              brand[`is${brand['id']}`] = true;
              // @ts-ignore
            } else brand[`is${brand['id']}`] = false;
          });

        setBrands(tempBrands);
      }
      setSubcategories([]);
      setUiSelectItemDeactive('category');
      setUiSelectItemDeactive('tag');
      setActiveSubCategoryId('');
    }
  };

  const handleUiSelectSubCategory = (subCatId: string) => {
    let newSubCategories = subcategories.length > 0 ? subcategories : false;
    if (newSubCategories) {
      let activeSubId = '';
      subcategories.forEach((item: any) => {
        if (item['id'] === subCatId) {
          activeSubId = subCatId;
        }
      });

      setActiveSubCategoryId(activeSubId);
      setUiSelectItemDeactive('tag');
      setUiSelectItemDeactive('brand');
    } else {
      setSubcategories([]);
    }

    setPageNumberOfCategoryProduct(1);
    setIsNext(true);
  };

  const handleSelectCategory = (categoryId) => {
    setActiveSubCategoryId('');

    history.push({
      pathname: `/productList/${categoryId}`,
      state: { isCategory: true },
    });

    setPageNumberOfCategoryProduct(1);
    setIsNext(true);
    setUiSelectItemActive('category', categoryId);
  };

  const handleSelectTag = (tagId) => {
    history.push({
      pathname: `/productList/${tagId}`,
      state: { isTag: true },
    });

    setPageNumberOfTagProduct(1);
    setIsNext(true);
    setUiSelectItemActive('tag', tagId);
  };

  const handleSelectBrand = (brandId) => {
    history.push({
      pathname: `/productList/${brandId}`,
      state: { isBrand: true },
    });
    setPageNumberOfBrandProduct(1);
    setIsNext(true);
    setUiSelectItemActive('brand', brandId);
  };

  const fetchMoreProductsData = () => {
    if (productOf && productOf === 'product') {
      getProducts(pageNumberOfProduct + 1);
      setPageNumberOfProduct((pageNumber) => pageNumber + 1);
    } else if (productOf && productOf === 'category') {
      setCategoryProducts(id, pageNumberOfCategoryProduct + 1);
      setPageNumberOfCategoryProduct((pageNumber) => pageNumber + 1);
    } else if (productOf && productOf === 'tag') {
      setTagProducts(id, pageNumberOfTagProduct + 1);
      setPageNumberOfTagProduct((pageNumber) => pageNumber + 1);
    } else if (productOf && productOf === 'brand') {
      setBrandProducts(id, pageNumberOfBrandProduct + 1);
      setPageNumberOfBrandProduct((pageNumber) => pageNumber + 1);
    }
  };

  return (
    <>
      <div className='Bcak-bg'>
        <div
          className={'container-fluid'}
          style={{
            paddingTop: `${windowWidth < 1000 ? '15px' : '0'}`,
          }}
        >
          <div className='row'>
            <SideFilterBar
              subcategories={subcategories}
              handleSelectCategory={handleSelectCategory}
              categories={categories}
              handleSelectTag={handleSelectTag}
              tags={tags}
              handleSelectBrand={handleSelectBrand}
              brands={brands}
              windowWidth={windowWidth}
              history={history}
              activeSubCategoryId={activeSubCategoryId}
              handleUiSelectSubCategory={handleUiSelectSubCategory}
              setActiveSubCategoryId={setActiveSubCategoryId}
              setPageNumberOfCategoryProduct={setPageNumberOfCategoryProduct}
              setUiSelectItemActive={setUiSelectItemActive}
              setIsNext={setIsNext}
              setPageNumberOfTagProduct={setPageNumberOfTagProduct}
              setPageNumberOfBrandProduct={setPageNumberOfBrandProduct}
            />
            <div className='col-sm-8 col-md-9'>
              <div
                className='row productListingSubCategooryContainer'
                style={{
                  justifyContent:
                    subcategories.length > 1 ? 'center' : 'flex-start',
                }}
              >
                {!isLoading &&
                  subcategories.length > 0 &&
                  !activeSubCategoryId &&
                  subcategories.map((subCat) => {
                    return (
                      <Fragment key={subCat['id']}>
                        <SubCategoryCard
                          subCat={subCat}
                          history={history}
                          handleUiSelectSubCategory={handleUiSelectSubCategory}
                        />
                      </Fragment>
                    );
                  })}
              </div>
              <Products
                isNext={isNext}
                products={products}
                isLoading={isLoading}
                productOf={productOf}
                fetchMoreProductsData={fetchMoreProductsData}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = {
  addItemToCache: cacheOperations.addItemToCache,
  addBrand: brandOperations.addBrand,
};

const mapStateToProps = (state) => ({
  category: state.category,
  cache: state.cache,
  tag: state.tag,
  brand: state.brand,
});

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-ignore
)(withRouter(ProductList));
