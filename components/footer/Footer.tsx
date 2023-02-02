import styles from './footer.module.css';
import Image from 'next/legacy/image';
import Link from 'next/link';

import Twitter from '../../public/icons/footer/icons/twitter.svg';
import Youtube from '../../public/icons/footer/icons/youtube.svg';
import Facebook from '../../public/icons/footer/icons/facebook.svg';

const Footer = () => {
  return (
    <div>
      <footer className={styles.footer}>
        <div className={styles.footer__action}>
          <h5>Give your vehicle a proper mechanical attention</h5>
          <p>
            General car maintenance is key in keeping your vehicle in good
            condition and avoiding unnecessary expenses. We at Bechellente
            provides free to premium consultation on vehicle repairs and
            maintenance. Our services are aimed at reducing time and cost for
            you. You can reach out to us anytime. We are always available 24 / 7
            for your needs.
          </p>
          <p></p>
          <button>Talk to a mechanic</button>
        </div>

        <div className={styles.footer__social} id="footer-social">
          <h5 id="footer-h5">Follow us on</h5>
          <ul className={styles.fs__icons}>
            <li>
              <Link href="/">
                <Image
                  className={styles.fs__icons__img}
                  src={Twitter}
                  width={40}
                  height={40}
                  alt="Twitter"
                />
              </Link>
            </li>
            <li>
              <Link href="/">
                <Image
                  className={styles.fs__icons__img}
                  src={Youtube}
                  width={40}
                  height={40}
                  alt="Twitter"
                />
              </Link>
            </li>
            <li>
              <Link href="/">
                <Image
                  className={styles.fs__icons__img}
                  src={Facebook}
                  width={40}
                  height={40}
                  alt="Twitter"
                />
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.footer__privacy} id="footer-privacy">
          <span>
            Copyright &copy; 2022 Bechellente Technologies. All Rights Reserved.
          </span>
          <ul>
            <li>
              <Link href="/" legacyBehavior>
                <a id="footer-link">Privacy Policy</a>
              </Link>
            </li>
            <li>|</li>
            <li>
              <Link href="/" legacyBehavior>
                <a id="footer-link">About Bechellente</a>
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
