import axios from 'axios';
import { useState, useRef } from 'react';
import card from './subscription.module.css';

const Subscription = () => {
  const [info, setInfo] = useState('You must agree to our terms of service.');
  const [email, setEmail] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const bRef = useRef<HTMLInputElement>(null);
  const refEl = ref.current;
  const bRefEl = bRef.current;

  const [open, setOpen] = useState(false);

  const handleSubscriptionReq = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (ref && bRefEl && refEl.checked !== true) {
      setOpen(true);
    } else {
      try {
        const res = await axios.post(`${process.env.SUBSCRIPTIONS_URL}/add`, {
          email,
        });
        setInfo(res.data.message);
      } catch (err) {
        if (
          err.response.data ==
          'Too many requests coming from this IP, please try again after 15 minutes.'
        ) {
          setInfo(err.response.data);
        } else setInfo(err.response.data.message);
      }
    }
  };

  return (
    <div className={card.subscription__container}>
      <form className={card.subscription__body}>
        <header>
          <h5 className={card.subscription__header}>
            Sign up to receive our headlines in your inbox
          </h5>
        </header>
        {open && (
          <div
            className={
              info.includes(
                'You must agree to our terms of service.' ||
                  'Too many requests coming from this IP, please try again after 15 minutes.',
              )
                ? card.error
                : card.info
            }>
            {info}
          </div>
        )}
        <div className={card.subscription__input}>
          <input
            type="email"
            placeholder="Email Address"
            aria-required="true"
            aria-invalid="true"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={card.subscription__submit}>
            <button
              className={card.subscription__arrow}
              type="submit"
              ref={bRef}
              onClick={handleSubscriptionReq}>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
        <div className={card.subscription__agreement}>
          <label className={card.subscription__label}>
            <input type="checkbox" required={true} ref={ref} />
            <span className={card.checkmark}></span>
          </label>
          <p>
            I agree to provide my email address to &quot;Bechellente Ltd&quot;
            to receive information about its products and services. I understand
            that I can withdraw this consent at any time via e-mail by clicking
            the &quot;unsubscribe&quot; link that I find at the bottom of any
            e-mail sent to me for the purposes mentioned above.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Subscription;
