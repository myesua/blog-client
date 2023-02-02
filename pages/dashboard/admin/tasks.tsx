import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import TasksUI from '../../../components/dashboard/admin/tasksUI';
import { Context } from '../../../context/context';
import styles from '../styles.module.css';

const TasksRoute = () => {
  const { state, dispatch } = useContext(Context);
  const { auth } = state;

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

    const getTasks = async () => {
      const res = await axios.get(`${process.env.TASKS_URL}`, {
        withCredentials: true,
      });
      setTasks(res.data.tasks);
    };
    getTasks();
  }, []);

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

  return <TasksUI user={user} notification={notification} tasks={tasks} />;
};

export default TasksRoute;
