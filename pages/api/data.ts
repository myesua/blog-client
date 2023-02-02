import { useContext } from 'react';
import { Context } from '../../context/context';

export const Posts = () => {
  const { posts } = useContext(Context);
  return {
    data: posts,
  };
};
