import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GetStaticProps } from 'next';
import styles from '../../styles.module.css';

import dynamic from 'next/dynamic';
import { Context } from '../../../../context/context';
import SingleTask from '../../../../components/dashboard/single/task';

// const Single = dynamic(
//   () => import('../../../components/dashboard/single/task'),
//   {
//     ssr: false,
//   },
// );

const SingleTaskRoute = ({ task }) => {
  const { state, dispatch } = useContext(Context);
  const { auth } = state;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res_ = await axios.get(`${process.env.USER_DASHBOARD_URL}`, {
          withCredentials: true,
        });
        if (res_.data.user.role === 'Super Admin') {
          setUser(res_.data.user);
        }
      } catch (err) {
        dispatch({ type: 'LOGOUT' });
        window.location.reload();
      }
    };
    auth === 'true'
      ? getUser()
      : setTimeout(() => window.location.replace('/login'), 4000);
  }, []);

  if (!user) {
    return (
      <div className={styles.loader__parent}>
        <div className={styles.loader}></div>
        <div className={styles.loader__text}>Checking for authorization...</div>
      </div>
    );
  }

  return (
    <div className={styles.animate__bottom}>
      <SingleTask task={task} />
    </div>
  );
};

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await axios.get(`${process.env.TASKS_URL}`, {
    withCredentials: true,
  });
  const { tasks } = await res.data;

  // Get the paths we want to pre-render based on posts
  const paths = tasks.map((task: { slug: string }) => ({
    params: { task: task.slug },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params;

  const res = await axios.get(`${process.env.TASKS_URL}/task/${params?.task}`, {
    withCredentials: true,
  });
  const task = res.data.task;

  // Pass post data to the page via props
  return { props: { task }, revalidate: 1 };
};

export default SingleTaskRoute;
