import styles from './styles.module.css';
import Link from 'next/link';
import { Key } from 'react';

const Rejected = ({ a }) => {
  return (
    <article className={styles.container} id="rejected">
      <div className={styles.head}>
        <Link href={`/dashboard/rejected/${a.slug}`}>
          <img src={a.banner} className={styles.image} alt="Rejected Image" />
        </Link>
      </div>
      <div className={styles.body}>
        <Link href={`/dashboard/rejected/${a.slug}`}>
          <h3 className={styles.title} id="rejected-title">
            {a.title}
          </h3>
        </Link>

        <p className={styles.desc}>{a.description}</p>
        <p className={styles.reading__time} id="reading-time">
          {a.readingTime}
        </p>
      </div>
      <div className={styles.categories}>
        {a.categories.map((category: string, index: Key) => {
          return (
            <Link href={`/?cat=${category}`} key={index}>
              <span className={styles.tag} id="tag">
                {category.toLowerCase()}
              </span>
            </Link>
          );
        })}
      </div>
      <div className={styles.author} id="author">
        <Link href={`/?user=${a.author}`}>
          <img src={a.avatar} className={styles.avatar} alt="Profile Image" />
        </Link>
        <time className={styles.time}>
          {new Date(a.createdAt).toDateString().slice(4)}
        </time>
      </div>
    </article>
  );
};

export default Rejected;
