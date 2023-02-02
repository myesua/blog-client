import React, { useContext, useEffect, useState } from 'react';
import styles from './reset.module.css';
import Header from '../header/Header';
import Image from 'next/legacy/image';
import ResetAvatar from '../../public/images/avatar.png';
import visible from '../../public/icons/visible.svg';
import invisible from '../../public/icons/invisible.svg';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Context } from '../../context/context';
import Link from 'next/link';

const ResetPassword = () => {
  const { dispatch } = useContext(Context);
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [inputError, setInputError] = useState('');
  const router = useRouter();

  const [info, setInfo] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const password = document.querySelector('#password') as HTMLInputElement;
    const confirmPassword = document.querySelector(
      '#confirm-password',
    ) as HTMLInputElement;
    const actionBtn = document.querySelector(
      '#action-btn',
    ) as HTMLButtonElement;

    const checkPasswordMatch = () => {
      if (password.value !== confirmPassword.value) {
        actionBtn.disabled = true;
        setInputError('Password mismatch!');
      } else {
        actionBtn.disabled = false;
        setInputError('');
      }
    };

    function debounce(callback, wait) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          callback.apply(this, args);
        }, wait);
      };
    }

    confirmPassword.addEventListener(
      'keyup',
      debounce(() => {
        checkPasswordMatch();
      }, 1000),
    );
  }, []);
  useEffect(() => {
    const eyeIcon = document.getElementById('eye-icon') as HTMLImageElement;
    const eyeIcon2 = document.getElementById('eye-icon-2') as HTMLImageElement;
    const passwordBox = document.querySelector('#password') as HTMLInputElement;
    const confirmPasswordBox = document.querySelector(
      '#confirm-password',
    ) as HTMLInputElement;

    let initialState = false;
    const handleEyeIcon = () => {
      if (!initialState) {
        initialState = true;
        passwordBox.type = 'text';
        eyeIcon.src = invisible.src;
        eyeIcon.srcset = invisible.src;
      } else {
        initialState = false;
        passwordBox.type = 'password';
        eyeIcon.src = visible.src;
        eyeIcon.srcset = visible.src;
      }
    };

    const handleEyeIcon2 = () => {
      if (!initialState) {
        initialState = true;
        confirmPasswordBox.type = 'text';
        eyeIcon2.src = invisible.src;
        eyeIcon2.srcset = invisible.src;
      } else {
        initialState = false;
        confirmPasswordBox.type = 'password';
        eyeIcon2.src = visible.src;
        eyeIcon2.srcset = visible.src;
      }
    };

    eyeIcon.addEventListener('click', handleEyeIcon);
    eyeIcon2.addEventListener('click', handleEyeIcon2);

    return () => {
      eyeIcon.removeEventListener('click', handleEyeIcon);
      eyeIcon2.removeEventListener('click', handleEyeIcon2);
    };
  }, []);

  const handleReset = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.RESET_URL}`, {
        token: token,
        password: password,
        confirmPassword: password,
      });
      setInfo(res.data.message);
    } catch (err) {
      if (err.message === 'Network Error')
        return <h1 style={iStyles}>500 - Server-side error occurred</h1>;
      else if (
        err.response.data ==
        'Too many requests coming from this IP, please try again after 15 minutes.'
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

  if (info.includes('Your password has been changed!')) {
    setTimeout(() => {
      dispatch({ type: 'LOGOUT' });
      router.push('/login');
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
                info.includes('Your password has been changed!')
                  ? styles.responses
                  : styles.error__responses
              }>
              <span>{info}</span>
              <i className="fa-solid fa-xmark" onClick={handleClose}></i>
            </div>
          )}
          <form onSubmit={handleReset} className={styles.form}>
            <div className={styles.heading}>Reset Password</div>
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
                onChange={(e) => setToken(e.target.value)}
                type="text"
                name="resetToken"
                placeholder="Reset Token"
              />
              <div className={styles.input__container}>
                <input
                  className={styles.input__box}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  placeholder="New Password"
                  id="password"
                />
                <span className={styles.visibility}>
                  <Image
                    src={visible}
                    id="eye-icon"
                    height={25}
                    alt="see password as you type"
                    priority
                  />
                </span>
              </div>
              <div className={styles.input__container}>
                <input
                  className={styles.input__box}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  id="confirm-password"
                />
                <span className={styles.visibility}>
                  <Image
                    src={visible}
                    id="eye-icon-2"
                    height={25}
                    alt="see password as you type"
                    priority
                  />
                </span>
              </div>
              <div className={styles.button__container}>
                <button
                  type="submit"
                  className={styles.button}
                  id="action-btn"
                  onClick={() => setOpen(true)}>
                  Continue
                </button>
              </div>
              <span className={styles.input__error}>{inputError}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
