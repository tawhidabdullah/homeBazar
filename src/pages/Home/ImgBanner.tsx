import React from 'react';

interface Props {}

const ImgBanner = (props: Props) => {
  return (
    <div className='imgBannerContainer'>
      <div className='imgBanner-imgContainer'>
        <div className='imgBanner-overlay'></div>
        <img
          src='https://images.unsplash.com/photo-1537498425277-c283d32ef9db?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1057&q=80'
          alt='banner Img'
        />
      </div>

      <div className='imgBanner-imgContainer'>
        <div className='imgBanner-overlay'></div>
        <img
          src='https://images.unsplash.com/photo-1537498425277-c283d32ef9db?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1057&q=80'
          alt='banner Img'
        />
      </div>

      <div className='imgBanner-imgContainer'>
        <div className='imgBanner-overlay'></div>
        <img
          src='https://images.unsplash.com/photo-1537498425277-c283d32ef9db?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1057&q=80'
          alt='banner Img'
        />
      </div>
    </div>
  );
};

export default ImgBanner;
