import React, { useContext, useEffect, useState } from 'react';
import styles from './styles.module.css';
import Image from 'next/legacy/image';
import ResetAvatar from '../../public/images/avatar.png';
import axios from 'axios';
import Header from '../header/Header';
import { useRouter } from 'next/router';
import { Context } from '../../context/context';
import Link from 'next/link';

const UnsubscribeUI = () => {
  const { dispatch } = useContext(Context);
  const router = useRouter();
  const [email, setEmail] = useState('');

  const [info, setInfo] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(!open);
  };

  const handleUnsubscribe = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.UNSUBSCRIBE_URL}`, {
        email: email,
      });
      setInfo(res.data.message);
    } catch (err) {
      if (err.message === 'Network Error')
        return <h1 style={styles}>500 - Server-side error occurred</h1>;
      else if (
        err.response.data ==
        'Too many requests coming from this IP, please try again after 15 minutes.'
      ) {
        setInfo(err.response.data);
      } else setInfo(err.response.data.message);
    }
  };

  if (info.includes('You have successfully unsubscribed.')) {
    setTimeout(() => {
      router.push('/');
    }, 4000);
  }

  return (
    <div className={styles.container}>
      <div className={styles.parent}>
        <div>
          <Link href={'/'} className={styles.logo}>
            Bechellente
          </Link>
        </div>
        <div className={styles.wrapper}>
          {info && open && (
            <div
              className={
                info.includes('You have successfully unsubscribed.')
                  ? styles.responses
                  : styles.error__responses
              }>
              <span>{info}</span>
              <i className="fa-solid fa-xmark" onClick={handleClose}></i>
            </div>
          )}
          <form onSubmit={handleUnsubscribe} className={styles.form}>
            <div className={styles.heading}></div>
            <div className={styles.form__child}>
              <div className={styles.image__container}>
                <Image
                  className={styles.image}
                  src={ResetAvatar}
                  width={100}
                  height={100}
                  alt=""
                />
              </div>

              <input
                className={styles.input__box}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                placeholder="Email"
              />
              <div className={styles.button__container}>
                <button className={styles.button} onClick={() => setOpen(true)}>
                  Unsubscribe
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnsubscribeUI;
