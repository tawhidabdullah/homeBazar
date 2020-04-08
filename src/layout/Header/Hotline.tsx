import React from 'react';
import { useFetch } from '../../hooks';

interface Props {}

const Hotline = (props: Props) => {
  const hotlineState = useFetch([], {}, 'hotline');
  return (
    <div className='navbar-center-phoneNumberbox'>
      <span className='phone'>
        {Object.keys(hotlineState.data).length > 0 && (
          <>
            <i className='fa fa-phone' />
            <span className='phoneText'>hotline</span>
            <span className='phoneNumber'>{hotlineState.data['text']}</span>
          </>
        )}
      </span>
    </div>
  );
};

export default Hotline;
