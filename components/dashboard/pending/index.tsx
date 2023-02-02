import styles from './styles.module.css';
import Link from 'next/link';
import { Key } from 'react';

const Pending = ({ a }) => {
  return (
    <article className={styles.container} id="pending">
      <div className={styles.head}>
        <Link href={`/dashboard/pending/${a.slug}`}>
          <img src={a.banner} className={styles.image} alt="Pending Image" />
        </Link>
      </div>
      <div className={styles.body}>
        <Link href={`/dashboard/pending/${a.slug}`} legacyBehavior>
          <a>
            <h3 className={styles.title} id="pending-title">
              {a.title}
            </h3>
          </a>
        </Link>

        <p className={styles.desc}>{a.description}</p>
        <p className={styles.reading__time} id="reading-time">
          {a.readingTime}
        </p>
      </div>
      <div className={styles.categories}>
        {a.categories.map((category: string, index: Key) => {
          return (
            <Link href={`/?cat=${category}`} legacyBehavior key={index}>
              <a>
                <span className={styles.tag} id="tag">
                  {category.toLowerCase()}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
      <div className={styles.author} id="author">
        <Link href={`/?user=${a.author}`} legacyBehavior>
          <a>
            <img src={a.avatar} className={styles.avatar} alt="Profile Image" />
          </a>
        </Link>
        <time className={styles.time}>
          {new Date(a.createdAt).toDateString().slice(4)}
        </time>
      </div>
    </article>
  );
};

export default Pending;
