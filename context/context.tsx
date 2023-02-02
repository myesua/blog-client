import axios from 'axios';
import { useRouter } from 'next/router';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useReducer,
  useState,
} from 'react';
import Reducer from './reducer';

type InitialStateType = {
  auth: string;
};

const INITIAL_STATE = {
  auth:
    (typeof window !== 'undefined' &&
      JSON.parse(localStorage.getItem('auth'))) ||
    'false',
};

export const Context = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<any>;
  posts: any[];
  setPosts: Dispatch<SetStateAction<[]>>;
  tips: any[];
  setTips: Dispatch<SetStateAction<[]>>;
  categories: any[];
  setCategories: Dispatch<SetStateAction<[]>>;
  tasks: any[];
  setTasks: Dispatch<SetStateAction<[]>>;
}>({
  state: INITIAL_STATE,
  dispatch: () => null,
  posts: [],
  setPosts: () => null,
  tips: [],
  setTips: () => null,
  categories: [],
  setCategories: () => null,
  tasks: [],
  setTasks: () => null,
});

export const AuthProvider = ({ children }: any) => {
  const router = useRouter();
  const path = router.asPath; // used for query filter.
  const query = path.split('/')[1];
  const filter = query === '' || query.startsWith('?');
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);
  const [posts, setPosts] = useState([]);
  const [tips, setTips] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [info, setInfo] = useState('');

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(state.auth));
  }, [state.auth]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        // If `${path}` is `/`, it returns all articles, else it returns filtered articles.
        if (filter) {
          const res = await axios.get(`${process.env.POSTS_URL}` + path, {
            withCredentials: true,
          });
          setPosts(res.data.posts);
        }
      } catch (err) {
        if (err.message === 'Network Error')
          return <h1 style={styles}>500 - Server-side error occurred</h1>;
        else if (
          err.response.data ==
          'Too many request coming from this IP, please try again after 15 minutes'
        ) {
          setInfo(err.response.data);
        } else setInfo(err.response.data.message);
      }
    };
    const getTips = async () => {
      try {
        if (filter) {
          const res = await axios.get(`${process.env.TIPS_URL}` + path, {
            withCredentials: true,
          });
          setTips(res.data.tips);
        }
      } catch (err) {
        if (err.message === 'Network Error')
          return <h1 style={styles}>500 - Server-side error occurred</h1>;
        else if (
          err.response.data ==
          'Too many requests coming from this IP, please try again after 15 minutes.'
        ) {
          setInfo(err.response.data);
        } else setInfo(err.response.data.message);
      }
    };
    getPosts();
    getTips();
  }, [path]);

  const styles = {
    display: 'grid',
    placeItems: 'center',
    height: '100vh',
    width: '100%',
    color: 'var(--error-color)',
  };

  if (info) {
    return (
      <div style={styles}>
        <div>{info}</div>
      </div>
    );
  }

  return (
    <Context.Provider
      value={{
        state,
        dispatch,
        posts,
        setPosts,
        tips,
        setTips,
        categories,
        setCategories,
        tasks,
        setTasks,
      }}>
      {children}
    </Context.Provider>
  );
};
