import React, { Key, useState } from 'react';
import styles from './styles.module.css';
import Link from 'next/link';
import card from '../../../post/post.module.css';
import Pagination from '../../../pagination';
import { paginate } from '../../../../helpers';

const TasksUI = ({ tasks }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 2;

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedTasks = paginate(tasks, currentPage, pageSize);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper} aria-live="polite">
        <h5 className={styles.heading}>Tasks</h5>
        <div className={styles.main} id="main">
          {tasks.length !== 0
            ? paginatedTasks.map(
                (task: {
                  _id: string;
                  slug: string;
                  banner: string;
                  description: string;
                  readingTime: string;
                  categories: any;
                  author: string;
                  avatar: string;
                  createdAt: string | number | Date;
                  title: string;
                }) => {
                  return (
                    <article
                      className={card.container}
                      id="task"
                      key={task._id}>
                      <div className={card.head}>
                        <Link
                          href={`/dashboard/admin/task/${task.slug}`}
                          legacyBehavior>
                          <a>
                            <img
                              src={task.banner}
                              className={card.image}
                              alt="task Image"
                            />
                          </a>
                        </Link>
                      </div>
                      <div className={card.body}>
                        <Link
                          href={`/dashboard/admin/task/${task.slug}`}
                          legacyBehavior>
                          <a>
                            <h3 className={card.title} id="task-title">
                              {task.title}
                            </h3>
                          </a>
                        </Link>

                        <p className={card.desc}>{task.description}</p>
                        <p className={card.reading__time} id="reading-time">
                          {task.readingTime}
                        </p>
                      </div>
                      <div className={card.categories}>
                        {task.categories.map((category: any) => {
                          return (
                            <Link href={`/?cat=${category}`} legacyBehavior>
                              <a>
                                <span
                                  className={card.tag}
                                  id="tag"
                                  key={category._id}>
                                  {category.toLowerCase()}
                                </span>
                              </a>
                            </Link>
                          );
                        })}
                      </div>
                      <div className={card.author} id="author">
                        <Link href={`/?user=${task.author}`} legacyBehavior>
                          <a>
                            <img
                              src={task.avatar}
                              className={card.avatar}
                              alt="Profile Image"
                            />
                          </a>
                        </Link>
                        <time className={card.time}>
                          {new Date(task.createdAt).toDateString().slice(4)}
                        </time>
                      </div>
                    </article>
                  );
                },
              )
            : 'You have no task for review at the moment. Please check back later.'}
        </div>
        <Pagination
          items={tasks.length} // tasks length
          currentPage={currentPage} // 1
          pageSize={pageSize} // tasks per page
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default TasksUI;
