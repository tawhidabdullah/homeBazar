import React from 'react';
import spinner from '../../assets/gifs/spinner2.gif';

const Spinner = () => {
  return (
    <div
      style={{
        width: '50px',
        display: 'block',
        margin: 'auto',
        padding: '50px 0',
      }}
    >
      <img
        src={spinner}
        style={{ width: '50px', display: 'block', margin: 'auto' }}
        alt='Loading...'
      />
    </div>
  );
};

export default Spinner;
