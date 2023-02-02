import React, { Key, useState } from 'react';
import styles from './styles.module.css';
import Pagination from '../../pagination';
import { paginate } from '../../../helpers';
import Pending from '../pending';

const UserPendingUI = ({ pending }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedPending = paginate(pending, currentPage, pageSize);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper} aria-live="polite">
        <h5 className={styles.heading}>Your Pending Articles</h5>
        <div className={styles.main}>
          {pending.length !== 0
            ? paginatedPending.map(
                (pending: {
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
                  return <Pending a={pending} />;
                },
              )
            : 'You do not have nay pending article for now.'}
        </div>
        <Pagination
          items={pending.length} // pending articles length
          currentPage={currentPage} // 1
          pageSize={pageSize} // pending articles per page
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default UserPendingUI;
