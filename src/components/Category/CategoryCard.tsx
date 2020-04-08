import React from 'react';
import { withRouter } from 'react-router-dom';

interface Props {
  history: any;
  category: any;
}

const CategoryCard = ({ category, history }: Props) => {
  const { cover, id, name } = category;
  return (
    <div className='category-card'>
      <div className='category-top'>
        <img src={cover} alt='category img' />
        <div
          className='category-top-overlay'
          onClick={() => {
            history.push({
              pathname: `/productList/${id}`,
              state: { isCategory: true }
            });
          }}
        ></div>
      </div>

      <div className='category-bottom text-center'>
        <div className='ratingsandtitle'>
          <h3 className='category-bottom-title'>{name}</h3>
        </div>
      </div>
    </div>
  );
};

//@ts-ignore
export default withRouter(CategoryCard);
