import Link from 'next/link';
import React, { useState, useEffect, useRef, useContext } from 'react';
import styles from './Header.module.css';
import MenuIcon from '../../public/icons/menuicon.svg';
import Image from 'next/legacy/image';

import { useRouter } from 'next/router';
import axios from 'axios';
import { Context } from '../../context/context';

const Header = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const { state } = useContext(Context);
  const { auth } = state;
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, [hydrated]);

  const handleHiddenNav = () => {
    setOpen(!isOpen);
  };

  return (
    <div className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Image
            src={MenuIcon}
            width={25}
            height={25}
            layout="fixed"
            alt=""
            onClick={handleHiddenNav}
            priority
          />
          <Link href="/" legacyBehavior>
            <span>
              <a>Bechellente</a>
            </span>
          </Link>
        </div>

        <ul className={styles.toplinks}>
          <li>
            <Link href="/" legacyBehavior>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/products" legacyBehavior>
              <a>Products</a>
            </Link>
          </li>
          <li>
            <Link href="/services" legacyBehavior>
              <a>Services</a>
            </Link>
          </li>
          {hydrated && auth === 'false' ? (
            <li>
              <Link href="/login" legacyBehavior>
                <a>Login</a>
              </Link>
            </li>
          ) : (
            <li>
              <Link href="/dashboard" legacyBehavior>
                <a>Dashboard</a>
              </Link>
            </li>
          )}
        </ul>

        <span className={styles.topsearch}>
          <input
            type="search"
            placeholder="Search blog posts"
            id="search-input"
          />
        </span>
        {isOpen && (
          <div className={styles.hiddenNav} ref={ref}>
            {/* <span
              className={styles.hiddenNav__closebtn}
              onClick={handleHiddenNav}>
              ⨉
            </span> */}
            <ul>
              <li>
                <Link href="/" legacyBehavior>
                  <a onClick={handleHiddenNav}>Home</a>
                </Link>
              </li>
              <li>
                <Link href="/" legacyBehavior>
                  <a onClick={handleHiddenNav}>About us</a>
                </Link>
              </li>

              <li>
                {auth === 'false' ? (
                  <Link href="/login" legacyBehavior>
                    <a onClick={handleHiddenNav}>Login</a>
                  </Link>
                ) : (
                  <Link href="/dashboard" legacyBehavior>
                    <a onClick={handleHiddenNav}>Dashboard</a>
                  </Link>
                )}
              </li>
              <li>
                <Link href="#latest" legacyBehavior>
                  <a onClick={handleHiddenNav}>Latest</a>
                </Link>
              </li>
              <li>
                <Link href="#popular" legacyBehavior>
                  <a onClick={handleHiddenNav}>Popular</a>
                </Link>
              </li>
              <li>
                <Link href="#tips" legacyBehavior>
                  <a onClick={handleHiddenNav}>Tips</a>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;
