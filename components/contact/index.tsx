import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import Image from 'next/legacy/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ContactUI = () => {
  const [info, setInfo] = useState('');
  const mRef = useRef<HTMLSpanElement>(null);
  const mRefEl = mRef.current;

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');

  const router = useRouter();

  useEffect(() => {
    const inputBoxes = Array.from(
      document.querySelectorAll('[data-target="#input-box"]'),
    );

    inputBoxes.forEach((box) =>
      box.addEventListener('focusin', (e: any) => {
        const el = e.target.previousElementSibling as HTMLLabelElement;
        el.setAttribute('style', 'color: var(--text-color-secondary)');
      }),
    );

    inputBoxes.forEach((box) =>
      box.addEventListener('focusout', (e: any) => {
        const el = e.target.previousElementSibling as HTMLLabelElement;
        el.removeAttribute('style');
      }),
    );
  }, []);

  const sendEnquiry = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.API_URL}/enquiries`, {
        firstname,
        lastname,
        phone,
        email,
        text,
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

  const infoStyle = info
    ? `${styles.message} ${styles.animate}`
    : styles.message;

  if (info) {
    mRefEl.addEventListener('animationend', () => {
      mRefEl.style.display = 'none';
    });
  }

  return (
    <div className={styles.container}>
      <div>
        <Link href={'/'} className={styles.logo}>
          Bechellente
        </Link>
      </div>
      <form className={styles.contact} onSubmit={sendEnquiry}>
        <div className={styles.title__first}>
          Your information
          <span className={infoStyle} ref={mRef} id="message">
            {info && <i className="fa-solid fa-check"></i>}
            <span>{info}</span>
          </span>
        </div>
        <div className={styles.parent}>
          <div className={styles.wrapper}>
            <label id="label">
              First Name <span style={{ color: '#f00' }}>*</span>
            </label>
            <input
              className={styles.input__box}
              onChange={(e) => setFirstName(e.target.value)}
              data-target="#input-box"
              type="text"
              name="firstname"
              defaultValue={firstname}
              required
            />
          </div>
          <div className={styles.wrapper}>
            <label id="label">
              Last Name <span style={{ color: '#f00' }}>*</span>
            </label>
            <input
              className={styles.input__box}
              onChange={(e) => setLastName(e.target.value)}
              data-target="#input-box"
              type="text"
              name="lastname"
              defaultValue={lastname}
              required
            />
          </div>
        </div>
        <div className={styles.parent}>
          <div className={styles.wrapper}>
            <label className={styles.phone} id="label">
              Phone Number
            </label>
            <input
              className={styles.input__box__phone}
              onChange={(e) => setPhone(e.target.value)}
              data-target="#input-box"
              type="tel"
              name="phone"
              pattern="[0-9]{11}"
              defaultValue={phone}
            />
          </div>
          <div className={styles.wrapper}>
            <label>
              Email <span style={{ color: '#f00' }}>*</span>
            </label>
            <input
              className={styles.input__box__email}
              data-target="#input-box"
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className={styles.wrapper}>
          <label>Please explain to us your need</label>
          <textarea
            rows={10}
            cols={10}
            className={styles.text}
            defaultValue={text}
            onChange={(e) => setText(e.target.value)}
            required></textarea>
        </div>
        <div className={styles.save_change}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ContactUI;
