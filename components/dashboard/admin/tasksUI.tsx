import React from 'react';
import AdminAsideUI from './adminAside';
import Tasks from './tasks';
import styles from './styles.module.css';

const TasksUI = ({ user, notification, tasks }) => {
  return (
    <div className={`${styles.container} ${styles.animate__bottom}`}>
      <div className={styles.wrapper}>
        <div className={styles.aside}>
          <AdminAsideUI user={user} notification={notification} tasks={tasks} />
        </div>
        <div className={styles.main}>
          <Tasks tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default TasksUI;
