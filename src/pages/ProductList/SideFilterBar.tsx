import React from 'react';
import Select from 'react-select';

interface Props {
  handleSelectCategory: (catgoryId: string) => void;
  categories: any[];
  handleSelectTag: (tagId: string) => void;
  tags: any[];
  handleSelectBrand: (brandId: string) => void;
  brands: any[];
  windowWidth: number;
  history: any;
}

const SideFilterBar = ({
  handleSelectCategory,
  categories,
  handleSelectTag,
  tags,
  handleSelectBrand,
  brands,
  windowWidth,
  history,
}: Props) => {
  const [
    selectedCategoryValueForSort,
    setSelectedCategoryValueForSort,
  ] = React.useState({
    value: 'all',
    label: 'All Categories',
  });

  const [selectedTagValueForSort, setSelectedTagValueForSort] = React.useState({
    value: 'all',
    label: 'All Tags',
  });

  const [
    selectedBrandValueForSort,
    setSelectedBrandValueForSort,
  ] = React.useState({
    value: 'all',
    label: 'All Brands',
  });

  const handleSelectCategoryChange = (value) => {
    setSelectedCategoryValueForSort(value);

    const categoryId = value.value;
    history.push({
      pathname: `/productList/${categoryId}`,
      state: { isCategory: true },
    });
  };

  const handleSelectTagChange = (value) => {
    setSelectedTagValueForSort(value);

    const tagId = value.value;
    history.push({
      pathname: `/productList/${tagId}`,
      state: { isTag: true },
    });
  };

  const handleSelectBrandChange = (value) => {
    setSelectedBrandValueForSort(value);

    const brandId = value.value;
    history.push({
      pathname: `/productList/${brandId}`,
      state: { isBrand: true },
    });
  };

  return (
    <div className='col-sm-4 col-md-3 filterbar'>
      {windowWidth < 581 ? (
        <>
          <div className='filterBySelectorsContainer'>
            {categories && categories.length > 0 && (
              <>
                <h2 className='filterBySelectorsContainer-title'>Categories</h2>
                <div className='filterBySelectorsSelects'>
                  <Select
                    value={selectedCategoryValueForSort}
                    onChange={(value) => handleSelectCategoryChange(value)}
                    options={categories.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    }))}
                  />
                </div>
              </>
            )}{' '}
          </div>

          <div className='filterBySelectorsContainer'>
            {tags && tags.length > 0 && (
              <>
                <h2 className='filterBySelectorsContainer-title'>Tags</h2>
                <div className='filterBySelectorsSelects'>
                  <Select
                    value={selectedTagValueForSort}
                    onChange={(value) => handleSelectTagChange(value)}
                    options={tags.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    }))}
                  />
                </div>
              </>
            )}{' '}
          </div>

          <div className='filterBySelectorsContainer'>
            {brands && brands.length > 0 && (
              <>
                <h2 className='filterBySelectorsContainer-title'>Brands</h2>
                <div className='filterBySelectorsSelects'>
                  <Select
                    value={selectedBrandValueForSort}
                    onChange={(value) => handleSelectBrandChange(value)}
                    options={brands.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    }))}
                  />
                </div>
              </>
            )}{' '}
          </div>
        </>
      ) : (
        <>
          {categories.length > 0 && (
            <div className='category-block'>
              <div className='product-detail'>
                <h2
                  className='category-title'
                  style={{
                    marginBottom: '10px',
                  }}
                >
                  Categories
                </h2>
                <ul>
                  {categories.length > 0 &&
                    categories.map((cat, i) => {
                      return (
                        <li key={i}>
                          <span
                            className={
                              cat.id !== 'all'
                                ? `${
                                    cat[`is${cat.id}`]
                                      ? 'category-text active'
                                      : 'category-text'
                                  }`
                                : `${
                                    cat[`is${cat.id}`]
                                      ? 'category-header-all active'
                                      : 'category-header-all'
                                  }`
                            }
                            onClick={() => {
                              handleSelectCategory(cat.id);
                            }}
                          >
                            {cat.name}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          )}

          {tags.length > 0 && (
            <div className='category-block'>
              <div className='product-detail'>
                <h2
                  className='category-title'
                  style={{
                    marginBottom: '10px',
                  }}
                >
                  Tags
                </h2>
                <ul>
                  {tags.length > 0 &&
                    tags.map((tag, i) => {
                      return (
                        <li key={i}>
                          <span
                            className={
                              tag.id !== 'all'
                                ? `${
                                    tag[`is${tag.id}`]
                                      ? 'category-text active'
                                      : 'category-text'
                                  }`
                                : `${
                                    tag[`is${tag.id}`]
                                      ? 'category-header-all active'
                                      : 'category-header-all'
                                  }`
                            }
                            onClick={() => {
                              handleSelectTag(tag.id);
                            }}
                          >
                            {tag.name}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          )}

          {brands.length > 0 && (
            <div className='category-block'>
              <div className='product-detail'>
                <h2
                  className='category-title'
                  style={{
                    marginBottom: '10px',
                  }}
                >
                  Brands
                </h2>
                <ul>
                  {brands.length > 0 &&
                    brands.map((brand, i) => {
                      return (
                        <li key={i}>
                          <span
                            className={
                              brand.id !== 'all'
                                ? `${
                                    brand[`is${brand.id}`]
                                      ? 'category-text active'
                                      : 'category-text'
                                  }`
                                : `${
                                    brand[`is${brand.id}`]
                                      ? 'category-header-all active'
                                      : 'category-header-all'
                                  }`
                            }
                            onClick={() => {
                              handleSelectBrand(brand.id);
                            }}
                          >
                            {brand.name}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SideFilterBar;
