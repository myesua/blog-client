import React, { useContext, useEffect, useState } from 'react';
import styles from '../dashboard.module.css';
import axios from 'axios';
import Link from 'next/link';
import { Context } from '../../../context/context';
import { useRouter } from 'next/router';

const Nav = ({ user, notification, tasks }) => {
  const { dispatch } = useContext(Context);
  const router = useRouter();
  const id = user._id.toString();

  const alerts = notification?.alerts.length;

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${process.env.LOGOUT_URL}`,
        { id: id },
        {
          withCredentials: true,
        },
      );
      dispatch({ type: 'LOGOUT' });
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      dispatch({ type: 'LOGOUT' });
    }
  };
  return (
    <div className={styles.nav__container} id="nav-container">
      <div className={styles.nav}>
        <Link href="/dashboard" legacyBehavior>
          <a>
            <span id="home-icon">
              <i className="fa-solid fa-house-chimney"></i>
              <span>Dashboard</span>
            </span>
          </a>
        </Link>
        <Link href="/dashboard/notifications" legacyBehavior>
          <a>
            <span id="notification-icon">
              <i className="fa-solid fa-bell"></i>Notifications
              <span className={styles.indicator}>{alerts}</span>
            </span>
          </a>
        </Link>
        <Link href="/dashboard/write" legacyBehavior>
          <a>
            <span id="write-icon">
              <i className="fa-solid fa-square-pen"></i>Write
            </span>
          </a>
        </Link>
        <Link href="/dashboard/admin/tasks" legacyBehavior>
          <a>
            <span id="tasks-icon">
              <i className="fa-solid fa-lock"></i>
              Tasks
              {tasks.length > 0 && (
                <span className={styles.indicator}>{tasks.length}</span>
              )}
            </span>
          </a>
        </Link>

        <Link href="/dashboard/settings" legacyBehavior>
          <a>
            <span id="settings-icon">
              <i className="fa-sharp fa-solid fa-gear"></i>Settings
            </span>
          </a>
        </Link>
      </div>
      <div className={styles.logout} onClick={handleLogout}>
        <i className="fa-solid fa-right-from-bracket"></i>Logout
      </div>
    </div>
  );
};

export default Nav;
