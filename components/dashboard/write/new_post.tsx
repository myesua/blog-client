import React, { useEffect, useRef, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import styles from './write.module.css';
import axios from 'axios';
import dynamic from 'next/dynamic';

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

const Create = ({ user }) => {
  let author = user && user.first_name + ' ' + user.last_name;
  let authorAvatar = user && user.profile_picture;

  const [info, setInfo] = useState('');

  const [articleType, setArticleType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [banner, setBanner] = useState('');
  const [categs, setCategs] = useState([]);
  const [readingTime, setReadingTime] = useState('2 mins read');
  const [value, setValue] = useState('');

  const [cats, setCats] = useState([]);
  const bRef = useRef<HTMLButtonElement>(null);
  const bRefEl = bRef.current;

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get(`${process.env.CATEGORIES_URL}`, {
          withCredentials: true,
        });
        setCats(
          res.data.categories.map((category: any) => ({
            name: category.name,
          })),
        );
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
    getCategories();
  }, []);

  useEffect(() => {
    const typePost = document.getElementById('type-post') as HTMLSpanElement;
    const typeTip = document.getElementById('type-tip') as HTMLSpanElement;
    let selected = false;
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const newArticle = {
      type: articleType,
      title,
      description,
      banner,
      categories: categs,
      readingTime,
      content: value,
      author: author,
      avatar: authorAvatar,
    };
    try {
      const res = await axios.post(
        `${process.env.PENDING_URL}/new`,
        newArticle,
        { withCredentials: true },
      );
      window.location.replace(`/dashboard/pending/${res.data._data.slug}`);
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

  function removeItem<T>(arr: Array<T>, value: T): Array<T> {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

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
    <>
      <div className={styles.container}>
        <form className={styles.wrapper} onSubmit={handleSubmit} id="create">
          <h1 className={styles.header}>Create new article</h1>
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
                const nextSibling = el.nextElementSibling as HTMLSpanElement;

                if (!selected && !el.hasAttribute('style')) {
                  selected = true;
                  el.setAttribute(
                    'style',
                    `background-color: var(--bg-color-secondary); color: #fff`,
                  );
                  nextSibling.setAttribute('style', 'pointer-events: none');
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
                  previousSibling.setAttribute('style', 'pointer-events: none');
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

          <div>
            <input
              className={styles.input}
              type="text"
              name="title"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              className={styles.input}
              type="text"
              name="description"
              placeholder="Post description"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              className={styles.input}
              type="text"
              name="banner"
              placeholder="Enter image url for post banner..."
              onChange={(e) => setBanner(e.target.value)}
              required
            />
          </div>
          <div className={styles.categories__options} id="categories-options">
            {cats.map((cat: any, index: number) => {
              return (
                <span
                  key={index}
                  className={styles.cat__option}
                  id="category-option"
                  onClick={(e) => {
                    let selected = false;
                    const option = e.target as HTMLSpanElement;
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
                  }}>
                  {cat.name.toLowerCase()}
                </span>
              );
            })}
          </div>
          <div>
            <select
              className={styles.options}
              name="reading-time"
              onChange={(e) => setReadingTime(e.target.value)}
              required>
              <option value="2 mins read">2 mins read</option>
              <option value="3 mins read">3 mins read</option>
              <option value="5 mins read">5 mins read</option>
              <option value="7 mins read">7 mins read</option>
            </select>
          </div>
          <ReactQuill
            modules={modules}
            theme="snow"
            onChange={setValue}
            placeholder="Content goes here..."
          />

          <div className={styles.submitButtonContainer}>
            <button
              type="submit"
              className={styles.submitButton}
              ref={bRef}
              id="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Create;
