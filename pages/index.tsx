import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Posts from '../components/posts/posts';
import axios from 'axios';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const [posts, setPosts] = useState([]);
  const [tips, setTips] = useState([]);
  const { asPath } = useRouter();

  useEffect(() => {
    const getPosts = async () => {
      const res = await axios.get(`${process.env.API_URI}/posts${asPath}`);
      setPosts(res.data);
    };
    const getTips = async () => {
      const res = await axios.get(`${process.env.API_URI}/tips${asPath}`);
      setTips(res.data);
    };
    getPosts();
    getTips();
  }, [asPath, posts, tips]);

  return <Posts posts={posts} tips={tips} />;
};

export default Home;
