import React, { useEffect, useState } from 'react';
import { SliderCarousel } from '../../components/Carousel';
import { useFetch, useHandleFetch } from '../../hooks';
import { checkIfItemExistsInCache } from '../../utils';
interface Props {
  addItemToCache: (any) => void;
  cache: any;
}

const Slider = ({ addItemToCache, cache }: Props) => {
  const [sliderState, handleSliderStateFetch] = useHandleFetch([], 'slider');

  const [slider, setSlider] = useState([]);

  useEffect(() => {
    if (checkIfItemExistsInCache(`slider`, cache)) {
      const slider = cache['slider'];
      setSlider(slider);
    } else {
      const getAndSetSlider = async () => {
        const slider = await handleSliderStateFetch({});
        // @ts-ignore
        if (slider) {
          // @ts-ignore
          setSlider(slider);
          addItemToCache({
            slider: slider,
          });
        }
      };

      getAndSetSlider();
    }
  }, []);

  return (
    <div className='col-md-7 col-sm-12 image-slider-section-carousel'>
      {slider.length > 0 && <SliderCarousel imagesContents={slider} />}
    </div>
  );
};

export default Slider;
