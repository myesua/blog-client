import React from 'react';
import NotificationUI from '../notification';
import styles from './styles.module.css';

const NotificationsUI = ({ notification, noIndex }) => {
  return (
    <div className={styles.notification__container} id="notification-page">
      <div className={styles.notification}>
        {notification.alerts
          .map((a: { title: string; text: string }, index: number) => {
            const pending = (
              <i
                className="fa-solid fa-circle-info"
                style={{ color: 'var(--bg-color-primary)' }}></i>
            );
            const approved = (
              <i
                className="fa-solid fa-circle-check"
                style={{ color: 'var(--bg-color-alt)' }}></i>
            );
            const rejected = (
              <i
                className="fa-solid fa-circle-exclamation"
                style={{ color: 'var(--bg-color-red)' }}></i>
            );
            const security = (
              <i
                className="fa-solid fa-circle-exclamation"
                style={{ color: 'var(--bg-color-warning)' }}></i>
            );

            let icon: JSX.Element;

            if (a.title == 'New Article submitted for review') {
              icon = pending;
            } else if (
              a.text.match('has been approved') &&
              a.text.match('titled')
            ) {
              icon = approved;
            } else if (
              a.text.match('was not approved') &&
              a.text.match('titled')
            ) {
              icon = rejected;
            } else if (a.title.match('security')) {
              icon = security;
            }

            return <NotificationUI a={a} icon={icon} index={index} />;
          })
          .reverse()}
      </div>
    </div>
  );
};

export default NotificationsUI;
