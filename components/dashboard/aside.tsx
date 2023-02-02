import React, { useState } from 'react';
import styles from './dashboard.module.css';
import Image from 'next/legacy/image';
import Nav from './nav';
import Link from 'next/link';

const AsideUI = ({ user, notification }) => {
  const [isOpen, setIsOpen] = useState(false);
  const author = user.first_name + ' ' + user.last_name;
  const [role, setRole] = useState(user.role);
  const [picture, setPicture] = useState(user.profile_picture);
  const [bio, setBio] = useState(user.bio);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  // const check = user.role === process.env.ADMIN && tasks.length > 0;

  return (
    <div className={styles.aside__container}>
      <div className={styles.aside} id="aside">
        <div className={styles.logo}>
          <Link href={'/'}>Bechellente</Link>
        </div>
        <div className={styles.profile__container}>
          <div className={styles.profile}>
            <span className={styles.profile__image__md__lg}>
              <Image
                src={picture}
                width={100}
                height={100}
                alt="avatar"
                priority={true}
              />
            </span>
            <span className={styles.profile__image__sm}>
              <Image
                src={picture}
                width={20}
                height={20}
                alt="avatar"
                priority={true}
              />
            </span>
            <span className={styles.author__name}>{author}</span>
            <span className={styles.author}>{role}</span>
            <span className={styles.author__bio}>{bio}</span>
          </div>
          <div
            onClick={handleOpen}
            className={styles.menu__icon}
            id="menu-icon">
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>

        <div className={styles.nav__container__1}>
          <Nav user={user} notification={notification} />
        </div>
      </div>
      {isOpen && (
        <div className={styles.nav__container__2} id="nav-container-2">
          <Nav user={user} notification={notification} />
        </div>
      )}
    </div>
  );
};

export default AsideUI;
