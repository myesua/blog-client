import React from 'react';
import styles from './performance.module.css';

const PerformanceUI = ({ posts, tips, pending, rejected }) => {
  // Performance based on Posts or Tips and number of rejected articles.
  let content: string;
  let quality: string;
  const excellent =
    (posts.length >= 20 && rejected.length >= 1 && rejected.length < 3) ||
    (tips.length >= 20 && rejected.length >= 1 && rejected.length < 3);
  const verygood =
    (posts.length >= 15 &&
      posts.length < 20 &&
      rejected.length >= 1 &&
      rejected.length < 3) ||
    (tips.length >= 15 &&
      tips.length < 20 &&
      rejected.length >= 1 &&
      rejected.length < 3);
  const good =
    (posts.length >= 10 &&
      posts.length < 15 &&
      rejected.length >= 3 &&
      rejected.length < 5) ||
    (tips.length >= 10 &&
      tips.length < 15 &&
      rejected.length >= 3 &&
      rejected.length < 5);
  const fair =
    (posts.length >= 5 &&
      posts.length < 10 &&
      rejected.length >= 3 &&
      rejected.length < 5) ||
    (tips.length >= 5 &&
      tips.length < 10 &&
      rejected.length >= 3 &&
      rejected.length < 5);
  const poor =
    (posts.length >= 1 && posts.length < 5 && rejected.length >= 0) ||
    (tips.length >= 1 && tips.length < 5 && rejected.length >= 0);
  const verypoor =
    (posts.length >= 1 && posts.length < 5 && rejected.length >= 5) ||
    (tips.length >= 1 && tips.length < 5 && rejected.length >= 5);

  if (excellent) {
    content = '80%';
    quality = '90%';
  } else if (verygood) {
    content = '70%';
    quality = '75%';
  } else if (good) {
    content = '60%';
    quality = '65%';
  } else if (fair) {
    content = '30%';
  } else if (poor) {
    content = '10%';
    quality = '45%';
  } else if (verypoor) {
    content = '10%';
    quality = '20%';
  } else {
    content = '0%';
    quality = '0%';
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span>Performance</span>
        <span className={styles.colon}>:</span>
      </div>
      <div className={styles.card__stats}>
        <div className={styles.card__stats__content}>
          <span>{content}</span>
          <span className={styles.card__stats__text}>Content</span>
        </div>
        <div className={styles.card__stats__quality}>
          <span>{quality}</span>
          <span className={styles.card__stats__text}>Quality</span>
        </div>
      </div>
      <div className={styles.card__stats__details}>
        <span>
          <i className="fa-solid fa-check"></i>
          <span>
            Content
            <span className={styles.card__stats__details__fade}>verified</span>
          </span>
        </span>
        <span>
          <i className="fa-solid fa-check"></i>
          <span>
            Quality
            <span className={styles.card__stats__details__fade}>checked</span>
          </span>
        </span>
        <span>
          <i className="fa-solid fa-check"></i>
          <span>
            Author
            <span className={styles.card__stats__details__fade}>approved</span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default PerformanceUI;
