import React, { useState } from 'react';
import styles from './styles.module.css';
import Header from '../header/Header';
import axios from 'axios';
import Image from 'next/legacy/image';
import ResetAvatar from '../../public/images/avatar.png';

const SubscriptionsUI = () => {
  const [email, setEmail] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');

  const [info, setInfo] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(!open);
  };

  const handleUpdateSubscriptionDetails = async (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.SUBSCRIPTIONS_URL}/add/details`,
        {
          email,
          firstname,
          lastname,
        },
      );
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

  return (
    <div className={styles.container}>
      <div className={styles.parent}>
        <div className={styles.logo}>Bechellente</div>
        <div className={styles.wrapper}>
          {info && open && (
            <div
              className={
                info.includes('We have updated your information with us.')
                  ? styles.responses
                  : styles.error__responses
              }>
              <span>{info}</span>
              <i className="fa-solid fa-xmark" onClick={handleClose}></i>
            </div>
          )}
          <form
            onSubmit={handleUpdateSubscriptionDetails}
            className={styles.form}>
            <div className={styles.heading}>Update Information</div>
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
              <input
                className={styles.input__box}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                name="firstname"
                placeholder="First Name"
              />
              <input
                className={styles.input__box}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                name="lastname"
                placeholder="Last Name"
              />
              <div className={styles.button__container}>
                <button className={styles.button} onClick={() => setOpen(true)}>
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsUI;
