import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import Posts from '../components/home';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Context } from '../context/context';

const styles = {
  display: 'grid',
  placeItems: 'center',
};

const Home: NextPage = () => {
  const { posts, tips } = useContext(Context);
  return <Posts posts={posts} tips={tips} />;
};

export default Home;
