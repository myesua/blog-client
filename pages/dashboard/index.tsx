import React, { useContext, useEffect, useState } from 'react';
import styles from './styles.module.css';
import AdminMain from '../../components/dashboard/admin/main_';
import AdminAsideUI from '../../components/dashboard/admin/adminAside';
import Main from '../../components/dashboard/main_';
import AsideUI from '../../components/dashboard/aside';
import { Context } from '../../context/context';

import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const { state, dispatch } = useContext(Context);
  const { auth } = state;
  const router = useRouter();

  const [info, setInfo] = useState('');
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tips, setTips] = useState([]);
  const [pending, setPending] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [notification, setNotification] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res_ = await axios.get(`${process.env.USER_DASHBOARD_URL}`, {
          withCredentials: true,
        });
        setUser(res_.data.user);
        setPosts(res_.data.posts);
        setTips(res_.data.tips);
        setPending(res_.data.pending);
        setRejected(res_.data.rejected);
        setNotification(res_.data.notification);
        if (res_.data.user.role === process.env.ADMIN) {
          try {
            const res = await axios.get(`${process.env.TASKS_URL}`, {
              withCredentials: true,
            });
            setTasks(res.data.tasks);
          } catch (err) {}
        }
      } catch (err) {
        if (err.message === 'Network Error')
          return <h1 style={iStyles}>500 - Server-side error occurred</h1>;
        else if (
          err.response.data ==
          'Too many requests coming from this IP, please try again after 15 minutes.'
        ) {
          setInfo(err.response.data);
        } else setInfo(err.response.data.message);
        dispatch({ type: 'LOGOUT' });
        window.location.reload();
      }
    };
    auth === 'true'
      ? getUser()
      : setTimeout(() => window.location.replace('/login'), 4000);
  }, [auth]);

  const iStyles = {
    display: 'grid',
    placeItems: 'center',
    height: '100vh',
    width: '100%',
    color: 'var(--error-color)',
  };

  if (info) {
    return (
      <div className={styles.info__container}>
        <div>{info}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loader__parent}>
        <div className={styles.loader}></div>
        <div className={styles.loader__text}>
          Checking for an authenticated session...
        </div>
      </div>
    );
  }

  if (user.role === process.env.ADMIN) {
    return (
      <div className={`${styles.container} ${styles.animate__bottom}`}>
        <div className={styles.wrapper}>
          <div className={styles.aside}>
            <AdminAsideUI
              user={user}
              notification={notification}
              tasks={tasks}
            />
          </div>
          <div className={styles.main}>
            <AdminMain
              user={user}
              posts={posts}
              tips={tips}
              pending={pending}
              rejected={rejected}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${styles.animate__bottom}`}>
      <div className={styles.wrapper}>
        <div className={styles.aside}>
          <AsideUI user={user} notification={notification} />
        </div>
        <div className={styles.main}>
          <Main
            user={user}
            posts={posts}
            tips={tips}
            pending={pending}
            rejected={rejected}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
