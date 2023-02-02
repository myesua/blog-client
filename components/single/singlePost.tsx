import React, { Key, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/legacy/image';

import styles from './single.module.css';
import hStyles from '../header/Header.module.css';
import sStyles from '../search/styles.module.css';

import facebook from '../../public/icons/facebook.svg';
import linkedin from '../../public/icons/linkedin.svg';
import twitter from '../../public/icons/twitter.svg';
import advertsample from '../../public/images/advertsample.png';
import arrow from '../../public/icons/down.svg';
import MenuIcon from '../../public/icons/menuicon.svg';

import axios from 'axios';
import DOMPurify from 'dompurify';

import Header from '../header/Header';
import Tip from '../tip/tip';
import NextPost from '../post/nextPost';
import Subscription from '../subscription/subscription';
import Footer from '../footer/Footer';
import { Context } from '../../context/context';

function shuffle(a: any) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

const SinglePost = ({ post }) => {
  const { posts } = useContext(Context);
  const [rating, setRating] = useState(post.rating || 0);
  const [hover, setHover] = useState(0);
  const router = useRouter();
  const [info, setInfo] = useState('');
  const [ratingInfo, setRatingInfo] = useState('');

  const ref2 = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const rRef = useRef<HTMLDivElement>(null);
  const rRefEl = rRef.current;

  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const { state } = useContext(Context);
  const { auth } = state;

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
        const res = await axios.get(`${process.env.POSTS_URL}`, {
          params: {
            search: query,
          },
        });
        setSearchResult(res.data);
      }
    };
    getSearchResults();
  }, [query]);

  const handleInput = (e: any) => {
    setQuery(e.target.value);
  };

  const handleHiddenNav = () => {
    setOpen(!isOpen);
  };

  const handleRating = async () => {
    try {
      const res = await axios.post(
        `${process.env.POSTS_URL}/post/${post._id}`,
        {
          rating,
        },
      );
      setRatingInfo(res.data.message);
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

  const rInfoStyle = ratingInfo
    ? `${styles.rating__info} ${styles.animate}`
    : styles.rating__info;

  if (ratingInfo && rRef && rRefEl) {
    rRefEl.addEventListener('animationend', () => window.location.reload());
  }

  /**Prevent XSS from Editor*/
  const sanitizeData = () => ({
    __html: DOMPurify.sanitize(post.content),
  });

  const url = location.href;

  const shareOnFB = () => {
    const navUrl =
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
    window.open(navUrl, '_blank');
  };

  const shareOnTwitter = () => {
    const navUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url,
    )}&text=${encodeURIComponent(post.title)}`;
    window.open(navUrl, '_blank');
  };

  const shareOnLinkedIn = () => {
    const navUrl = `http://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      url,
    )}&title=${encodeURIComponent(url)}`;
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
    <div className={styles.wrapper}>
      <div className={styles.headerDiv}>
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
                onInput={handleInput}
              />
            </span>
            {isOpen && (
              <div className={hStyles.hiddenNav} ref={ref2}>
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
      </div>
      <div className={sStyles.parent__wrapper}>
        {query ? (
          <div>
            <h1 className={sStyles.hOnes} id="tips">
              Search Results for - '{query}'
            </h1>
            {query && searchResult.length == 0 ? (
              <div className={sStyles.no__result}>
                No result found. Try again with another query.
              </div>
            ) : (
              <div
                className={sStyles.search__output__wrapper}
                id="search-output-box">
                {searchResult.map(
                  (result: {
                    _id: string;
                    type: string;
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
                  }) => {
                    let a = 'post',
                      b = 'tip';
                    let type: string;
                    if (result.type === a) {
                      type = a;
                    } else {
                      type = b;
                    }
                    return (
                      <Link href={`/${type}/${result.slug}`} key={result._id}>
                        <div className={sStyles.search__output__box}>
                          <div className={sStyles.search__output__box__text}>
                            <div
                              className={
                                sStyles.search__output__box__text__title
                              }>
                              {result.title}
                            </div>
                            <div
                              className={
                                sStyles.search__output__box__text__desc
                              }>
                              {result.description}
                            </div>
                            <div
                              className={sStyles.search__output__box__others}>
                              <span>
                                {new Date(result.createdAt)
                                  .toDateString()
                                  .slice(4)}
                              </span>
                              <span>{result.views} views</span>
                              <span>{result.readingTime}</span>
                            </div>
                          </div>
                          <div className={sStyles.search__output__box__icon}>
                            <i className="fa-solid fa-circle-arrow-right"></i>
                          </div>
                        </div>
                      </Link>
                    );
                  },
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.container}>
            <header className={styles.header}>
              <div className={styles.top__section}>
                <h1>{post.title}</h1>
              </div>
              <p className={styles.post__description}>{post.description}</p>
            </header>

            <section className={styles.main}>
              <div className={styles.author}>
                <div className={styles.author__info}>
                  <Link href={`/?author=${post.author}`} legacyBehavior>
                    <a>
                      <img
                        src={post.avatar}
                        className={styles.avatar}
                        alt="Profile Image"
                      />
                    </a>
                  </Link>
                  <span>{post.author}</span>
                </div>
                {post.lastUpdated && (
                  <time>
                    Last edited on
                    {' ' + new Date(post.lastUpdated).toDateString().slice(4)}
                  </time>
                )}
              </div>
              <div className={styles.top}>
                <Image
                  src={post.banner}
                  width="0"
                  height="0"
                  sizes="100vw"
                  className={styles.top__image}
                  alt="Post Image"
                  priority
                />
              </div>

              <div className={styles.article}>
                <div className={styles.article__body}>
                  <div
                    className={styles.body}
                    dangerouslySetInnerHTML={sanitizeData()}></div>

                  <div className={styles.footer}>
                    <span className={styles.footer__head}>
                      Please let us know what you think about this article
                    </span>
                    <br />
                    <span className={styles.footer__text}>
                      How would you rate this aricle?
                    </span>
                    <div className={styles.stars} id="stars">
                      {[...Array(5)].map((star, index) => {
                        index += 1;
                        return (
                          <button
                            type="button"
                            key={index}
                            className={
                              index <= (rating || hover)
                                ? styles.on
                                : styles.off
                            }
                            onClick={() => {
                              setRating(index);
                            }}
                            onMouseEnter={() => setHover(index)}
                            onMouseLeave={() => setHover(rating)}
                            onDoubleClick={() => {
                              setRating(0);
                              setHover(0);
                            }}>
                            <span className={styles.star}>&#9733;</span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      className={styles.continue}
                      type="submit"
                      onClick={handleRating}>
                      Rate
                    </button>
                    {ratingInfo && (
                      <span className={rInfoStyle} ref={rRef}>
                        {ratingInfo}
                      </span>
                    )}
                  </div>
                </div>
                <aside className={styles.aside}>
                  <div className={styles.tags}>
                    <ul className={styles.tags__links}>
                      {post.categories.map((cat: string, index: number) => {
                        return (
                          <Link
                            href={`/?cat=${cat}`}
                            key={index}
                            legacyBehavior>
                            <a>
                              <li>{cat}</li>
                            </a>
                          </Link>
                        );
                      })}
                    </ul>
                  </div>
                  <div className={styles.share}>
                    <h5>Share article</h5>
                    <ul className={styles.share__links}>
                      <li>
                        <img
                          alt="facebook"
                          src={facebook.src}
                          onClick={shareOnFB}
                        />
                      </li>
                      <li>
                        <img
                          alt="twitter"
                          src={twitter.src}
                          onClick={shareOnTwitter}
                        />
                      </li>
                      <li>
                        <img
                          alt="linkedin"
                          src={linkedin.src}
                          onClick={shareOnLinkedIn}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className={styles.advertsample}>
                    <a href="#">
                      <img src={advertsample.src} alt="Image" />
                    </a>
                  </div>
                  <div className={styles.related}>
                    <h5>Related</h5>
                    <div className={styles.related__child}>
                      {posts
                        .slice(0, 3)
                        .map(
                          (next: {
                            _id: string;
                            title: string;
                            slug: string;
                            description: string;
                            content: string;
                            author: string;
                            categories: Array<string>;
                            avatar: string;
                            readingTime: string;
                          }) => {
                            const match = post.categories.some((i: string) => {
                              next.categories.includes(i);
                            });
                            if (match == true && next.title !== post.title)
                              return <NextPost post={next} key={next._id} />;
                          },
                        )}
                    </div>
                  </div>
                </aside>
              </div>
            </section>

            <section className={styles.readnext}>
              <div className={styles.readnext__head}>
                <Image
                  src={arrow}
                  width={15}
                  height={25}
                  alt="arrow"
                  priority
                />
                <span className={styles.readnext__headtext}>Read next</span>
              </div>
              <div className={styles.read__next}>
                {shuffle(Array.from(posts))
                  .slice(0, 1)
                  .map((next: { title: string; _id: string }) => {
                    const checkTitle = next.title !== post.title;
                    return (
                      checkTitle && <NextPost post={next} key={next._id} />
                    );
                  })}
              </div>
            </section>
          </div>
        )}
      </div>
      <div className={styles.article__page__bottom}>
        <Subscription />
        <Footer />
      </div>
    </div>
  );
};

export default SinglePost;
