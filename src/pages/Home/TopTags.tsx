import React, { useEffect, useState } from 'react';
import { useFetch, useHandleFetch } from '../../hooks';

interface Props {
  history: any;
  tag: any;
  addTag: (any) => void;
}

const TopTags = ({ history, tag, addTag }: Props) => {
  const [tagListState, handleTagListFetch] = useHandleFetch([], 'tagList');

  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (tag.length > 0) {
      setTags(tag);
    } else {
      const getTags = async () => {
        const tags = await handleTagListFetch({});
        // @ts-ignore
        if (tags) {
          // @ts-ignore
          setTags(tags);
          addTag(tags);
        }
      };

      getTags();
    }
  }, []);

  return (
    <div className='top-tags'>
      <h5 className='top-tags-desc'>Top Tags:</h5>

      <div className='tags'>
        {tags.length > 0 &&
          tags.map((tagItem) => {
            return (
              <h5
                key={tagItem['id']}
                onClick={() =>
                  history.push({
                    pathname: `/productList/${tagItem['id']}`,
                    state: { isTag: true },
                  })
                }
              >
                {tagItem['name']}
              </h5>
            );
          })}
      </div>
    </div>
  );
};

export default TopTags;
