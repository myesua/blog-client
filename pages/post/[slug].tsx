import axios from 'axios';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';

// import SinglePost from '../../components/single/singlePost';

const SinglePost = dynamic(() => import('../../components/single/singlePost'), {
  ssr: false,
});

const PostSlug = ({ post }: any) => {
  return <SinglePost post={post} />;
};

export const Fetched = async () => {
  const res_ = await axios.get(`${process.env.POSTS_URL}`, {
    withCredentials: true,
  });
  const posts = await res_.data.posts;
  return {
    posts,
  };
};

export const getStaticPaths = async ({ req, res }) => {
  // Call an external API endpoint to get posts
  // const res_ = await axios.get(`${process.env.API_URL}/posts`, {
  //   withCredentials: true,
  // });
  // const posts = await res_.data.posts;
  const { posts } = await Fetched();

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post: { slug: string; rating: number }) => ({
    params: { slug: post.slug },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

// This also gets called at build time
export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params;

  const res = await axios.get(`${process.env.POSTS_URL}/post/${params?.slug}`, {
    withCredentials: true,
  });
  const post = res.data.post;
  // Pass post data to the page via props
  return { props: { post }, revalidate: 1 };
};

export default PostSlug;
