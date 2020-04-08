import React from 'react';

interface Props {
  subCat: any;
  history: any;
  handleUiSelectSubCategory?: (categoryId: string) => void;
}

const SubCategoryCard = ({
  subCat,
  history,
  handleUiSelectSubCategory
}: Props) => {
  const { cover, id, name } = subCat;
  return (
    <div className='subcat-card'>
      <div className='subcat-top'>
        <img src={cover} alt='subcat img' />
        <div
          className='subcat-top-overlay'
          onClick={() => {
            history.push({
              pathname: `/productList/${id}`,
              state: { isCategory: true }
            });
            handleUiSelectSubCategory && handleUiSelectSubCategory(id);
          }}
        ></div>
      </div>

      <div className='subcat-bottom text-center'>
        <div
          className={
            subCat[`is${id}`] ? 'ratingsandtitle active' : 'ratingsandtitle'
          }
        >
          <h3 className='subcat-bottom-title'>{name}</h3>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryCard;
