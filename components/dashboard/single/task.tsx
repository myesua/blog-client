import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/legacy/image';

import styles from './single.module.css';
import hStyles from '../../header/Header.module.css';
import sStyles from '../../search/styles.module.css';

import facebook from '../../../public/icons/facebook.svg';
import linkedin from '../../../public/icons/linkedin.svg';
import twitter from '../../../public/icons/twitter.svg';
import advertsample from '../../../public/images/advertsample.png';
import MenuIcon from '../../../public/icons/menuicon.svg';

import axios from 'axios';
import DOMPurify from 'dompurify';
import dynamic from 'next/dynamic';

import Header from '../../header/Header';
import Tip from '../../tip/tip';
import NextPost from '../../post/nextPost';
import Subscription from '../../subscription/subscription';
import Footer from '../../footer/Footer';
import { Context } from '../../../context/context';

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

const SingleTask = ({ task }) => {
  const [isOpen, setOpen] = useState(false);
  const [isOpen2, setOpen2] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [cats, setCats] = useState([]);
  const [tips, setTips] = useState([]);
  const [nextPosts, setNextPosts] = useState([]);

  const [info, setInfo] = useState('');
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const approveEl = useRef<HTMLDivElement>(null);
  const disapproveEl = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description);
  const [banner, setBanner] = useState(task.banner);
  const [categs, setCategs] = useState(task.categories);
  const [rt, setRT] = useState(task?.readingTime);
  const [content, setContent] = useState(task.content);

  const sRef = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);

  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const { state } = useContext(Context);
  const { auth } = state;
  const [approve, setApprove] = useState('');
  const [disapprove, setDisApprove] = useState('');

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
          if (
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

  const handleInput = (e: any) => {
    setQuery(e.target.value);
  };

  const handleHiddenNav = () => {
    setOpen(!isOpen);
  };

  /**Get data from server */
  useEffect(() => {
    const getResources = async () => {
      try {
        const res = await axios.get(`${process.env.CATEGORIES_URL}`, {
          withCredentials: true,
        });
        setCats(res.data.categories);
        const res_ = await axios.get(`${process.env.TIPS_URL}`);
        setTips(res_.data.tips);
        const res__ = await axios.get(`${process.env.POSTS_URL}`);
        setNextPosts(res__.data.posts);
      } catch (err) {
        if (
          err.response.data ==
          'Too many requests coming from this IP, please try again after 15 minutes.'
        ) {
          setInfo(err.response.data);
        } else setInfo(err.response.data.message);
      }
    };
    getResources();
  }, []);

  /**Handle outside click (modal) */
  useEffect(() => {
    const checkOutsideClick = (e: { target: any }) => {
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', checkOutsideClick);

    return () => {
      document.removeEventListener('mousedown', checkOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    const checkOutsideClick = (e: { target: any }) => {
      if (isOpen2 && ref2.current && !ref2.current.contains(e.target)) {
        setOpen2(false);
      }
    };

    document.addEventListener('mousedown', checkOutsideClick);

    return () => {
      document.removeEventListener('mousedown', checkOutsideClick);
    };
  }, [isOpen2]);

  const handleModal = () => {
    setOpen(!isOpen);
  };
  const handleModal2 = () => {
    setOpen2(!isOpen2);
  };

  const handleApprove = async () => {
    try {
      const res = await axios.get(
        `${process.env.ADMIN_URL}/task/approve/${task.slug}`,
        { withCredentials: true },
      );
      approveEl.current.setAttribute('style', 'opacity: 1, right: 0');
      approveEl.current.previousElementSibling.setAttribute(
        'style',
        'opacity: 0, right: -100px',
      );
      setOpen(false);
      setTimeout(() => router.push('/dashboard/admin/tasks'), 3000);
      // console.log(res.data);
    } catch (err) {
      if (
        err.response.data ==
        'Too many requests coming from this IP, please try again after 15 minutes.'
      ) {
        approveEl.current.innerText = err.response.data;
      } else {
        approveEl.current.innerText = err.response.data.message;
      }
      setOpen(false);
      setTimeout(() => router.push('/dashboard/admin/tasks'), 3000);
      // console.log(err);
    }
  };

  const handleDisApprove = async () => {
    try {
      const res = await axios.get(
        `${process.env.ADMIN_URL}/task/reject/${task.slug}`,
        { withCredentials: true },
      );
      disapproveEl.current.setAttribute('style', 'opacity: 1, right: 0');
      disapproveEl.current.previousElementSibling.setAttribute(
        'style',
        'opacity: 0, right: -100px',
      );
      setOpen2(false);
      setTimeout(() => router.push('/dashboard/admin/tasks'), 3000);
      // console.log(res.data);
    } catch (err) {
      if (
        err.response.data ==
        'Too many requests coming from this IP, please try again after 15 minutes.'
      ) {
        disapproveEl.current.innerText = err.response.data;
      } else disapproveEl.current.innerText = err.response.data.message;
      setOpen2(false);
      setTimeout(() => router.push('/dashboard/admin/tasks'), 3000);
    }
  };

  /**Prevent XSS from Editor*/
  const sanitizeData = () => ({
    __html: DOMPurify.sanitize(task.content),
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
    )}&text=${encodeURIComponent(task.title)}`;
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
              <div className={hStyles.hiddenNav} ref={sRef}>
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
          <div className={styles.parent}>
            <div className={styles.container}>
              <header className={styles.header}>
                <div className={styles.top__section}>
                  <h1>{task.title}</h1>
                </div>
                {isOpen && (
                  <div className={styles.modal} ref={ref}>
                    <span
                      className={styles.hiddenNav__closebtn}
                      onClick={handleModal}>
                      ⨉
                    </span>
                    <div className={styles.prompt}>
                      Are you sure you wanted to{' '}
                      <strong style={{ color: 'goldenrod' }}>approve</strong>{' '}
                      this article?
                    </div>
                    <div className={styles.button__container}>
                      <button onClick={handleApprove}>Yes</button>
                      <button onClick={handleModal}>No</button>
                    </div>
                  </div>
                )}

                {isOpen2 && (
                  <div className={styles.modal} ref={ref2}>
                    <span
                      className={styles.hiddenNav__closebtn}
                      onClick={handleModal2}>
                      ⨉
                    </span>
                    <div className={styles.prompt}>
                      Are you sure you wanted to{' '}
                      <strong style={{ color: 'red' }}>disapprove</strong> this
                      article?
                    </div>
                    <div className={styles.button__container}>
                      <button onClick={handleDisApprove}>Yes</button>
                      <button onClick={handleModal2}>No</button>
                    </div>
                  </div>
                )}
                <div className={styles.task__icons}>
                  <div
                    className={styles.task__icons__child}
                    onClick={handleModal}>
                    <i
                      className="fa-solid fa-thumbs-up"
                      style={{ color: 'green' }}></i>
                    <div className={styles.tchild}>
                      <span>Approve</span>
                      <span ref={approveEl}>Approve</span>
                    </div>
                  </div>
                  <div
                    className={styles.task__icons__child}
                    onClick={handleModal2}>
                    <i
                      className="fa-solid fa-thumbs-down"
                      style={{ color: 'red' }}></i>
                    <div className={styles.tchild}>
                      <span>Disapprove</span>
                      <span ref={disapproveEl}>Disapprove</span>
                    </div>
                  </div>
                </div>
                <p className={styles.post__description}>{task.description}</p>
              </header>

              <section className={styles.main}>
                <div className={styles.author}>
                  <div className={styles.author__info}>
                    <Link href={`/?author=${task.author}`} legacyBehavior>
                      <a>
                        <img
                          src={task.avatar}
                          className={styles.avatar}
                          alt="Profile Image"
                        />
                      </a>
                    </Link>
                    <span>{task.author}</span>
                  </div>
                  {task.lastUpdated && (
                    <time>
                      Last edited on
                      {' ' + new Date(task.lastUpdated).toDateString().slice(4)}
                    </time>
                  )}
                </div>
                <div className={styles.top}>
                  <Image
                    src={task.banner}
                    width="0"
                    height="0"
                    sizes="100vw"
                    className={styles.top__image}
                    alt="Task Image"
                    priority
                  />
                </div>

                <div className={styles.article}>
                  <div className={styles.article__body}>
                    <div
                      className={styles.body}
                      dangerouslySetInnerHTML={sanitizeData()}></div>
                  </div>
                  <aside className={styles.aside}>
                    <div className={styles.tags}>
                      <ul className={styles.tags__links}>
                        {task.categories.map((cat: string, index: number) => {
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
                  </aside>
                </div>
              </section>
            </div>
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

export default SingleTask;
