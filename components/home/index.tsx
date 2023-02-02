import styles from './styles.module.css';
import hStyles from '../header/Header.module.css';
import Header from '../header/Header';
import Post from '../post/post';
import Tip from '../tip/tip';
import Subscription from '../subscription/subscription';
import Footer from '../footer/Footer';
import { useContext, useEffect, useRef, useState } from 'react';
import SearchUI from '../search';
import Link from 'next/link';
import axios from 'axios';
import MenuIcon from '../../public/icons/menuicon.svg';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import { Context } from '../../context/context';

const Posts = ({ posts, tips }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const { state } = useContext(Context);
  const { auth } = state;
  const router = useRouter();

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
  return (
    <div className={styles.container} aria-live="polite">
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
        </div>
      </div>
      <div className={styles.parent__wrapper}>
        {query ? (
          <div>
            <h1 className={styles.hOnes} id="tips">
              Search Results for - '{query}'
            </h1>
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
                  }) => {
                    return (
                      <Link href={`/post/${post.slug}`} key={post._id}>
                        <div className={styles.search__output__box}>
                          <div className={styles.search__output__box__text}>
                            <div
                              className={
                                styles.search__output__box__text__title
                              }>
                              {post.title}
                            </div>
                            <div
                              className={
                                styles.search__output__box__text__desc
                              }>
                              {post.description}
                            </div>
                            <div className={styles.search__output__box__others}>
                              <span>
                                {new Date(post.createdAt)
                                  .toDateString()
                                  .slice(4)}
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
                    );
                  },
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.main__wrapper}>
            <main className={styles.main} id="main">
              <h1 className={styles.hOnes} id="latest">
                Latest
              </h1>
              <section className={styles.article}>
                {posts
                  .sort((a: { createdAt: Date }, b: { createdAt: Date }) => {
                    {
                      return a.createdAt > b.createdAt ? -1 : 1;
                    }
                  })
                  .map(
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
                    }) => {
                      return <Post post={post} key={post._id} />;
                    },
                  )}
              </section>
              <h1 className={styles.hOnes} id="popular">
                Popular
              </h1>
              <section className={styles.article}>
                {posts
                  .sort((a: { visits: number }, b: { visits: number }) => {
                    {
                      return a.visits > b.visits ? -1 : 1;
                    }
                  })
                  .map(
                    (post: {
                      _id: string;
                      title: string;
                      slug: string;
                      description: string;
                      content: string;
                      author: string;
                      categories: string;
                      avatar: string;
                      readingTime: string;
                    }) => {
                      return <Post post={post} key={post._id} />;
                    },
                  )}
              </section>
              <h1 className={styles.hOnes} id="tips">
                Tips
              </h1>
              <section className={styles.tipscard}>
                {tips.map(
                  (tip: {
                    _id: string;
                    title: string;
                    slug: string;
                    description: string;
                    content: string;
                    author: string;
                    categories: string;
                    avatar: string;
                    readingTime: string;
                  }) => {
                    return <Tip tip={tip} key={tip._id} />;
                  },
                )}
              </section>
            </main>
          </div>
        )}
      </div>
      <section className={styles.mail__subscription}>
        <Subscription />
      </section>
      <Footer />
    </div>
  );
};

export default Posts;
