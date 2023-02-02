import card from './nextpost.module.css';
import Link from 'next/link';

const NextPost = ({ post }) => {
  return (
    <article className={card.container}>
      <div className={card.head}>
        <Link href={`/post/${post.slug}`} legacyBehavior>
          <a>
            <img src={post.banner} className={card.image} alt="Post Image" />
          </a>
        </Link>
      </div>
      <div className={card.body}>
        <Link href={`/post/${post.slug}`} legacyBehavior>
          <a>
            <h3 className={card.title}>{post.title}</h3>
          </a>
        </Link>
        <p className={card.desc}>{post?.description}</p>
        <p className={card.reading__time}>{post.readingTime}</p>
      </div>
      <div className={card.categories}>
        {post.categories.map((category: string, index: number) => {
          return (
            <Link href={`/?cat=${category}`} key={index} legacyBehavior>
              <a className={card.tag}>{category.toLowerCase()}</a>
            </Link>
          );
        })}
      </div>
      <div className={card.author}>
        <Link href={`/?author=${post.author}`} legacyBehavior>
          <a>
            <img
              src={post.avatar}
              className={card.avatar}
              alt="Profile Image"
            />
          </a>
        </Link>
        <time className={card.time}>
          {new Date(post.createdAt).toDateString().slice(4)}
        </time>
      </div>
    </article>
  );
};

export default NextPost;
