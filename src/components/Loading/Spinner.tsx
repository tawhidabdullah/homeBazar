import React from 'react';
import spinner from '../../assets/gifs/spinner.gif';

const Spinner = () => {
  return (
    <div
      style={{
        width: '70px',
        display: 'block',
        margin: 'auto',
        paddingTop: '50px'
      }}
    >
      <img
        src={spinner}
        style={{ width: '70px', display: 'block', margin: 'auto' }}
        alt='Loading...'
      />
    </div>
  );
};

export default Spinner;
