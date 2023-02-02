import card from './post.module.css';
import Link from 'next/link';

const Post = ({ post }) => {
  return (
    <article className={card.container} id="post">
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
            <h3 className={card.title} id="post-title">
              {post.title}
            </h3>
          </a>
        </Link>

        <p className={card.desc}>{post.description}</p>
        <p className={card.reading__time} id="reading-time">
          {post.readingTime}
        </p>
      </div>
      <div className={card.categories}>
        {post.categories.map((category: string, index: number) => {
          return (
            <Link href={`/?cat=${category}`} key={index} legacyBehavior>
              <a>
                <span className={card.tag} id="tag">
                  {category.toLowerCase()}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
      <div className={card.author} id="author">
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

export default Post;
