import React from 'react';
import { useFetch } from '../../hooks';
import { CategoryCard } from '../../components/Category';

interface Props {
  category: any;
}

const Categories = ({ category }: Props) => {
  return (
    <div className='categoryContainer'>
      {category.length > 0 &&
        category.map((categoryItem) => {
          return (
            <React.Fragment key={categoryItem.id}>
              <CategoryCard category={categoryItem} />
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default Categories;
