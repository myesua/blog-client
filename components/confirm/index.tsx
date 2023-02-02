import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Header from '../header/Header';
import styles from './styles.module.css';

const ConfirmUI = () => {
  const [email, setEmail] = useState('');
  const [info, setInfo] = useState('');

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(!open);
  };
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.CONFIRM_URL}`, {
        email,
      });
      setInfo(res.data.message);
    } catch (err) {
      if (err.message === 'Network Error')
        return <h1 style={iStyles}>500 - Server-side error occurred</h1>;
      else if (
        err.response.data ==
        'Too many requests coming from this IP, please try again after 15 minutes'
      ) {
        setInfo(err.response.data);
      } else setInfo(err.response.data.message);
    }
  };

  const iStyles = {
    display: 'grid',
    placeItems: 'center',
    height: '100vh',
    width: '100%',
    color: 'var(--error-color)',
  };
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
                info.includes('Verification token sent to your email address')
                  ? styles.responses
                  : styles.error__responses
              }>
              <span>{info}</span>
              <i className="fa-solid fa-xmark" onClick={handleClose}></i>
            </div>
          )}
          <form className={styles.form} onSubmit={handleSubmit}>
            <legend className={styles.legend}>Confirm Your Account</legend>
            <div>
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="Email e.g example@bechellente.com"
                // pattern="^[A-Za-z0-9._%+-]+@bechellente.com$"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.form__group__btn}>
              <button
                className={styles.button}
                type="submit"
                onClick={() => setOpen(true)}>
                Resend
              </button>
            </div>
            <div className={styles.login}>
              Already confirmed your account?{' '}
              <Link href={'/login'}>
                <strong>Log in</strong>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmUI;
