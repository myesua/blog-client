import Link from 'next/link';
import card from './tip.module.css';

const Tip = ({ tip }) => {
  return (
    <div className={card.tip} id="tip">
      <header className={card.tipheader}>
        <span>
          <Link href="/" legacyBehavior>
            <a>🔧</a>
          </Link>
        </span>
        <span>
          <Link href="/" legacyBehavior>
            <a>Tips</a>
          </Link>
        </span>
      </header>
      <main className={card.tipbody}>
        <h3 className={card.tiptitle}>
          <Link href={`/tip/${tip.slug}`} legacyBehavior>
            <a>{tip.title}</a>
          </Link>
        </h3>
        <p className={card.desc}>{tip.description}</p>
      </main>
      <footer className={card.tipauthor}>
        <Link href="/dashboard" legacyBehavior>
          <a>
            <img src={tip.avatar} className={card.avatar} alt="Profile Image" />
          </a>
        </Link>
        <time>{new Date(tip.createdAt).toDateString()}</time>
      </footer>
    </div>
  );
};

export default Tip;
