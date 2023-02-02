import Link from 'next/link';
import React, { useState, useEffect, useRef, useContext } from 'react';
import styles from './styles.module.css';
import hStyles from '../header/Header.module.css';
import MenuIcon from '../../public/icons/menuicon.svg';
import Image from 'next/legacy/image';

import { useRouter } from 'next/router';
import axios from 'axios';
import { Context } from '../../context/context';

const Search = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [blur, setBlur] = useState(false);

  const [info, setInfo] = useState('');
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const { state } = useContext(Context);
  const { auth } = state;
  const router = useRouter();
  const sRef = useRef<HTMLInputElement>(null);
  const sRefEl = sRef.current;

  useEffect(() => {
    setHydrated(true);
  }, [hydrated]);

  useEffect(() => {
    const getSearchResults = async () => {
      if (!query || query.length === 0 || query.length > 3) {
        setSearchResult([]);
        return false;
      }
      if (query.length > 2) {
        try {
          const res = await axios.get(`${process.env.POSTS_URL}`, {
            params: {
              search: query,
            },
          });
          setSearchResult(res.data);
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
      }
    };
    getSearchResults();
  }, [query]);

  const handleChange = (e: any) => {
    setQuery(e.target.value);
  };

  const handleHiddenNav = () => {
    setOpen(!isOpen);
  };

  const iStyles = {
    display: 'grid',
    placeItems: 'center',
    height: '100vh',
    width: '100%',
    color: 'var(--error-color)',
  };

  if (info) {
    return (
      <div style={iStyles}>
        <div>{info}</div>
      </div>
    );
  }
  return (
    <div>
      <div className={hStyles.header}>
        <nav className={hStyles.nav}>
          <div className={hStyles.logo}>
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

          <ul className={hStyles.toplinks}>
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

          <span className={hStyles.topsearch}>
            <input
              type="search"
              placeholder="Search blog posts"
              id="search-input"
              onChange={handleChange}
              ref={sRef}
            />
          </span>
          {isOpen && (
            <div className={hStyles.hiddenNav} ref={ref}>
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
        <div className={styles.search__box}>
          <input
            type="search"
            placeholder="Start searching..."
            id="search-input"
            onChange={handleChange}
            ref={sRef}
            aria-live="polite"
          />
        </div>
      </div>
      <div className={styles.search__wrapper}>
        {query && (
          <div>
            <h1 className={styles.hOnes} id="tips">
              Search Results for - '{query}'
            </h1>
          </div>
        )}
        {query && searchResult.length == 0 ? (
          <div className={styles.no__result}>
            No result found. Try again with another query.
          </div>
        ) : (
          <div
            className={styles.search__output__wrapper}
            id="search-output-box">
            {searchResult.map(
              (post: {
                _id: string;
                title: string;
                slug: string;
                description: string;
                content: string;
                author: string;
                categories: Array<string>;
                avatar: string;
                readingTime: string;
                views: number;
                createdAt: Date;
              }) => (
                <Link href={`/post/${post.slug}`} key={post._id}>
                  <div className={styles.search__output__box}>
                    <div className={styles.search__output__box__text}>
                      <div className={styles.search__output__box__text__title}>
                        {post.title}
                      </div>
                      <div className={styles.search__output__box__text__desc}>
                        {post.description}
                      </div>
                      <div className={styles.search__output__box__others}>
                        <span>
                          {new Date(post.createdAt).toDateString().slice(4)}
                        </span>
                        <span>{post.views} views</span>
                        <span>{post.readingTime}</span>
                      </div>
                    </div>
                    <div className={styles.search__output__box__icon}>
                      <i className="fa-solid fa-circle-arrow-right"></i>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
