import React, { Key, useState } from 'react';
import styles from './styles.module.css';
import Rejected from '../rejected';
import Pagination from '../../pagination';
import { paginate } from '../../../helpers';

const UserRejectedUI = ({ rejected }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedRejected = paginate(rejected, currentPage, pageSize);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper} aria-live="polite">
        <h5 className={styles.heading}>Your Rejected Articles</h5>
        <div className={styles.main}>
          {rejected.length !== 0
            ? paginatedRejected.map(
                (a: {
                  title: string;
                  _id: string;
                  slug: string;
                  banner: string;
                  description: string;
                  readingTime: string;
                  categories: any;
                  author: string;
                  avatar: string;
                  createdAt: string | number | Date;
                }) => {
                  return <Rejected a={a} />;
                },
              )
            : 'You do not have any disapproved article at the moment.'}
        </div>
        <Pagination
          items={rejected.length} // rejected articles length
          currentPage={currentPage} // 1
          pageSize={pageSize} // rejected articles per page
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default UserRejectedUI;
