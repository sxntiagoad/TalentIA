import { useEffect, useState } from 'react';
import { getReviews, createReview } from '../api/Reviews.api';

export const useReviews = (revieweeId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews(revieweeId);
        setReviews(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [revieweeId]);

  const addReview = async (newReview) => {
    try {
      await createReview(newReview);
      setReviews(prevReviews => [...prevReviews, newReview]);
    } catch (error) {
      setError(error.message);
    }
  };

  return { reviews, loading, error, addReview };
};
