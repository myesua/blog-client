import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from '../../components/header/Header';
import styles from './login.module.css';
import Image from 'next/legacy/image';
import visible from '../../public/icons/visible.svg';
import invisible from '../../public/icons/invisible.svg';
import ErrorInfoIcon from '../../public/icons/errorinfo.svg';
import ResetAvatar from '../../public/images/avatar.png';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Context } from '../../context/context';

const LoginUI = () => {
  const { dispatch } = useContext(Context);
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [info, setInfo] = useState('');
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Sign in
    /***
     * Password visibility check on client side only
     */
    const eyeIcon = document.getElementById('eye-icon') as HTMLImageElement;
    const passwordBox = document.querySelector('#password') as HTMLInputElement;

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

    eyeIcon.addEventListener('click', handleEyeIcon);

    return () => {
      eyeIcon.removeEventListener('click', handleEyeIcon);
    };
  }, []);

  const handleSignin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await axios.post(
        `${process.env.LOGIN_URL}`,
        { email, password },
        { withCredentials: true },
      );
      // axios.defaults.withCredentials = true;
      setInfo(res.data.message);
    } catch (err) {
      if (err.message === 'Network Error')
        return <h1 style={iStyles}>500 - Server-side error occurred</h1>;
      if (
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

  info.includes('Code sent to your email address!') &&
    setTimeout(() => router.push('/auth'), 4000);

  const handleClose = () => {
    setOpen(!open);
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
                info.includes('Code sent to your email address!')
                  ? styles.responses
                  : styles.error__responses
              }>
              <span>{info}</span>
              <i className="fa-solid fa-xmark" onClick={handleClose}></i>
            </div>
          )}
          <div className={styles.accountOptions}>
            <div className={styles.signInOption} id="sign-in">
              <span>Sign In</span>
            </div>
          </div>
          <form
            className={styles.signin}
            id="sign-in-form"
            onSubmit={handleSignin}>
            <div className={styles.image__container}>
              <Image
                className={styles.image}
                src={ResetAvatar}
                width={100}
                height={100}
                alt=""
              />
            </div>
            <div className={styles.formWrapper}>
              <div>
                <input
                  className={styles.textBox}
                  data-target="email-input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  ref={emailRef}
                />
              </div>
              <div>
                <div className={styles.passContainer}>
                  <input
                    className={styles.passBox}
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    ref={passwordRef}
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
              </div>
              <button
                className={styles.action}
                id="signin-submit"
                type="submit"
                onClick={() => setOpen(true)}>
                Sign in
              </button>
            </div>
            <Link href="/recover">
              <p className={styles.recoverKey}>Forgot your password?</p>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginUI;
