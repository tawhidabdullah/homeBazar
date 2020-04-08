import React from 'react';
import ContentLoader from 'react-content-loader';

const ProductPlaceholder = () => {
  return (
    <ContentLoader
      viewBox='0 0 1200 400'
      height={400}
      width={1200}
      speed={2}
      backgroundColor='#eee'
      foregroundColor='#ccc'
    >
      <circle cx='592' cy='159' r='20' />
      <rect x='620' y='144' rx='5' ry='10' width='100%' height='30' />

      <circle cx='592' cy='210' r='20' />
      <rect x='620' y='194' rx='5' ry='5' width='100%' height='30' />

      <circle cx='592' cy='259' r='20' />
      <rect x='620' y='244' rx='5' ry='5' width='100%' height='30' />

      <circle cx='592' cy='310' r='20' />
      <rect x='620' y='295' rx='5' ry='5' width='100%' height='  30' />

      <rect x='64' y='18' rx='0' ry='0' width='500' height='500' />
      <rect x='229' y='300' rx='0' ry='0' width='0' height='0' />
      <rect x='111' y='340' rx='0' ry='0' width='0' height='0' />
      <rect x='121' y='342' rx='0' ry='0' width='0' height='0' />
      <rect x='10' y='20' rx='0' ry='0' width='40' height='44' />
      <rect x='10' y='80' rx='0' ry='0' width='40' height='44' />
      <rect x='10' y='140' rx='0' ry='0' width='40' height='44' />
      <rect x='194' y='329' rx='0' ry='0' width='0' height='0' />
      <rect x='192' y='323' rx='0' ry='0' width='0' height='0' />
      <rect x='185' y='323' rx='0' ry='0' width='0' height='0' />
      <rect x='10' y='200' rx='0' ry='0' width='40' height='44' />

      <rect x='580' y='20' rx='0' ry='0' width='100%' height='25' />
      <rect x='580' y='60' rx='0' ry='0' width='100%' height='20' />
      <rect x='580' y='100' rx='0' ry='0' width='100%' height='20' />

      <rect x='731' y='132' rx='0' ry='0' width='0' height='0' />
    </ContentLoader>
  );
};

export default ProductPlaceholder;
