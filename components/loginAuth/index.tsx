import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../context/context';
import Header from '../header/Header';
import styles from './styles.module.css';

const LoginAuthUI = () => {
  const { dispatch } = useContext(Context);
  const router = useRouter();
  const [firstInt, setFirstInt] = useState('');
  const [secondInt, setSecondInt] = useState('');
  const [thirdInt, setThirdInt] = useState('');
  const [fourthInt, setFourthInt] = useState('');
  const [fifthInt, setFifthInt] = useState('');
  const [lastInt, setLastInt] = useState('');
  const [info, setInfo] = useState('');

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    document.getElementById('ist').focus();
  }, []);

  function clickEvent(first, last) {
    if (first?.value?.length) {
      typeof window !== 'undefined' && document.getElementById(last).focus();
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.LOGINAUTH_URL}`,
        {
          otp: int,
        },
        { withCredentials: true },
      );
      setInfo(res.data.message);
      dispatch({ type: 'LOGIN_SUCCESS', payload: 'true' });
    } catch (err) {
      if (err.message === 'Network Error')
        return <h1 style={iStyles}>500 - Server-side error occurred</h1>;
      else if (
        err.response.data ==
        'Too many requests coming from this IP, please try again after 15 minutes.'
      ) {
        setInfo(err.response.data);
      } else setInfo(err.response.data.message);
      dispatch({ type: 'LOGIN_FAILURE', payload: 'false' });
    }
  };

  const int = firstInt + secondInt + thirdInt + fourthInt + fifthInt + lastInt;

  const iStyles = {
    display: 'grid',
    placeItems: 'center',
    height: '100vh',
    width: '100%',
    color: 'var(--error-color)',
  };

  info.includes('You have been successfully logged in!') &&
    setTimeout(() => router.push('/'), 4000);

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
                info.includes('You have been successfully logged in!')
                  ? styles.responses
                  : styles.error__responses
              }>
              <span>{info}</span>
              <i className="fa-solid fa-xmark" onClick={handleClose}></i>
            </div>
          )}
          <form className={styles.form} onSubmit={handleSubmit}>
            <legend className={styles.legend}>Verify Token</legend>
            <div className={styles.inputs}>
              <input
                type="text"
                id="ist"
                maxLength={1}
                onKeyUp={(e: any) => {
                  clickEvent(e.target, 'sec');
                  setFirstInt(e.target.value);
                }}
              />
              <input
                type="text"
                id="sec"
                maxLength={1}
                onKeyUp={(e: any) => {
                  clickEvent(e.target, 'third');
                  setSecondInt(e.target.value);
                }}
              />
              <input
                type="text"
                id="third"
                maxLength={1}
                onKeyUp={(e: any) => {
                  clickEvent(e.target, 'fourth');
                  setThirdInt(e.target.value);
                }}
              />
              <input
                type="text"
                id="fourth"
                maxLength={1}
                onKeyUp={(e: any) => {
                  clickEvent(e.target, 'fifth');
                  setFourthInt(e.target.value);
                }}
              />
              <input
                type="text"
                id="fifth"
                maxLength={1}
                onKeyUp={(e: any) => {
                  clickEvent(e.target, 'sixth');
                  setFifthInt(e.target.value);
                }}
              />
              <input
                type="text"
                id="sixth"
                maxLength={1}
                onKeyUp={(e: any) => setLastInt(e.target.value)}
              />
            </div>
            <div className={styles.form__group__btn}>
              <button
                className={styles.button}
                type="submit"
                onClick={() => setOpen(true)}>
                Let's go
              </button>
            </div>
            <div className={styles.login}>
              Something went wrong?{' '}
              <Link href={'/login'}>
                <strong>Resend code</strong>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginAuthUI;
