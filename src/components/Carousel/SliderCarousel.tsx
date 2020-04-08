import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

interface Props {
  imagesContents: any[];
}

const SliderCarousel = ({ imagesContents }: Props) => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {imagesContents.length > 0 &&
        imagesContents.map(({ src, target }) => {
          return (
            <Carousel.Item key={src}>
              <a href={target}>
                <img
                  className='d-block w-100 carousleImage'
                  src={src}
                  alt='Slider Img'
                />
              </a>
            </Carousel.Item>
          );
        })}
    </Carousel>
  );
};

export default SliderCarousel;
