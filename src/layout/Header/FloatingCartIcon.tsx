import React from 'react';

interface Props {
  isShowCartBar: boolean;
  isCartIconVisiable: boolean;
  handleToggleCartBar: () => void;
  cartLength: number;
  windowWidth: number;
}

const FloatingCartIcon = ({
  isShowCartBar,
  isCartIconVisiable,
  handleToggleCartBar,
  cartLength,
  windowWidth,
}: Props) => {
  return (
    <>
      {windowWidth > 600 && !isShowCartBar && isCartIconVisiable ? (
        <div className='floatingCartIconContainer'>
          <div
            onClick={handleToggleCartBar}
            className='floatingCartIconContainerInside'
          >
            <span className='floatingCartIconBatch'>
              {cartLength ? ` ${cartLength}` : 0}
            </span>
            <span className='floatingCartIcon'>
              <i className='fa fa-shopping-cart'></i>
            </span>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default FloatingCartIcon;
