import React, { useContext, useEffect, useState } from 'react';
import styles from './styles.module.css';
import AsideUI from '../../components/dashboard/aside';
import AdminAsideUI from '../../components/dashboard/admin/adminAside';
import NotificationsUI from '../../components/dashboard/notifications';
import axios from 'axios';
import { Context } from '../../context/context';

const NotificationRoute = () => {
  const { state, dispatch } = useContext(Context);
  const { auth } = state;

  const [info, setInfo] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res_ = await axios.get(`${process.env.USER_DASHBOARD_URL}`, {
          withCredentials: true,
        });
        setUser(res_.data.user);
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

  let noIndex = false;
  if (notification.alerts.length === 0) {
    noIndex = true;
  }

  return (
    <div className={`${styles.container} ${styles.animate__bottom}`}>
      <div className={styles.wrapper}>
        <div className={styles.aside}>
          {user.role === process.env.ADMIN ? (
            <AdminAsideUI
              user={user}
              notification={notification}
              tasks={tasks}
            />
          ) : (
            <AsideUI user={user} notification={notification} />
          )}
        </div>
        <div className={styles.main}>
          <NotificationsUI notification={notification} noIndex={noIndex} />
        </div>
      </div>
    </div>
  );
};

export default NotificationRoute;
