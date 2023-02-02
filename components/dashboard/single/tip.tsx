import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/legacy/image';

import styles from './single.module.css';
import hStyles from '../../header/Header.module.css';
import sStyles from '../../search/styles.module.css';
import 'react-quill/dist/quill.snow.css';

import facebook from '../../../public/icons/facebook.svg';
import linkedin from '../../../public/icons/linkedin.svg';
import twitter from '../../../public/icons/twitter.svg';
import advertsample from '../../../public/images/advertsample.png';
import arrow from '../../../public/icons/down.svg';
import EditIcon from '../../../public/icons/edit.svg';
import DeleteIcon from '../../../public/icons/delete.svg';
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

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

const readingDuration = [
  {
    value: '2 mins read',
  },
  {
    value: '3 mins read',
  },
  {
    value: '5 mins read',
  },
  {
    value: '7 mins read',
  },
];

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

const SingleTip = ({ tip, user }) => {
  const [isOpen, setOpen] = useState(false);
  const [isOpen2, setOpen2] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [cats, setCats] = useState([]);
  const [tips, setTips] = useState([]);
  const [nextPosts, setNextPosts] = useState([]);

  let authorAvatar = user.profilePicture;
  const [info, setInfo] = useState('');
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLButtonElement>(null);
  const bRefEl = bRef.current;

  const [articleType, setArticleType] = useState(tip.type);
  const [title, setTitle] = useState(tip.title);
  const [desc, setDesc] = useState(tip.description);
  const [banner, setBanner] = useState(tip.banner);
  const [categs, setCategs] = useState(tip.categories);
  const [rt, setRT] = useState(tip?.readingTime);
  const [content, setContent] = useState(tip.content);
  const author = user && user.firstname + ' ' + user.lastname;

  const ref2 = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);

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
    setOpen2(!isOpen2);
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

  /**Handle delete modal */
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

  const handleModal = () => {
    setOpen(!isOpen);
  };

  const toggleEditForm = () => {
    setIsEdit(!isEdit);
  };

  if (isEdit == true) {
    document.body.style.overflowY = 'hidden';
  } else {
    document.body.style.overflowY = 'scroll';
  }

  /**Function to toggle `updateForm` when author clicks edit button */
  function removeItem<T>(arr: Array<T>, value: T): Array<T> {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
  useEffect(() => {
    const categoriesEl =
      document.querySelectorAll<HTMLElement>('#category-option');

    categoriesEl.forEach((option) => {
      let selected = false;
      const CustomSelect = () => {
        if (!selected && !option.hasAttribute('style')) {
          selected = true;
          categs.push(option.innerText);
          setCategs(categs);
          option.setAttribute(
            'style',
            'background-color: var(--bg-color-secondary); color: #fff; transition: background 0.1s ease-in-out',
          );
        } else {
          selected = false;
          if (categs.includes(option.innerText)) {
            for (let i = 0; i < categs.length; i++) {
              if (categs[i] === option.innerText) {
                removeItem(categs, categs[i]);
              }
            }
          }
          setCategs(categs);
          option.removeAttribute('style');
        }
      };
      if (tip.categories.includes(option.innerText)) {
        selected = true;
        option.setAttribute(
          'style',
          'background-color: var(--bg-color-secondary); color: #fff; transition: background 0.1s ease-in-out',
        );
      }

      option.addEventListener('click', CustomSelect);
    });
  }, [isEdit]);

  /**Handle post update */
  const handleUpdate = async () => {
    try {
      await axios.put(
        `${process.env.TIPS_URL}/${tip._id}`,
        {
          type: articleType,
          author: author,
          title: title,
          description: desc,
          banner: banner,
          categories: categs,
          readingTime: rt,
          content: content,
          slug: title.toLowerCase().split(' ').join('-').replace(/\?/g, ''),
          avatar: authorAvatar,
        },
        { withCredentials: true },
      );
      console.log('🎉', 'Your article has been updated successfully!');
      router.push('/dashboard/tips');
    } catch (err) {
      if (
        err.response.data ==
        'Too many requests coming from this IP, please try again after 15 minutes.'
      ) {
        setInfo(err.response.data);
      } else setInfo(err.response.data.message);
    }
  };

  /**Handle post delete */
  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.TIPS_URL}/${tip._id}`, {
        data: { author: author },
        withCredentials: true,
      });
      router.push('/dashboard/tips');
    } catch (err) {
      if (
        err.response.data ==
        'Too many requests coming from this IP, please try again after 15 minutes.'
      ) {
        setInfo(err.response.data);
      } else setInfo(err.response.data.message);
    }
  };

  /**Prevent XSS from Editor*/
  const sanitizeData = () => ({
    __html: DOMPurify.sanitize(tip.content),
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
    )}&text=${encodeURIComponent(tip.title)}`;
    window.open(navUrl, '_blank');
  };

  const shareOnLinkedIn = () => {
    const navUrl = `http://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      url,
    )}&title=${encodeURIComponent(url)}`;
  };

  if (bRef && bRefEl) {
    const disableButton = () => {
      if (articleType === '') {
        bRefEl.setAttribute(
          'style',
          'pointer-events: none; cursor:not-allowed; background-color: #ddd9d9',
        );
      } else {
        bRefEl.removeAttribute('style');
      }
    };
    disableButton();
  }

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
            {isOpen2 && (
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
          <div className={styles.parent}>
            {isEdit && (
              <div className={styles.formContainer} id="form-container">
                <div className={styles.form} id="update">
                  <h1 className={styles.form__header}>Update Tip</h1>
                  <div className={styles.article__type}>
                    <label>Choose article type:</label>
                    <br />
                    <br />
                    <span
                      className={styles.article__type__post}
                      id="type-post"
                      onClick={(e) => {
                        let selected = false;
                        const el = e.target as HTMLSpanElement;
                        const nextSibling =
                          el.nextElementSibling as HTMLSpanElement;

                        if (!selected && !el.hasAttribute('style')) {
                          selected = true;
                          el.setAttribute(
                            'style',
                            `background-color: var(--bg-color-secondary); color: #fff`,
                          );
                          nextSibling.setAttribute(
                            'style',
                            'pointer-events: none',
                          );
                          setArticleType(el.innerText);
                        } else {
                          selected = false;
                          el.removeAttribute('style');
                          nextSibling.removeAttribute('style');
                          setArticleType('');
                        }
                      }}>
                      Post
                    </span>
                    <span
                      className={styles.article__type__tip}
                      id="type-tip"
                      onClick={(e) => {
                        let selected = false;
                        const el = e.target as HTMLSpanElement;
                        const previousSibling =
                          el.previousElementSibling as HTMLSpanElement;

                        if (!selected && !el.hasAttribute('style')) {
                          selected = true;
                          el.setAttribute(
                            'style',
                            `background-color: var(--bg-color-secondary); color: #fff`,
                          );
                          previousSibling.setAttribute(
                            'style',
                            'pointer-events: none',
                          );
                          setArticleType(el.innerText);
                        } else {
                          selected = false;
                          el.removeAttribute('style');
                          previousSibling.removeAttribute('style');
                          setArticleType('');
                        }
                      }}>
                      Tip
                    </span>
                  </div>
                  <div
                    className={styles.input}
                    contentEditable="true"
                    onInput={(e: any) => setTitle(e.target.innerText)}
                    suppressContentEditableWarning={true}>
                    {tip.title}
                  </div>

                  <div
                    className={styles.input}
                    contentEditable="true"
                    onInput={(e: any) => setDesc(e.target.innerText)}
                    suppressContentEditableWarning={true}>
                    {tip.description}
                  </div>
                  <div
                    className={styles.input}
                    contentEditable="true"
                    onInput={(e: any) => setBanner(e.target.innerText)}
                    suppressContentEditableWarning={true}>
                    {tip.banner}
                  </div>

                  <div
                    className={styles.categories__options}
                    id="categories-options">
                    {cats.map((cat: any, index: number) => {
                      return (
                        <span
                          key={index}
                          className={styles.cat__option}
                          id="category-option">
                          {cat.name.toLowerCase()}
                        </span>
                      );
                    })}
                  </div>

                  <div>
                    <select
                      className={styles.options}
                      name="reading-time"
                      onChange={(e) => setRT(e.target.value)}
                      required>
                      <option value={tip.readingTime}>{tip.readingTime}</option>
                      {readingDuration.map((duration, index) => {
                        while (duration.value !== tip.readingTime) {
                          return (
                            <option value={duration.value} key={index}>
                              {duration.value}
                            </option>
                          );
                        }
                      })}
                    </select>
                  </div>
                  <ReactQuill
                    modules={modules}
                    theme="snow"
                    defaultValue={tip.content}
                    onChange={setContent}
                    placeholder="Content goes here..."
                  />

                  <div className={styles.submitButtonContainer}>
                    <button
                      onClick={handleUpdate}
                      className={styles.submitButton}>
                      Submit
                    </button>
                    <button
                      onClick={toggleEditForm}
                      className={styles.submitButton}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className={styles.container}>
              <header className={styles.header}>
                <div className={styles.top__section}>
                  <h1>{tip.title}</h1>
                  {tip.author === author && (
                    <div className={styles.owner__icons}>
                      <Image
                        src={EditIcon}
                        width={30}
                        height={20}
                        alt=""
                        id="edit-icon"
                        onClick={toggleEditForm}
                        priority
                      />
                      <Image
                        src={DeleteIcon}
                        width={30}
                        height={20}
                        layout="fixed"
                        alt=""
                        onClick={handleModal}
                        priority
                      />
                    </div>
                  )}
                </div>
                {isOpen && (
                  <div className={styles.modal} ref={ref}>
                    <span
                      className={styles.hiddenNav__closebtn}
                      onClick={handleModal}>
                      ⨉
                    </span>
                    <div className={styles.prompt}>
                      Are you sure you wanted to delete this tip article?
                    </div>
                    <div className={styles.button__container}>
                      <button onClick={handleDelete}>Yes</button>
                      <button onClick={handleModal}>No</button>
                    </div>
                  </div>
                )}
                <p className={styles.post__description}>{tip.description}</p>
              </header>

              <section className={styles.main}>
                <div className={styles.author}>
                  <div className={styles.author__info}>
                    <Link href={`/?author=${tip.author}`} legacyBehavior>
                      <a>
                        <img
                          src={tip.avatar}
                          className={styles.avatar}
                          alt="Profile Image"
                        />
                      </a>
                    </Link>
                    <span>{tip.author}</span>
                  </div>
                  {tip.lastUpdated && (
                    <time>
                      Last edited on
                      {' ' + new Date(tip.lastUpdated).toDateString().slice(4)}
                    </time>
                  )}
                </div>
                <div className={styles.top}>
                  <Image
                    src={tip.banner}
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
                  </div>
                  <aside className={styles.aside}>
                    <div className={styles.tags}>
                      <ul className={styles.tags__links}>
                        {tip.categories.map((cat: string, index: number) => {
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
                        {tips.slice(0, 3).map((tip: any, index: number) => {
                          const match = tip.categories.some((i: any) =>
                            tip.categories.includes(i),
                          );
                          if (match == true)
                            return <Tip tip={tip} key={index} />;
                        })}
                      </div>
                    </div>
                  </aside>
                </div>
              </section>

              <section className={styles.readnext}>
                <div className={styles.readnext__head}>
                  <Image src={arrow} width={15} height={25} alt="arrow" />
                  <span className={styles.readnext__headtext}>Read next</span>
                </div>
                <div className={styles.read__next}>
                  {shuffle(Array.from(nextPosts))
                    .slice(0, 1)
                    .map(
                      (next: { title: string; _id: string }, index: number) => {
                        const checkTitle = next.title !== tip.title;
                        return (
                          checkTitle && <NextPost post={next} key={index} />
                        );
                      },
                    )}
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

export default SingleTip;
